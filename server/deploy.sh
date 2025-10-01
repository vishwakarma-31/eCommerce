#!/bin/bash

# LaunchPad Market - Backend Deployment Script
# This script automates the deployment process for the backend application

echo "🚀 Starting LaunchPad Market Backend Deployment..."

# Check if we're running on Windows (Git Bash) or Linux/Mac
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "🔧 Detected Windows environment"
    IS_WINDOWS=1
else
    echo "🔧 Detected Unix-like environment"
    IS_WINDOWS=0
fi

# Navigate to script directory
cd "$(dirname "$0")"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
else
    echo "✅ PM2 is already installed"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    echo "📂 Creating logs directory..."
    mkdir logs
fi

# Check if ecosystem.config.js exists
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ PM2 ecosystem configuration not found"
    exit 1
fi

# Stop existing application if running
echo "⏹️ Stopping existing application (if running)..."
pm2 stop launchpad-market-api 2>/dev/null

# Delete existing application from PM2
pm2 delete launchpad-market-api 2>/dev/null

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Check if start was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to start application with PM2"
    exit 1
fi

echo "✅ Application started successfully"

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Show application status
echo "📊 Application status:"
pm2 list

echo "🎉 LaunchPad Market Backend Deployment Completed Successfully!"
echo "📝 To view logs, run: pm2 logs launchpad-market-api"