const mysql = require('mysql2/promise');

async function debugStudentData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'chrono_carto'
  });

  try {
    console.log('🔍 Vérification des données étudiant...\n');

    // 1. Vérifier les utilisateurs étudiants
    console.log('📚 Utilisateurs étudiants:');
    const [students] = await connection.execute(`
      SELECT u.id, u.email, u.first_name, u.last_name, s.class_level 
      FROM users u 
      LEFT JOIN students s ON u.id = s.user_id 
      WHERE u.role = 'STUDENT'
    `);
    console.table(students);

    // 2. Vérifier les dossiers
    console.log('\n📁 Dossiers disponibles:');
    const [dossiers] = await connection.execute(`
      SELECT id, name, description, target_class, created_at 
      FROM dossiers 
      ORDER BY created_at DESC
    `);
    console.table(dossiers);

    // 3. Vérifier les sous-dossiers
    console.log('\n📂 Sous-dossiers:');
    const [sousDossiers] = await connection.execute(`
      SELECT id, name, description, dossier_id, created_at 
      FROM sous_dossiers 
      ORDER BY created_at DESC
    `);
    console.table(sousDossiers);

    // 4. Vérifier les fichiers
    console.log('\n📄 Fichiers:');
    const [fichiers] = await connection.execute(`
      SELECT id, title, file_name, sous_dossier_id, created_at 
      FROM fichiers 
      ORDER BY created_at DESC
    `);
    console.table(fichiers);

    // 5. Test de filtrage pour une classe spécifique
    const testClass = 'Terminale groupe 1';
    console.log(`\n🎯 Test de filtrage pour la classe: "${testClass}"`);
    
    const [filteredDossiers] = await connection.execute(`
      SELECT id, name, description, target_class 
      FROM dossiers 
      WHERE target_class LIKE ?
    `, [`%${testClass}%`]);
    
    console.log(`Dossiers trouvés pour "${testClass}":`, filteredDossiers.length);
    console.table(filteredDossiers);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await connection.end();
  }
}

debugStudentData();
