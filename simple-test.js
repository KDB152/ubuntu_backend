const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function simpleTest() {
  try {
    console.log('🔍 Simple test...\n');

    // Test admin login
    console.log('1. Testing admin login...');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'chronocarto7@gmail.com',
      password: 'password123'
    });
    console.log('✅ Admin login successful');

    // Test getting all dossiers
    console.log('\n2. Getting all dossiers...');
    const dossiers = await axios.get(`${API_BASE}/new-structure/dossiers`, {
      headers: { 'Authorization': `Bearer ${adminLogin.data.accessToken}` }
    });
    console.log('✅ Dossiers retrieved:', dossiers.data.length, 'dossiers');
    
    // Check if dossier 15 exists
    const dossier15 = dossiers.data.find(d => d.id === 15);
    if (dossier15) {
      console.log('✅ Dossier 15 found:', dossier15.name, 'Target class:', dossier15.target_class);
    } else {
      console.log('❌ Dossier 15 not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

simpleTest();
