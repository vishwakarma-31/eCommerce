/**
 * LaunchPad Market - Frontend Deployment Test Script
 * This script tests that all frontend deployment configurations are working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Frontend Deployment Configurations...');

// Test 1: Check if required files exist
const requiredFiles = [
  '.env.production',
  'deploy.sh',
  'deploy.bat',
  'public/health.html'
];

console.log('\n📁 Checking required files...');
let allFilesExist = true;

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
}

// Test 2: Check if package.json has been updated
console.log('\n📦 Checking package.json updates...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const hasBuildCdnScript = packageJson.scripts && packageJson.scripts['build:cdn'];
  const hasBuildProdScript = packageJson.scripts && packageJson.scripts['build:prod'];
  
  if (hasBuildCdnScript) console.log('✅ build:cdn script found');
  else console.log('❌ build:cdn script missing');
  
  if (hasBuildProdScript) console.log('✅ build:prod script found');
  else console.log('❌ build:prod script missing');
  
} catch (error) {
  console.log(`❌ Failed to read package.json: ${error.message}`);
}

// Test 3: Check vite.config.js configuration
console.log('\n⚙️  Checking vite.config.js configuration...');
try {
  const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.js'), 'utf8');
  
  if (viteConfig.includes('VITE_APP_BASE_URL')) {
    console.log('✅ VITE_APP_BASE_URL configuration found');
  } else {
    console.log('❌ VITE_APP_BASE_URL configuration missing');
  }
  
} catch (error) {
  console.log(`❌ Failed to read vite.config.js: ${error.message}`);
}

console.log('\n🏁 Frontend deployment test completed');
if (allFilesExist) {
  console.log('🎉 All frontend deployment files are in place!');
} else {
  console.log('⚠️  Some frontend deployment files are missing. Please check the deployment preparation steps.');
}