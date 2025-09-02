# YouTube to Notion Summarizer - Deployment Script (PowerShell)
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "✅ Frontend build completed" -ForegroundColor Green
Write-Host "📁 Frontend build files are in: frontend/dist/" -ForegroundColor Cyan

# Check backend
Write-Host "🔍 Checking backend..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Backend .env file not found. Please create it from env.example" -ForegroundColor Yellow
    Write-Host "📝 Copy backend/env.example to backend/.env and fill in your values" -ForegroundColor Cyan
}
Set-Location ..

Write-Host "🎉 Build process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy frontend/dist/ to Vercel/Netlify" -ForegroundColor White
Write-Host "2. Deploy backend/ to Railway/Render/Fly.io" -ForegroundColor White
Write-Host "3. Set up environment variables in your deployment platform" -ForegroundColor White
Write-Host "4. Update Notion integration redirect URI" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
