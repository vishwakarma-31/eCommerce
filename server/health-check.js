/**
 * LaunchPad Market - Backend Health Check Script
 * This script performs basic health checks on the backend application
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HEALTH_CHECK_HOST || 'localhost';
const PROTOCOL = process.env.HEALTH_CHECK_PROTOCOL || 'http';
const ENDPOINT = process.env.HEALTH_CHECK_ENDPOINT || '/health';

// Function to make HTTP request
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = (PROTOCOL === 'https' ? https : http).request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Health check function
async function performHealthCheck() {
  console.log('🏥 Performing health check...');
  
  const options = {
    hostname: HOST,
    port: PORT,
    path: ENDPOINT,
    method: 'GET',
    timeout: 5000
  };
  
  try {
    const response = await makeRequest(options);
    
    console.log(`✅ Health check response: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log('🎉 Application is healthy!');
      console.log('📊 Response data:', response.data);
      
      // Try to parse JSON response
      try {
        const jsonData = JSON.parse(response.data);
        console.log('📋 Health check details:');
        Object.keys(jsonData).forEach(key => {
          console.log(`  ${key}: ${jsonData[key]}`);
        });
      } catch (parseError) {
        console.log('📄 Response data:', response.data);
      }
      
      return true;
    } else {
      console.log(`❌ Application returned status code: ${response.statusCode}`);
      console.log('📄 Response data:', response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

// Run health check
performHealthCheck().then((isHealthy) => {
  if (isHealthy) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});