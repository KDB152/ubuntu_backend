const mysql = require('mysql2/promise');

async function createMessagingTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chrono_carto'
  });

  try {
    console.log('🚀 Création des tables de messagerie...');

    // Supprimer les tables existantes si elles existent
    await connection.execute('DROP TABLE IF EXISTS messages');
    await connection.execute('DROP TABLE IF EXISTS conversation');
    await connection.execute('DROP TABLE IF EXISTS conversation_participants');
    await connection.execute('DROP TABLE IF EXISTS groupes');

    // Créer la table groupes
    await connection.execute(`
      CREATE TABLE groupes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        class_level VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table groupes créée');

    // Créer la table conversation
    await connection.execute(`
      CREATE TABLE conversation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        groupe_id INT NULL,
        last_message_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Table conversation créée');

    // Créer la table conversation_participants
    await connection.execute(`
      CREATE TABLE conversation_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        user_id INT NOT NULL,
        groupe_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table conversation_participants créée');

    // Créer la table messages
    await connection.execute(`
      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        recipient_id INT NULL,
        groupe_id INT NULL,
        conversation_id INT NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        is_read BOOLEAN DEFAULT FALSE,
        file_path VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Table messages créée');

    console.log('🎉 Toutes les tables de messagerie ont été créées avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  } finally {
    await connection.end();
  }
}

createMessagingTables();
