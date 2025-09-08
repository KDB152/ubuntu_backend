const mysql = require('mysql2/promise');

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chrono_carto'
    });

    // Get all users
    const [users] = await connection.execute('SELECT id, email, role, password FROM users');
    console.log('Users found:', users.length);
    
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Password: ${user.password ? 'Set' : 'Not set'}`);
    });

    // Check if there are any students
    const [students] = await connection.execute(`
      SELECT s.id, s.user_id, s.class_level, u.email, u.password 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      LIMIT 5
    `);
    console.log('\nStudents found:', students.length);
    students.forEach(student => {
      console.log(`  - ID: ${student.id}, Email: ${student.email}, Class: ${student.class_level}, Password: ${student.password ? 'Set' : 'Not set'}`);
    });

    await connection.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
