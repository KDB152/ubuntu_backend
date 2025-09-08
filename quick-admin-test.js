const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function quickAdminTest() {
  try {
    console.log('🔍 Test admin simple...\n');

    // Test de connexion admin
    console.log('1. Test connexion admin...');
    try {
      const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@test.com',
        password: 'password123'
      });
      console.log('✅ Admin connecté:', adminLogin.data);
    } catch (error) {
      console.log('❌ Erreur admin:', error.response?.status, error.response?.data?.message);
      
      // Créer un admin
      console.log('\n2. Création admin...');
      try {
        const adminResponse = await axios.post(`${API_BASE}/auth/register`, {
          email: 'admin@test.com',
          password: 'password123',
          first_name: 'Admin',
          last_name: 'Test',
          userType: 'admin'
        });
        console.log('✅ Admin créé:', adminResponse.data);
      } catch (createError) {
        console.log('❌ Erreur création admin:', createError.response?.data?.message);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

quickAdminTest();
