# 🚀 Deployment Guide - YouTube to Notion Summarizer

This guide will help you deploy the YouTube to Notion Summarizer to production.

## 📋 Prerequisites

1. **Notion Integration**: Create a public integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. **Deployment Platforms**: Choose your preferred platforms:
   - **Frontend**: Vercel, Netlify, or GitHub Pages
   - **Backend**: Railway, Render, Fly.io, or Heroku

## 🔧 Notion Integration Setup

### 1. Create Public Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **"New integration"**
3. Select **"Public"** as the integration type
4. Fill out the required information:
   - **Company name**: Your company/app name
   - **Website**: Your app's website
   - **Redirect URI**: `https://your-backend-domain.com/api/notion/callback`

### 2. Get Integration Credentials

After creating the integration, you'll get:
- **Client ID**: Copy this for your environment variables
- **Client Secret**: Copy this for your environment variables
- **Authorization URL**: This will be used in the OAuth flow

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend

```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Environment Variables

Add these environment variables in Vercel:
```
VITE_API_URL=https://your-backend-domain.com
```

## 🖥️ Backend Deployment (Railway)

### 1. Prepare Backend

```bash
cd backend
# Create .env file with production values
cp env.example .env
# Edit .env with your production values
```

### 2. Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder
4. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   NOTION_CLIENT_ID=your_notion_client_id
   NOTION_CLIENT_SECRET=your_notion_client_secret
   NOTION_REDIRECT_URI=https://your-backend-domain.com/api/notion/callback
   ```

### 3. Update Notion Integration

Update your Notion integration's redirect URI to:
```
https://your-backend-domain.com/api/notion/callback
```

## 🔄 Alternative Deployment Options

### Backend: Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Backend: Fly.io

```bash
# Install flyctl
npm install -g @fly/flyctl

# Login and deploy
flyctl auth login
flyctl launch
flyctl deploy
```

## 🔧 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=https://your-backend-domain.com/api/notion/callback
```

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=https://your-backend-domain.com
```

## 🧪 Testing Your Deployment

1. **Frontend**: Visit your deployed frontend URL
2. **Backend Health**: Check `https://your-backend-domain.com/health`
3. **Notion OAuth**: Test the OAuth flow in the Dashboard
4. **Video Summarization**: Test with a YouTube video

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Ensure CORS is properly configured
3. **Rate Limiting**: The backend includes rate limiting
4. **HTTPS**: Always use HTTPS in production
5. **Token Storage**: Consider using a database for token storage in production

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check `FRONTEND_URL` in backend environment
2. **OAuth Redirect**: Ensure redirect URI matches exactly
3. **API Calls**: Verify `VITE_API_URL` in frontend
4. **Build Errors**: Check Node.js version compatibility

### Debug Steps

1. Check backend logs for errors
2. Verify environment variables are set
3. Test API endpoints directly
4. Check browser console for frontend errors

## 📈 Production Optimizations

1. **Database**: Replace in-memory token storage with a database
2. **Caching**: Add Redis for caching
3. **Monitoring**: Add logging and monitoring
4. **CDN**: Use a CDN for static assets
5. **SSL**: Ensure SSL certificates are properly configured

## 🆘 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test the OAuth flow step by step
4. Check Notion integration settings

---

**Happy Deploying! 🎉**
