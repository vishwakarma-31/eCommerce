#!/bin/bash

# LaunchPad Market - Frontend Deployment Script
# This script automates the deployment process for the frontend application

echo "🚀 Starting LaunchPad Market Frontend Deployment..."

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

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# For CDN deployment, you would typically upload the dist folder contents
# to your CDN-enabled storage service here

echo "📂 Build output is located in the 'dist' folder"
echo "📋 To deploy to a CDN:"
echo "   1. Upload the contents of the 'dist' folder to your CDN storage"
echo "   2. Configure your CDN to serve assets from this location"
echo "   3. Update your base URL in vite.config.js if needed"

echo "🎉 LaunchPad Market Frontend Build Completed Successfully!"