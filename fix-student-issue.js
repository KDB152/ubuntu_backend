const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function fixStudentIssue() {
  try {
    console.log('🔧 Correction du problème étudiant...\n');

    // 1. Connexion admin
    console.log('1. Connexion admin...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@test.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.accessToken;
    console.log('✅ Admin connecté');

    // 2. Créer un dossier pour Terminale groupe 1
    console.log('\n2. Création dossier pour Terminale groupe 1...');
    const dossierResponse = await axios.post(`${API_BASE}/new-structure/dossiers`, {
      name: 'Dossier Terminale Groupe 1',
      description: 'Dossier spécifique pour Terminale groupe 1',
      target_class: JSON.stringify(['Terminale groupe 1'])
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Dossier créé:', dossierResponse.data);

    // 3. Créer un sous-dossier
    console.log('\n3. Création sous-dossier...');
    const sousDossierResponse = await axios.post(`${API_BASE}/new-structure/sous-dossiers`, {
      name: 'Cours',
      description: 'Sous-dossier pour les cours',
      dossier_id: dossierResponse.data.id
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Sous-dossier créé:', sousDossierResponse.data);

    // 4. Créer un fichier de test
    console.log('\n4. Création fichier de test...');
    const fichierResponse = await axios.post(`${API_BASE}/new-structure/fichiers`, {
      title: 'Document de test',
      description: 'Fichier de test pour les étudiants',
      sous_dossier_id: sousDossierResponse.data.id,
      file_name: 'test.pdf',
      stored_name: 'test_stored.pdf',
      file_path: 'uploads/test.pdf',
      file_type: 'application/pdf',
      file_size: 1024,
      download_count: 0
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Fichier créé:', fichierResponse.data);

    // 5. Vérifier tous les dossiers
    console.log('\n5. Vérification des dossiers...');
    const allDossiers = await axios.get(`${API_BASE}/new-structure/dossiers`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('📁 Dossiers disponibles:');
    allDossiers.data.forEach(dossier => {
      console.log(`- ${dossier.name} (${dossier.target_class})`);
    });

    console.log('\n🎉 Données de test créées !');
    console.log('📧 Email étudiant: student@test.com');
    console.log('🔑 Mot de passe: password123');
    console.log('📚 Classe: Terminale groupe 1');
    console.log('\n⚠️ Note: L\'étudiant doit être approuvé par un admin pour se connecter');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

fixStudentIssue();
