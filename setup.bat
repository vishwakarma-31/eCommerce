@echo off
echo LaunchPad Market - Setup Script
echo ===============================
echo.
echo This script will guide you through the setup process.
echo.
echo Prerequisites:
echo 1. Node.js and npm (already installed - verified)
echo 2. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
echo 3. Stripe account (https://dashboard.stripe.com/register)
echo 4. PayPal account (https://developer.paypal.com/)
echo.
echo Setup Steps:
echo 1. Create MongoDB Atlas account and cluster
echo 2. Update server/.env with your MongoDB connection string
echo 3. Update server/.env with your Stripe and PayPal API keys
echo 4. Update server/.env with your email configuration
echo 5. Run the application with:
echo    cd server ^&^& npm run dev
echo    cd client ^&^& npm run dev
echo.
echo For detailed instructions, please read:
echo  - SETUP_INSTRUCTIONS.md for general setup
echo  - DATABASE_SETUP.md for database configuration
echo  - COMPLETE_SETUP_GUIDE.md for comprehensive setup guide
echo.
pause