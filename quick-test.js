const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function quickTest() {
  try {
    console.log('🚀 Test rapide...\n');

    // 1. Connexion admin
    console.log('1. Connexion admin...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@test.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.accessToken;
    console.log('✅ Admin connecté');

    // 2. Créer un étudiant
    console.log('\n2. Création étudiant...');
    try {
      const userResponse = await axios.post(`${API_BASE}/auth/register`, {
        email: 'test@student.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'Student',
        userType: 'student'
      });
      console.log('✅ Utilisateur créé:', userResponse.data);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('Email déjà utilisé')) {
        console.log('⚠️ Utilisateur existe déjà, récupération...');
        // Récupérer l'utilisateur existant
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: 'test@student.com',
          password: 'password123'
        });
        const userId = JSON.parse(Buffer.from(loginResponse.data.accessToken.split('.')[1], 'base64').toString()).sub;
        console.log('✅ Utilisateur existant récupéré:', userId);
        var userResponse = { data: { user: { id: userId } } };
      } else {
        throw error;
      }
    }

    // 3. Créer profil étudiant
    console.log('\n3. Création profil étudiant...');
    const studentResponse = await axios.post(`${API_BASE}/students`, {
      userId: userResponse.data.user.id,
      classLevel: 'Terminale groupe 1',
      parentId: null
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Profil étudiant créé');

    // 4. Créer un dossier
    console.log('\n4. Création dossier...');
    const dossierResponse = await axios.post(`${API_BASE}/new-structure/dossiers`, {
      name: 'Dossier Test',
      description: 'Test pour étudiants',
      target_class: JSON.stringify(['Terminale groupe 1'])
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Dossier créé:', dossierResponse.data.id);

    // 5. Connexion étudiant
    console.log('\n5. Connexion étudiant...');
    const studentLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@student.com',
      password: 'password123'
    });
    const studentToken = studentLogin.data.accessToken;
    console.log('✅ Étudiant connecté');
    console.log('Token payload:', JSON.parse(Buffer.from(studentToken.split('.')[1], 'base64').toString()));

    // 6. Test endpoint étudiant
    console.log('\n6. Test /student/dossiers...');
    const dossiersResponse = await axios.get(`${API_BASE}/new-structure/student/dossiers`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    console.log('✅ Dossiers étudiants:', dossiersResponse.data);

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

quickTest();
