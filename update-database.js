const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function updateDatabase() {
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

    // Lire le script SQL
    const sqlScript = fs.readFileSync(path.join(__dirname, 'update-conversation-table.sql'), 'utf8');
    
    // Diviser le script en requêtes individuelles
    const queries = sqlScript
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));

    // Exécuter chaque requête
    for (const query of queries) {
      if (query.trim()) {
        console.log('Exécution de:', query.substring(0, 50) + '...');
        await connection.execute(query);
        console.log('✓ Requête exécutée avec succès');
      }
    }

    console.log('✅ Mise à jour de la base de données terminée avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la base de données:', error.message);
    
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Certaines colonnes existent déjà, ce qui est normal');
    } else if (error.code === 'ER_DUP_KEYNAME') {
      console.log('ℹ️  Certaines clés étrangères existent déjà, ce qui est normal');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion fermée');
    }
  }
}

updateDatabase();
