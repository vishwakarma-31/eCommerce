# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the LaunchPad Market platform to production environments. The deployment process involves setting up both the backend API server and the frontend client application.

## Prerequisites

Before deploying, ensure you have:

1. **Domain Names**: 
   - API domain (e.g., api.launchpadmarket.com)
   - Client domain (e.g., launchpadmarket.com)

2. **SSL Certificates**: 
   - SSL certificates for both domains (Let's Encrypt recommended)

3. **Database**: 
   - MongoDB Atlas account or self-hosted MongoDB instance

4. **Cloud Services**:
   - Cloudinary account for image hosting
   - Stripe account for payment processing
   - PayPal account for alternative payments
   - Email service (SendGrid, AWS SES, or Gmail SMTP)

5. **Hosting Services**:
   - Backend hosting (Heroku, AWS EC2, DigitalOcean, etc.)
   - Frontend hosting (Vercel, Netlify, AWS S3, etc.)

## Backend Deployment

### 1. Environment Setup

Create a production environment file (`.env.production`) with the following variables:

```env
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=your_production_mongodb_uri

# JWT
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=24h

# Stripe
STRIPE_SECRET_KEY=your_production_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_production_stripe_webhook_secret

# PayPal
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret

# Email
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

# Frontend URL
CLIENT_URL=https://yourdomain.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 2. Server Configuration

#### Option A: Deploy to Heroku

1. Create a new Heroku app:
```bash
heroku create launchpad-market-api
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_production_mongodb_uri
# Set other environment variables...
```

3. Deploy the application:
```bash
git push heroku main
```

#### Option B: Deploy to AWS EC2

1. Launch an EC2 instance with Ubuntu Server
2. SSH into the instance:
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. Install Node.js and MongoDB:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (if self-hosting)
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

4. Clone the repository:
```bash
git clone https://github.com/yourusername/launchpad-market.git
cd launchpad-market/server
```

5. Install dependencies:
```bash
npm install
```

6. Set up environment variables:
```bash
# Create .env file with production values
nano .env
```

7. Start the application with PM2:
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Set PM2 to start on boot
pm2 startup
pm2 save
```

### 3. Database Setup

#### Using MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add database user with read/write permissions
4. Add IP whitelist (0.0.0.0/0 for all IPs or specific IPs)
5. Get the connection string and update MONGO_URI in environment variables

#### Database Indexing

Ensure proper indexing for performance:

```javascript
// Product indexes
db.products.createIndex({ "status": 1 })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "creator": 1 })
db.products.createIndex({ "tags": 1 })
db.products.createIndex({ "createdAt": -1 })
db.products.createIndex({ "soldQuantity": -1 })
db.products.createIndex({ "averageRating": -1 })

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// Order indexes
db.orders.createIndex({ "buyer": 1 })
db.orders.createIndex({ "createdAt": -1 })
db.orders.createIndex({ "orderStatus": 1 })
```

## Frontend Deployment

### 1. Environment Setup

Create a production environment file (`.env.production`) with the following variables:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key
```

### 2. Build the Application

```bash
cd client
npm run build
```

This will create a `dist` folder with the production build.

### 3. Deployment Options

#### Option A: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy the application:
```bash
vercel --prod
```

#### Option B: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy the application:
```bash
netlify deploy --prod
```

#### Option C: Deploy to AWS S3

1. Create an S3 bucket with static website hosting enabled
2. Configure bucket policy for public read access
3. Upload build files:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Option D: Deploy to Nginx Server

1. Copy build files to web server:
```bash
scp -r dist/* user@your-server:/var/www/html/
```

2. Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # SSL configuration
    listen 443 ssl;
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
}
```

## SSL Configuration

### Using Let's Encrypt with Certbot

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

3. Auto-renewal:
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Domain Configuration

### DNS Records

Configure the following DNS records:

```
Type    Name                Value                       TTL
A       yourdomain.com      your_server_ip              300
A       api.yourdomain.com  your_api_server_ip          300
CNAME   www                 yourdomain.com              300
```

## Monitoring and Logging

### Backend Monitoring

#### PM2 Monitoring
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs

# Save logs to file
pm2 logs --nostream > app.log
```

#### Health Checks
Create a health check endpoint:
```javascript
// In your Express app
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Frontend Monitoring

#### Error Tracking
Integrate Sentry for error tracking:
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// In main.jsx
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Backup and Recovery

### Database Backup

#### MongoDB Atlas Backup
1. Enable automatic backups in Atlas dashboard
2. Configure backup schedule
3. Test backup restoration

#### Manual Backup
```bash
# Backup
mongodump --uri="your_mongodb_uri" --out=/backup/location

# Restore
mongorestore --uri="your_mongodb_uri" /backup/location
```

### File Backup

#### Code Backup
```bash
# Create backup
tar -czf code-backup-$(date +%Y%m%d).tar.gz /path/to/your/app

# Upload to cloud storage
aws s3 cp code-backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

## Scaling

### Horizontal Scaling

#### Load Balancing
Configure Nginx as a load balancer:
```nginx
upstream backend {
    server backend1.yourdomain.com;
    server backend2.yourdomain.com;
    server backend3.yourdomain.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

#### Database Scaling
- Use MongoDB sharding for large datasets
- Implement read replicas for read-heavy operations
- Use connection pooling for efficient database connections

### Vertical Scaling
- Upgrade server instances (CPU, RAM)
- Optimize database queries
- Implement caching strategies

## Maintenance

### Regular Tasks

#### Database Maintenance
```bash
# Compact database
db.runCommand({ compact: "collection_name" })

# Repair database
mongod --repair
```

#### Application Updates
```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Restart application
pm2 restart launchpad-market-api
```

#### Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm audit fix
```

## Troubleshooting

### Common Issues

#### Application Not Starting
1. Check PM2 logs: `pm2 logs`
2. Verify environment variables
3. Check database connectivity
4. Review error messages in logs

#### Performance Issues
1. Monitor resource usage: `htop`, `iotop`
2. Check database query performance
3. Review application logs for errors
4. Implement caching where needed

#### SSL Certificate Issues
1. Verify certificate installation
2. Check certificate expiration dates
3. Ensure proper certificate chain
4. Test with SSL checkers

### Emergency Procedures

#### Rollback Deployment
```bash
# Rollback to previous version
pm2 rollback launchpad-market-api

# Or deploy specific version
git checkout v1.0.0
npm install
pm2 restart launchpad-market-api
```

#### Database Recovery
1. Identify backup point
2. Stop application services
3. Restore database from backup
4. Restart application services
5. Verify data integrity

## Support

For deployment issues not covered in this guide:

1. Check the GitHub issues for similar problems
2. Open a new issue with detailed information
3. Contact the development team for assistance
4. Refer to hosting provider documentation

## Next Steps

After successful deployment:

1. **Monitor Performance**: Set up monitoring and alerting
2. **Test Functionality**: Verify all features work in production
3. **Configure Analytics**: Set up Google Analytics or similar
4. **Optimize SEO**: Submit sitemap to search engines
5. **Security Audit**: Perform security assessment
6. **Documentation**: Update deployment documentation with any custom configurations