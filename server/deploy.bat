@echo off
:: LaunchPad Market - Backend Deployment Script for Windows
:: This script automates the deployment process for the backend application on Windows

title LaunchPad Market Backend Deployment

echo 🚀 Starting LaunchPad Market Backend Deployment...

:: Navigate to script directory
cd /d "%~dp0"

:: Check if PM2 is installed
echo Checking if PM2 is installed...
npm list -g pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PM2 is not installed. Installing PM2...
    npm install -g pm2
) else (
    echo ✅ PM2 is already installed
)

:: Install dependencies
echo 📦 Installing dependencies...
npm install --production

:: Check if installation was successful
if %errorlevel% neq 0 (
    echo ❌ Dependency installation failed
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

:: Create logs directory if it doesn't exist
if not exist "logs" (
    echo 📂 Creating logs directory...
    mkdir logs
)

:: Check if ecosystem.config.js exists
if not exist "ecosystem.config.js" (
    echo ❌ PM2 ecosystem configuration not found
    pause
    exit /b 1
)

:: Stop existing application if running
echo ⏹️ Stopping existing application (if running)...
pm2 stop launchpad-market-api >nul 2>&1

:: Delete existing application from PM2
pm2 delete launchpad-market-api >nul 2>&1

:: Start application with PM2
echo 🚀 Starting application with PM2...
pm2 start ecosystem.config.js --env production

:: Check if start was successful
if %errorlevel% neq 0 (
    echo ❌ Failed to start application with PM2
    pause
    exit /b 1
)

echo ✅ Application started successfully

:: Save PM2 configuration
echo 💾 Saving PM2 configuration...
pm2 save

:: Show application status
echo 📊 Application status:
pm2 list

echo 🎉 LaunchPad Market Backend Deployment Completed Successfully!
echo 📝 To view logs, run: pm2 logs launchpad-market-api

pause