const mysql = require('mysql2/promise');

async function fixStudentClass() {
  try {
    console.log('🔍 Fixing student class to match dossier 15...\n');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    // Trouver l'étudiant detecteurincendie7@gmail.com
    const [students] = await connection.execute(`
      SELECT s.id, s.user_id, s.class_level, u.email 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      WHERE u.email = 'detecteurincendie7@gmail.com'
    `);

    if (students.length === 0) {
      console.log('❌ Étudiant non trouvé');
      return;
    }

    const student = students[0];
    console.log('👤 Étudiant trouvé:', {
      id: student.id,
      email: student.email,
      current_class: student.class_level
    });

    // Mettre à jour la classe vers "Terminale groupe 3"
    await connection.execute(
      'UPDATE students SET class_level = ? WHERE id = ?',
      ['Terminale groupe 3', student.id]
    );

    console.log('✅ Classe mise à jour vers "Terminale groupe 3"');

    // Vérifier la mise à jour
    const [updatedStudents] = await connection.execute(`
      SELECT s.id, s.user_id, s.class_level, u.email 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      WHERE u.email = 'detecteurincendie7@gmail.com'
    `);

    console.log('✅ Vérification:', {
      id: updatedStudents[0].id,
      email: updatedStudents[0].email,
      new_class: updatedStudents[0].class_level
    });

    await connection.end();
    console.log('\n✅ Correction terminée ! L\'étudiant peut maintenant accéder au dossier 15.');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

fixStudentClass();
