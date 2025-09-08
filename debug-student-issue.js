const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function debugStudentIssue() {
  try {
    console.log('🔍 Debug du problème étudiant...\n');

    // 1. Connexion admin pour voir les dossiers
    console.log('1. Connexion admin...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@test.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.accessToken;
    console.log('✅ Admin connecté');

    // 2. Voir tous les dossiers
    console.log('\n2. Tous les dossiers dans la base:');
    const allDossiers = await axios.get(`${API_BASE}/new-structure/dossiers`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.table(allDossiers.data);

    // 3. Créer un étudiant de test
    console.log('\n3. Création étudiant de test...');
    try {
      const userResponse = await axios.post(`${API_BASE}/auth/register`, {
        email: 'student@test.com',
        password: 'password123',
        first_name: 'Student',
        last_name: 'Test',
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

    // 4. Créer profil étudiant
    console.log('\n4. Création profil étudiant...');
    try {
      const studentResponse = await axios.post(`${API_BASE}/students`, {
        userId: 999, // ID fictif pour le test
        classLevel: 'Terminale groupe 1',
        parentId: null
      }, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Profil étudiant créé');
    } catch (error) {
      console.log('⚠️ Erreur profil étudiant:', error.response?.data?.message);
    }

    // 5. Connexion étudiant
    console.log('\n5. Connexion étudiant...');
    try {
      const studentLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'student@test.com',
        password: 'password123'
      });
      const studentToken = studentLogin.data.accessToken;
      console.log('✅ Étudiant connecté');
      
      // Décoder le token pour voir le contenu
      const tokenPayload = JSON.parse(Buffer.from(studentToken.split('.')[1], 'base64').toString());
      console.log('📋 Contenu du token étudiant:', tokenPayload);
      
      // 6. Tester l'endpoint étudiant
      console.log('\n6. Test endpoint /student/dossiers...');
      const studentDossiers = await axios.get(`${API_BASE}/new-structure/student/dossiers`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      console.log('✅ Dossiers étudiants:', studentDossiers.data);
      
    } catch (error) {
      console.log('❌ Erreur connexion étudiant:', error.response?.data?.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
  }
}

debugStudentIssue();
