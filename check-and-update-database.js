const mysql = require('mysql2/promise');

async function checkAndUpdateDatabase() {
  let connection;
  
  try {
    // Configuration de la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Ajoutez votre mot de passe si nécessaire
      database: 'chrono_carto'
    });

    console.log('Connexion à la base de données établie');

    // Vérifier la structure actuelle de la table conversation
    console.log('\n📋 Structure actuelle de la table conversation:');
    const [columns] = await connection.execute('DESCRIBE conversation');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Vérifier si les colonnes existent déjà
    const existingColumns = columns.map(col => col.Field);
    const newColumns = ['type', 'title', 'participant1_id', 'participant2_id', 'class_level'];
    
    console.log('\n🔍 Vérification des colonnes à ajouter:');
    for (const col of newColumns) {
      if (existingColumns.includes(col)) {
        console.log(`  ✓ ${col} existe déjà`);
      } else {
        console.log(`  ❌ ${col} manquante`);
      }
    }

    // Ajouter les colonnes manquantes
    console.log('\n🔧 Ajout des colonnes manquantes:');
    
    if (!existingColumns.includes('type')) {
      await connection.execute('ALTER TABLE conversation ADD COLUMN type VARCHAR(50) DEFAULT "direct"');
      console.log('  ✓ Colonne "type" ajoutée');
    }
    
    if (!existingColumns.includes('title')) {
      await connection.execute('ALTER TABLE conversation ADD COLUMN title VARCHAR(255) NULL');
      console.log('  ✓ Colonne "title" ajoutée');
    }
    
    if (!existingColumns.includes('participant1_id')) {
      await connection.execute('ALTER TABLE conversation ADD COLUMN participant1_id INT NULL');
      console.log('  ✓ Colonne "participant1_id" ajoutée');
    }
    
    if (!existingColumns.includes('participant2_id')) {
      await connection.execute('ALTER TABLE conversation ADD COLUMN participant2_id INT NULL');
      console.log('  ✓ Colonne "participant2_id" ajoutée');
    }
    
    if (!existingColumns.includes('class_level')) {
      await connection.execute('ALTER TABLE conversation ADD COLUMN class_level VARCHAR(100) NULL');
      console.log('  ✓ Colonne "class_level" ajoutée');
    }

    // Vérifier les clés étrangères existantes
    console.log('\n🔑 Vérification des clés étrangères:');
    const [foreignKeys] = await connection.execute(`
      SELECT CONSTRAINT_NAME, COLUMN_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = 'chrono_carto' 
      AND TABLE_NAME = 'conversation' 
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    const existingFKs = foreignKeys.map(fk => fk.COLUMN_NAME);
    console.log('  Clés étrangères existantes:', existingFKs);

    // Ajouter les clés étrangères manquantes
    if (!existingFKs.includes('participant1_id')) {
      try {
        await connection.execute(`
          ALTER TABLE conversation 
          ADD CONSTRAINT FK_conversation_participant1 
          FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE
        `);
        console.log('  ✓ Clé étrangère pour participant1_id ajoutée');
      } catch (error) {
        console.log('  ⚠️  Clé étrangère pour participant1_id déjà existante ou erreur:', error.message);
      }
    }
    
    if (!existingFKs.includes('participant2_id')) {
      try {
        await connection.execute(`
          ALTER TABLE conversation 
          ADD CONSTRAINT FK_conversation_participant2 
          FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE
        `);
        console.log('  ✓ Clé étrangère pour participant2_id ajoutée');
      } catch (error) {
        console.log('  ⚠️  Clé étrangère pour participant2_id déjà existante ou erreur:', error.message);
      }
    }

    // Supprimer la table conversation_participants si elle existe
    console.log('\n🗑️  Suppression de la table conversation_participants:');
    try {
      await connection.execute('DROP TABLE IF EXISTS conversation_participants');
      console.log('  ✓ Table conversation_participants supprimée (si elle existait)');
    } catch (error) {
      console.log('  ⚠️  Erreur lors de la suppression:', error.message);
    }

    console.log('\n✅ Mise à jour de la base de données terminée avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la base de données:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion fermée');
    }
  }
}

checkAndUpdateDatabase();
