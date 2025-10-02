/**
 * Script to set up production environment variables
 * This script helps configure the .env.production file with proper values
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('⚙️ Setting up production environment variables...');

// Read the current .env.production file
const envPath = path.join(__dirname, '..', '.env.production');
let envContent;

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Read existing .env.production file');
} catch (error) {
  console.log('❌ Failed to read .env.production file:', error.message);
  process.exit(1);
}

// Generate a secure JWT secret if not already set
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('🔐 Generated secure JWT secret');

// Replace placeholder values with actual values
const updatedEnvContent = envContent
  .replace('your_secure_production_jwt_secret', jwtSecret)
  .replace('username:password', 'your_mongodb_username:your_mongodb_password')
  .replace('cluster.mongodb.net', 'your_cluster.mongodb.net')
  .replace('launchpadmarket', 'your_database_name')
  .replace('your_production_email@yourdomain.com', 'your_actual_email@yourdomain.com')
  .replace('your_production_email_password', 'your_actual_email_password')
  .replace('https://yourdomain.com', 'https://your-actual-domain.com');

// Write the updated content back to the file
try {
  fs.writeFileSync(envPath, updatedEnvContent);
  console.log('✅ Updated .env.production file with secure values');
} catch (error) {
  console.log('❌ Failed to update .env.production file:', error.message);
  process.exit(1);
}

console.log('\n📝 To complete production environment setup:');
console.log('1. Update the MongoDB connection string with your actual credentials');
console.log('2. Update email configuration with your actual email credentials');
console.log('3. Update the CLIENT_URL with your actual frontend domain');
console.log('4. Update Stripe keys with your actual production keys');
console.log('5. Update the JWT_SECRET with a securely generated secret (already done)');

console.log('\n🔐 Security Recommendations:');
console.log('- Store sensitive credentials in a secure vault or secrets manager');
console.log('- Never commit actual credentials to version control');
console.log('- Rotate secrets regularly');
console.log('- Use environment-specific configuration files');

console.log('\n🎉 Production environment setup completed!');