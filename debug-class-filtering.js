const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function debugClassFiltering() {
  try {
    console.log('🔍 Debug du filtrage par classe...\n');

    // 1. Connexion admin
    console.log('1. Connexion admin...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@test.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.accessToken;
    console.log('✅ Admin connecté');

    // 2. Voir tous les dossiers
    console.log('\n2. Tous les dossiers:');
    const allDossiers = await axios.get(`${API_BASE}/new-structure/dossiers`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    allDossiers.data.forEach(dossier => {
      console.log(`- ${dossier.name}: ${dossier.target_class}`);
    });

    // 3. Créer un étudiant Terminale groupe 3
    console.log('\n3. Création étudiant Terminale groupe 3...');
    try {
      const userResponse = await axios.post(`${API_BASE}/auth/register`, {
        email: 'student3@test.com',
        password: 'password123',
        first_name: 'Student',
        last_name: 'Groupe3',
        userType: 'student'
      });
      console.log('✅ Utilisateur créé');
    } catch (error) {
      if (error.response?.data?.message?.includes('Email déjà utilisé')) {
        console.log('⚠️ Utilisateur existe déjà');
      } else {
        throw error;
      }
    }

    // 4. Créer profil étudiant Terminale groupe 3
    console.log('\n4. Création profil étudiant Terminale groupe 3...');
    try {
      const studentResponse = await axios.post(`${API_BASE}/students`, {
        userId: 999, // ID fictif
        classLevel: 'Terminale groupe 3',
        parentId: null
      }, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Profil étudiant Terminale groupe 3 créé');
    } catch (error) {
      console.log('⚠️ Erreur profil étudiant:', error.response?.data?.message);
    }

    // 5. Connexion étudiant Terminale groupe 3
    console.log('\n5. Connexion étudiant Terminale groupe 3...');
    try {
      const studentLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'student3@test.com',
        password: 'password123'
      });
      const studentToken = studentLogin.data.accessToken;
      console.log('✅ Étudiant Terminale groupe 3 connecté');
      
      // Décoder le token
      const tokenPayload = JSON.parse(Buffer.from(studentToken.split('.')[1], 'base64').toString());
      console.log('📋 Token payload:', tokenPayload);
      
      // 6. Tester l'endpoint étudiant
      console.log('\n6. Test dossiers pour Terminale groupe 3...');
      const studentDossiers = await axios.get(`${API_BASE}/new-structure/student/dossiers`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      console.log('✅ Dossiers trouvés:', studentDossiers.data.length);
      studentDossiers.data.forEach(dossier => {
        console.log(`- ${dossier.name}: ${dossier.target_class}`);
      });
      
    } catch (error) {
      console.log('❌ Erreur connexion étudiant:', error.response?.data?.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
  }
}

debugClassFiltering();
