# Deployment Guide

## Frontend (Client) Deployment

### Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and sign up or log in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: client
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables if needed:
   - `VITE_API_URL` - URL of your deployed backend
   - `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
6. Click "Deploy"

### Environment Variables for Client

```bash
VITE_API_URL=https://your-backend-url.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Backend (Server) Deployment

### Render.com Deployment (Recommended)

1. Go to [render.com](https://render.com) and sign up or log in
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: launchpad-market-api
   - Region: Choose your preferred region
   - Branch: main
   - Root Directory: server
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `NODE_ENV` = production
   - `PORT` = 5000
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your JWT secret
   - `JWT_EXPIRE` = 24h
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET` = your Stripe webhook secret
   - `EMAIL_HOST` = your email host
   - `EMAIL_PORT` = your email port
   - `EMAIL_USER` = your email username
   - `EMAIL_PASS` = your email password
   - `CLIENT_URL` = https://your-frontend-url.com
6. Click "Create Web Service"

### Environment Variables for Server

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/your-database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=24h
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
EMAIL_HOST=your-email-host.com
EMAIL_PORT=587
EMAIL_USER=your-email-username
EMAIL_PASS=your-email-password
CLIENT_URL=https://your-frontend-url.com
```

## Database Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Add your IP address to the IP whitelist (or allow access from anywhere for development)
5. Get your connection string and replace the placeholders with your credentials

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up webhooks for payment events

## Email Setup

For email notifications, you can use:
1. SendGrid
2. Gmail SMTP
3. Amazon SES
4. Other email providers

Make sure to configure the email environment variables accordingly.

## Deployment Tips

1. Always use environment variables for sensitive information
2. Never commit actual secrets to version control
3. Test your deployment in a staging environment first
4. Monitor your application logs for errors
5. Set up proper error handling and monitoring