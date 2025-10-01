@echo off
:: LaunchPad Market - Frontend Deployment Script for Windows
:: This script automates the deployment process for the frontend application on Windows

title LaunchPad Market Frontend Deployment

echo 🚀 Starting LaunchPad Market Frontend Deployment...

:: Navigate to script directory
cd /d "%~dp0"

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

:: Build for production
echo 🔨 Building for production...
npm run build

:: Check if build was successful
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

:: For CDN deployment, you would typically upload the dist folder contents
:: to your CDN-enabled storage service here

echo 📂 Build output is located in the 'dist' folder
echo 📋 To deploy to a CDN:
echo    1. Upload the contents of the 'dist' folder to your CDN storage
echo    2. Configure your CDN to serve assets from this location
echo    3. Update your base URL in vite.config.js if needed

echo 🎉 LaunchPad Market Frontend Build Completed Successfully!

pause