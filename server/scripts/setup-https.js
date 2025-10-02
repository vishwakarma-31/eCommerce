/**
 * Script to set up HTTPS for production deployment
 * This script generates a self-signed certificate for development/testing
 * For production, you should use a certificate from a trusted CA
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔐 Setting up HTTPS for production deployment...');

// Check if openssl is available
try {
  execSync('openssl version', { stdio: 'ignore' });
  console.log('✅ OpenSSL is available');
} catch (error) {
  console.log('❌ OpenSSL is not available. Please install OpenSSL to generate certificates.');
  console.log('For production, obtain certificates from a trusted Certificate Authority (CA)');
  process.exit(1);
}

// Create certificates directory
const certsDir = path.join(__dirname, '..', 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
  console.log('📂 Created certs directory');
}

// Generate self-signed certificate
const certPath = path.join(certsDir, 'server.cert');
const keyPath = path.join(certsDir, 'server.key');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  try {
    console.log('🔐 Generating self-signed certificate...');
    
    // Generate private key and certificate
    execSync(
      `openssl req -x509 -newkey rsa:4096 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=US/ST=State/L=City/O=LaunchPad Market/CN=localhost"`,
      { stdio: 'inherit' }
    );
    
    console.log('✅ Self-signed certificate generated successfully');
    console.log(`🔑 Private key: ${keyPath}`);
    console.log(`📜 Certificate: ${certPath}`);
  } catch (error) {
    console.log(`❌ Failed to generate certificate: ${error.message}`);
    process.exit(1);
  }
} else {
  console.log('✅ Certificate files already exist');
}

console.log('\n📝 To enable HTTPS in production:');
console.log('1. Update your environment variables:');
console.log('   - Set NODE_ENV=production');
console.log('   - Set HTTPS=true');
console.log('   - Set SSL_CERT_PATH=/path/to/your/certificate.crt');
console.log('   - Set SSL_KEY_PATH=/path/to/your/private.key');
console.log('\n2. For production, use certificates from a trusted CA like Let\'s Encrypt');
console.log('\n3. Update your server startup to use HTTPS middleware');

console.log('\n🎉 HTTPS setup completed!');