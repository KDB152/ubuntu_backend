const axios = require('axios');
const mysql = require('mysql2/promise');

const API_BASE = 'http://localhost:3001';

async function initClassGroups() {
  try {
    console.log('🔍 Initializing class groups...\n');

    // 1. Connexion à la base de données
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    // 2. Récupérer toutes les classes uniques des étudiants
    console.log('📚 Récupération des classes...');
    const [classLevels] = await connection.execute(`
      SELECT DISTINCT class_level 
      FROM students 
      WHERE class_level IS NOT NULL 
      ORDER BY class_level
    `);

    console.log(`✅ Classes trouvées: ${classLevels.length}`);
    classLevels.forEach(cls => console.log(`   - ${cls.class_level}`));

    // 3. Récupérer l'admin
    console.log('\n👨‍💼 Récupération de l\'admin...');
    const [admins] = await connection.execute(`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `);

    if (admins.length === 0) {
      console.log('❌ Aucun admin trouvé');
      return;
    }

    const adminId = admins[0].id;
    console.log(`✅ Admin trouvé: ID ${adminId}`);

    // 4. Créer les groupes pour chaque classe
    for (const classLevel of classLevels) {
      const className = classLevel.class_level;
      console.log(`\n📝 Création du groupe pour ${className}...`);

      // Vérifier si le groupe existe déjà
      const [existingGroups] = await connection.execute(`
        SELECT id FROM groups WHERE class_level = ? AND type = 'class'
      `, [className]);

      let groupId;
      if (existingGroups.length > 0) {
        groupId = existingGroups[0].id;
        console.log(`   ⚠️ Groupe existant trouvé: ID ${groupId}`);
      } else {
        // Créer le groupe
        const [groupResult] = await connection.execute(`
          INSERT INTO groups (name, description, class_level, type, is_active, created_at, updated_at)
          VALUES (?, ?, ?, 'class', true, NOW(), NOW())
        `, [
          `Groupe ${className}`,
          `Groupe de messagerie pour la classe ${className}`,
          className
        ]);

        groupId = groupResult.insertId;
        console.log(`   ✅ Groupe créé: ID ${groupId}`);
      }

      // 5. Ajouter l'admin au groupe
      const [existingAdminParticipant] = await connection.execute(`
        SELECT id FROM group_participants WHERE group_id = ? AND user_id = ?
      `, [groupId, adminId]);

      if (existingAdminParticipant.length === 0) {
        await connection.execute(`
          INSERT INTO group_participants (group_id, user_id, role, is_active, created_at)
          VALUES (?, ?, 'admin', true, NOW())
        `, [groupId, adminId]);
        console.log(`   ✅ Admin ajouté au groupe`);
      } else {
        console.log(`   ⚠️ Admin déjà dans le groupe`);
      }

      // 6. Ajouter tous les étudiants de cette classe
      const [students] = await connection.execute(`
        SELECT s.user_id 
        FROM students s 
        WHERE s.class_level = ? AND s.user_id IS NOT NULL
      `, [className]);

      console.log(`   👥 Ajout de ${students.length} étudiants...`);

      for (const student of students) {
        const [existingStudentParticipant] = await connection.execute(`
          SELECT id FROM group_participants WHERE group_id = ? AND user_id = ?
        `, [groupId, student.user_id]);

        if (existingStudentParticipant.length === 0) {
          await connection.execute(`
            INSERT INTO group_participants (group_id, user_id, role, is_active, created_at)
            VALUES (?, ?, 'member', true, NOW())
          `, [groupId, student.user_id]);
        }
      }

      console.log(`   ✅ ${students.length} étudiants ajoutés au groupe`);
    }

    // 7. Afficher le résumé
    console.log('\n📊 Résumé des groupes créés:');
    const [allGroups] = await connection.execute(`
      SELECT 
        g.id,
        g.name,
        g.class_level,
        COUNT(gp.user_id) as participant_count
      FROM groups g
      LEFT JOIN group_participants gp ON g.id = gp.group_id AND gp.is_active = true
      WHERE g.type = 'class'
      GROUP BY g.id, g.name, g.class_level
      ORDER BY g.class_level
    `);

    allGroups.forEach(group => {
      console.log(`   - ${group.name} (${group.class_level}): ${group.participant_count} participants`);
    });

    await connection.end();
    console.log('\n🎉 Initialisation des groupes terminée!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

initClassGroups();
