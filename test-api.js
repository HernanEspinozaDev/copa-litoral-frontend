#!/usr/bin/env node

// Script para probar los endpoints de la API
testEndpoints();

async function testEndpoints() {
  console.log('🧪 Probando endpoints de la API...\n');
  
  const baseUrl = 'http://localhost:4322';
  const endpoints = [
    '/api/tournaments/index',
    '/api/tournaments/history'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📍 Probando: ${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint}: OK (${data.data?.length || 0} items)`);
      } else {
        console.log(`❌ ${endpoint}: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`   Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
    }
    console.log('');
  }
}

// Ejecutar la prueba
setTimeout(testEndpoints, 3000); // Esperar 3 segundos para que el servidor inicie
