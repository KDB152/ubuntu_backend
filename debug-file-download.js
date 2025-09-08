const axios = require('axios');
const fs = require('fs');

const API_BASE = 'http://localhost:3001';

async function debugFileDownload() {
  try {
    console.log('🔍 Debugging file download...\n');

    // 1. Connexion étudiant
    console.log('1. Connexion étudiant...');
    const studentLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'teststudent@test.com',
      password: 'password123'
    });
    
    console.log('✅ Étudiant connecté');
    const token = studentLogin.data.accessToken;

    // 2. Récupérer les fichiers
    console.log('\n2. Récupération des fichiers...');
    const sousDossiers = await axios.get(`${API_BASE}/new-structure/student/dossiers/15/sous-dossiers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (sousDossiers.data.length > 0) {
      const sousDossier = sousDossiers.data[0];
      const fichiers = await axios.get(`${API_BASE}/new-structure/student/sous-dossiers/${sousDossier.id}/fichiers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (fichiers.data.length > 0) {
        const fichier = fichiers.data[0];
        console.log(`📄 Fichier trouvé: ${fichier.file_name} (ID: ${fichier.id})`);
        console.log(`📊 Détails du fichier:`, {
          file_path: fichier.file_path,
          file_size: fichier.file_size,
          file_type: fichier.file_type
        });

        // 3. Vérifier si le fichier existe physiquement
        console.log('\n3. Vérification du fichier physique...');
        const physicalPath = `./${fichier.file_path}`;
        console.log(`🔍 Chemin physique: ${physicalPath}`);
        
        if (fs.existsSync(physicalPath)) {
          const stats = fs.statSync(physicalPath);
          console.log(`✅ Fichier physique trouvé:`, {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          });
          
          // Vérifier la cohérence des tailles
          if (stats.size !== fichier.file_size) {
            console.log(`⚠️ Incohérence de taille: DB=${fichier.file_size}, Physique=${stats.size}`);
          } else {
            console.log(`✅ Tailles cohérentes`);
          }
        } else {
          console.log(`❌ Fichier physique non trouvé`);
        }

        // 4. Tester le téléchargement et sauvegarder
        console.log('\n4. Test de téléchargement...');
        try {
          const downloadResponse = await axios.get(`${API_BASE}/new-structure/fichiers/${fichier.id}/download`, {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'arraybuffer' // Utiliser arraybuffer pour les fichiers binaires
          });
          
          console.log('✅ Téléchargement réussi!');
          console.log('📊 Headers de réponse:', {
            'content-type': downloadResponse.headers['content-type'],
            'content-length': downloadResponse.headers['content-length'],
            'content-disposition': downloadResponse.headers['content-disposition']
          });

          // Sauvegarder le fichier téléchargé pour inspection
          const downloadedPath = `./downloaded_${fichier.file_name}`;
          fs.writeFileSync(downloadedPath, downloadResponse.data);
          console.log(`💾 Fichier téléchargé sauvegardé: ${downloadedPath}`);
          
          // Vérifier la taille du fichier téléchargé
          const downloadedStats = fs.statSync(downloadedPath);
          console.log(`📊 Taille du fichier téléchargé: ${downloadedStats.size} bytes`);

          // Comparer avec le fichier original
          if (fs.existsSync(physicalPath)) {
            const originalStats = fs.statSync(physicalPath);
            if (downloadedStats.size === originalStats.size) {
              console.log(`✅ Fichier téléchargé identique à l'original`);
            } else {
              console.log(`❌ Fichier téléchargé différent de l'original`);
              console.log(`   Original: ${originalStats.size} bytes`);
              console.log(`   Téléchargé: ${downloadedStats.size} bytes`);
            }
          }

        } catch (downloadError) {
          console.log('❌ Erreur de téléchargement:', downloadError.response?.status, downloadError.response?.data?.message);
        }
      } else {
        console.log('⚠️ Aucun fichier trouvé');
      }
    } else {
      console.log('⚠️ Aucun sous-dossier trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
  }
}

debugFileDownload();
