/**
 * Script to set up monitoring for production deployment
 * This script configures PM2 monitoring and log rotation
 */

const fs = require('fs');
const path = require('path');

console.log('📊 Setting up monitoring for production deployment...');

// Check if PM2 is installed
try {
  require('pm2');
  console.log('✅ PM2 is installed');
} catch (error) {
  console.log('❌ PM2 is not installed. Installing PM2...');
  try {
    require('child_process').execSync('npm install -g pm2', { stdio: 'inherit' });
    console.log('✅ PM2 installed successfully');
  } catch (installError) {
    console.log('❌ Failed to install PM2:', installError.message);
    process.exit(1);
  }
}

// Create PM2 log rotation configuration
const logrotateConfig = `
# Log rotation configuration for LaunchPad Market
"/home/user/launchpad-market/server/logs/*.log" {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 user user
}
`;

const logrotatePath = path.join(__dirname, '..', 'config', 'launchpad-market-logrotate');
if (!fs.existsSync(path.dirname(logrotatePath))) {
  fs.mkdirSync(path.dirname(logrotatePath), { recursive: true });
}

fs.writeFileSync(logrotatePath, logrotateConfig);
console.log('📝 Created log rotation configuration');

// Create monitoring dashboard script
const dashboardScript = `
#!/bin/bash
# LaunchPad Market - Monitoring Dashboard
# This script provides a real-time monitoring dashboard

echo "📊 LaunchPad Market - Monitoring Dashboard"
echo "=========================================="

while true; do
  clear
  echo "📊 LaunchPad Market - Monitoring Dashboard"
  echo "=========================================="
  echo ""
  
  echo "🚀 Application Status:"
  pm2 list
  
  echo ""
  echo "📈 Resource Usage:"
  pm2 monit
  
  echo ""
  echo "📋 Recent Logs (last 10 lines):"
  pm2 logs launchpad-market-api --lines 10
  
  echo ""
  echo "🔄 Refreshing in 10 seconds... (Press Ctrl+C to exit)"
  sleep 10
done
`;

const dashboardPath = path.join(__dirname, '..', 'scripts', 'monitor-dashboard.sh');
fs.writeFileSync(dashboardPath, dashboardScript);
fs.chmodSync(dashboardPath, '755');
console.log('📊 Created monitoring dashboard script');

console.log('\n📝 To set up monitoring:');
console.log('1. Install PM2 log rotation module:');
console.log('   pm2 install pm2-logrotate');
console.log('\n2. Configure log rotation:');
console.log(`   sudo cp ${logrotatePath} /etc/logrotate.d/launchpad-market`);
console.log('\n3. Start monitoring dashboard:');
console.log(`   ${dashboardPath}`);

console.log('\n🎉 Monitoring setup completed!');