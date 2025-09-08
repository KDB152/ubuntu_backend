const mysql = require('mysql2/promise');

async function debugGroupService() {
  try {
    console.log('🔍 Debugging GroupService...\n');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    // 1. Vérifier la structure des tables
    console.log('1. Vérification de la structure des tables...');
    
    const [usersStructure] = await connection.execute('DESCRIBE users');
    console.log('✅ Table users:', usersStructure.length, 'colonnes');
    
    const [studentsStructure] = await connection.execute('DESCRIBE students');
    console.log('✅ Table students:', studentsStructure.length, 'colonnes');
    
    const [groupsStructure] = await connection.execute('DESCRIBE groups');
    console.log('✅ Table groups:', groupsStructure.length, 'colonnes');
    
    const [groupParticipantsStructure] = await connection.execute('DESCRIBE group_participants');
    console.log('✅ Table group_participants:', groupParticipantsStructure.length, 'colonnes');

    // 2. Vérifier les données
    console.log('\n2. Vérification des données...');
    
    const [users] = await connection.execute('SELECT id, first_name, last_name, role, is_active FROM users WHERE is_active = true');
    console.log(`✅ Utilisateurs actifs: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.first_name} ${user.last_name} (${user.role})`);
    });
    
    const [students] = await connection.execute('SELECT id, user_id, class_level FROM students WHERE class_level IS NOT NULL');
    console.log(`✅ Étudiants avec classe: ${students.length}`);
    students.forEach(student => {
      console.log(`   - ID ${student.id}, User ID ${student.user_id}, Classe: ${student.class_level}`);
    });
    
    const [groups] = await connection.execute('SELECT id, name, class_level, type FROM groups WHERE is_active = true');
    console.log(`✅ Groupes actifs: ${groups.length}`);
    groups.forEach(group => {
      console.log(`   - ${group.name} (${group.class_level})`);
    });
    
    const [groupParticipants] = await connection.execute('SELECT id, group_id, user_id, role FROM group_participants WHERE is_active = true');
    console.log(`✅ Participants de groupes: ${groupParticipants.length}`);
    groupParticipants.forEach(participant => {
      console.log(`   - Groupe ${participant.group_id}, User ${participant.user_id}, Rôle: ${participant.role}`);
    });

    // 3. Tester la requête pour un étudiant spécifique
    console.log('\n3. Test de requête pour un étudiant...');
    const testStudentId = 48; // ID de l'utilisateur étudiant (Test Student)
    
    // Récupérer l'étudiant
    const [studentData] = await connection.execute(`
      SELECT s.id, s.user_id, s.class_level, u.first_name, u.last_name, u.role
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
    `, [testStudentId]);
    
    if (studentData.length > 0) {
      const student = studentData[0];
      console.log(`✅ Étudiant trouvé: ${student.first_name} ${student.last_name} (${student.class_level})`);
      
      // Récupérer les camarades de classe
      const [classmates] = await connection.execute(`
        SELECT s.id, s.user_id, s.class_level, u.first_name, u.last_name, u.role
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.class_level = ? AND s.user_id != ?
      `, [student.class_level, testStudentId]);
      
      console.log(`✅ Camarades de classe: ${classmates.length}`);
      classmates.forEach(classmate => {
        console.log(`   - ${classmate.first_name} ${classmate.last_name}`);
      });
      
      // Récupérer l'admin
      const [admins] = await connection.execute(`
        SELECT id, first_name, last_name, role
        FROM users
        WHERE role = 'admin'
      `);
      
      console.log(`✅ Admins: ${admins.length}`);
      admins.forEach(admin => {
        console.log(`   - ${admin.first_name} ${admin.last_name}`);
      });
      
    } else {
      console.log('❌ Aucun étudiant trouvé avec cet ID');
    }

    await connection.end();
    console.log('\n🎉 Debug terminé!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

debugGroupService();
