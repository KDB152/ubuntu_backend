const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE = 'http://localhost:3001';

async function uploadValidPdf() {
  try {
    console.log('🔍 Uploading valid PDF...\n');

    // 1. Connexion admin
    console.log('1. Connexion admin...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admintest@test.com',
      password: 'password123'
    });
    
    console.log('✅ Admin connecté');
    const token = adminLogin.data.accessToken;

    // 2. Récupérer les sous-dossiers
    console.log('\n2. Récupération des sous-dossiers...');
    const sousDossiers = await axios.get(`${API_BASE}/new-structure/dossiers/15/sous-dossiers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (sousDossiers.data.length === 0) {
      console.log('❌ Aucun sous-dossier trouvé');
      return;
    }

    const sousDossier = sousDossiers.data[0];
    console.log(`📁 Sous-dossier sélectionné: ${sousDossier.name} (ID: ${sousDossier.id})`);

    // 3. Upload du PDF valide
    console.log('\n3. Upload du PDF valide...');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream('./test-document.pdf'));
    formData.append('title', 'Document PDF Valide');
    formData.append('description', 'Un PDF de test valide pour vérifier le téléchargement');
    formData.append('sous_dossier_id', sousDossier.id.toString());

    try {
      const uploadResponse = await axios.post(`${API_BASE}/new-structure/fichiers/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });

      console.log('✅ PDF uploadé avec succès!');
      console.log('📄 Détails du fichier uploadé:', uploadResponse.data);

      // 4. Tester le téléchargement du nouveau fichier
      console.log('\n4. Test de téléchargement du nouveau fichier...');
      
      const downloadResponse = await axios.get(`${API_BASE}/new-structure/fichiers/${uploadResponse.data.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'arraybuffer'
      });

      console.log('✅ Téléchargement réussi!');
      console.log('📊 Headers de réponse:', {
        'content-type': downloadResponse.headers['content-type'],
        'content-length': downloadResponse.headers['content-length'],
        'content-disposition': downloadResponse.headers['content-disposition']
      });

      // Sauvegarder le fichier téléchargé
      const downloadedPath = `./downloaded_valid_${uploadResponse.data.id}.pdf`;
      fs.writeFileSync(downloadedPath, downloadResponse.data);
      console.log(`💾 Fichier téléchargé sauvegardé: ${downloadedPath}`);
      console.log(`📊 Taille: ${fs.statSync(downloadedPath).size} bytes`);

      // Vérifier que c'est un PDF valide
      const downloadedContent = fs.readFileSync(downloadedPath, 'utf8');
      if (downloadedContent.startsWith('%PDF-')) {
        console.log('✅ Le fichier téléchargé est un PDF valide!');
      } else {
        console.log('❌ Le fichier téléchargé n\'est pas un PDF valide');
        console.log('📄 Début du contenu:', downloadedContent.substring(0, 100));
      }

    } catch (uploadError) {
      console.log('❌ Erreur lors de l\'upload:', uploadError.response?.status, uploadError.response?.data?.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
  }
}

uploadValidPdf();
