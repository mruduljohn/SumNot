#!/bin/bash

# YouTube to Notion Summarizer - Deployment Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo "✅ Frontend build completed"
echo "📁 Frontend build files are in: frontend/dist/"

# Check backend
echo "🔍 Checking backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "⚠️  Backend .env file not found. Please create it from env.example"
    echo "📝 Copy backend/env.example to backend/.env and fill in your values"
fi
cd ..

echo "🎉 Build process completed!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy frontend/dist/ to Vercel/Netlify"
echo "2. Deploy backend/ to Railway/Render/Fly.io"
echo "3. Set up environment variables in your deployment platform"
echo "4. Update Notion integration redirect URI"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
