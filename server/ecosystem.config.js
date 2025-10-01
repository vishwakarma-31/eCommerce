module.exports = {
  apps: [{
    name: 'launchpad-market-api',
    script: './index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Restart policies
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000,
    max_restarts: 10,
    restart_delay: 4000
  }]
};