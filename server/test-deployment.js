/**
 * LaunchPad Market - Deployment Test Script
 * This script tests that all deployment configurations are working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Deployment Configurations...');

// Test 1: Check if required files exist
const requiredFiles = [
  'ecosystem.config.js',
  'utils/logger.js',
  '.env.production',
  'deploy.sh',
  'deploy.bat',
  'health-check.js'
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

// Test 2: Check if logs directory can be created
console.log('\n📂 Testing logs directory creation...');
const logsDir = path.join(__dirname, 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('✅ Logs directory created successfully');
    
    // Clean up test directory
    fs.rmdirSync(logsDir);
  } else {
    console.log('✅ Logs directory already exists');
  }
} catch (error) {
  console.log(`❌ Failed to create logs directory: ${error.message}`);
}

// Test 3: Check if package.json has been updated
console.log('\n📦 Checking package.json updates...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const hasPM2 = packageJson.dependencies && packageJson.dependencies.pm2;
  const hasWinston = packageJson.dependencies && packageJson.dependencies.winston;
  const hasStartProdScript = packageJson.scripts && packageJson.scripts['start:prod'];
  const hasHealthScript = packageJson.scripts && packageJson.scripts.health;
  
  if (hasPM2) console.log('✅ PM2 dependency found');
  else console.log('❌ PM2 dependency missing');
  
  if (hasWinston) console.log('✅ Winston dependency found');
  else console.log('❌ Winston dependency missing');
  
  if (hasStartProdScript) console.log('✅ start:prod script found');
  else console.log('❌ start:prod script missing');
  
  if (hasHealthScript) console.log('✅ health script found');
  else console.log('❌ health script missing');
  
} catch (error) {
  console.log(`❌ Failed to read package.json: ${error.message}`);
}

console.log('\n🏁 Deployment test completed');
if (allFilesExist) {
  console.log('🎉 All deployment files are in place!');
} else {
  console.log('⚠️  Some deployment files are missing. Please check the deployment preparation steps.');
}