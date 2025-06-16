>
#!/bin/bash

# Figma Converter - Production Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 Starting Figma Converter deployment process..."
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Validate environment variables
echo "🔍 Validating environment variables..."
node scripts/validate-environment.js

if [ $? -ne 0 ]; then
    echo "❌ Environment validation failed. Please fix the issues above."
    exit 1
fi

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the build errors."
    exit 1
fi

# Run tests (if available)
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 Running tests..."
    npm test
    
    if [ $? -ne 0 ]; then
        echo "❌ Tests failed. Please fix the failing tests."
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your Figma Converter is now live on Vercel!"
    echo ""
    echo "Next steps:"
    echo "1. Test your deployment thoroughly"
    echo "2. Set up monitoring and analytics"
    echo "3. Configure custom domain (optional)"
    echo ""
    echo "Happy converting! 🎨➡️⚛️"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
