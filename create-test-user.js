const axios = require('axios');
const bcrypt = require('bcrypt');

const API_BASE = 'http://localhost:3001';

async function createTestUser() {
  try {
    console.log('🔍 Creating test user...\n');

    // Try to register a new admin user
    console.log('1. Registering new admin user...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
        email: 'testadmin@test.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'Admin',
        userType: 'admin'
      });
      console.log('✅ Admin user created:', registerResponse.data);
    } catch (error) {
      console.log('❌ Error creating admin:', error.response?.data?.message);
    }

    // Try to register a new student user
    console.log('\n2. Registering new student user...');
    try {
      const studentResponse = await axios.post(`${API_BASE}/auth/register`, {
        email: 'teststudent@test.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'Student',
        userType: 'student'
      });
      console.log('✅ Student user created:', studentResponse.data);
    } catch (error) {
      console.log('❌ Error creating student:', error.response?.data?.message);
    }

    // Try to login with the new admin
    console.log('\n3. Testing login with new admin...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'testadmin@test.com',
        password: 'password123'
      });
      console.log('✅ Admin login successful');
      
      // Test getting dossiers
      console.log('\n4. Testing dossiers endpoint...');
      const dossiersResponse = await axios.get(`${API_BASE}/new-structure/dossiers`, {
        headers: { 'Authorization': `Bearer ${loginResponse.data.accessToken}` }
      });
      console.log('✅ Dossiers retrieved:', dossiersResponse.data.length, 'dossiers');
      
      // Check dossier 15
      const dossier15 = dossiersResponse.data.find(d => d.id === 15);
      if (dossier15) {
        console.log('✅ Dossier 15 found:', dossier15.name, 'Target class:', dossier15.target_class);
      }
      
    } catch (error) {
      console.log('❌ Error with admin login:', error.response?.data?.message);
    }

  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

createTestUser();
