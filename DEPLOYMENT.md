# 🚀 Deployment Guide - YouTube to Notion Summarizer

This guide will help you deploy the YouTube to Notion Summarizer to production using Render for both frontend and backend.

## 📋 Prerequisites

1. **Notion Integration**: Create a public integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. **Render Account**: Sign up at [Render](https://render.com)
3. **GitHub Repository**: Ensure your code is pushed to GitHub

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

## 🖥️ Backend Deployment (Render)

### 1. Deploy Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `youtube-notion-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Starter` (free tier) or `Standard` (paid)

### 2. Backend Environment Variables

Add these environment variables in Render:
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.onrender.com
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=https://your-backend-service.onrender.com/api/notion/callback
```

**Note**: The `NOTION_CLIENT_SECRET` is only used temporarily during the OAuth callback to exchange the authorization code for an access token. It's not stored permanently and is only needed for the OAuth flow validation.

### 3. Update Notion Integration

Update your Notion integration's redirect URI to:
```
https://your-backend-service.onrender.com/api/notion/callback
```

## 🌐 Frontend Deployment (Render)

### 1. Deploy Frontend Service

1. In your Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure the frontend service:
   - **Name**: `youtube-notion-frontend` (or your preferred name)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 2. Frontend Environment Variables

Add these environment variables in Render:
```
VITE_API_URL=https://your-backend-service.onrender.com
```

### 3. Update Backend CORS

After deploying the frontend, update the backend's `FRONTEND_URL` environment variable to match your frontend URL:
```
FRONTEND_URL=https://your-frontend-app.onrender.com
```

## 📋 Deployment Order & Best Practices

### Recommended Deployment Order

1. **Deploy Backend First**: This ensures the API is available when frontend tries to connect
2. **Deploy Frontend Second**: This allows you to set the correct backend URL in frontend environment variables
3. **Update Environment Variables**: After both are deployed, update the backend's `FRONTEND_URL` to match your frontend URL

### Render Deployment Tips

1. **Free Tier Limitations**: 
   - Services sleep after 15 minutes of inactivity
   - 512MB RAM limit
   - 15-minute build timeout
   - 100GB bandwidth per month

2. **Service Names**: Use descriptive names like `youtube-notion-backend` and `youtube-notion-frontend`

3. **Environment Variables**: Set all environment variables before first deployment

4. **Auto-Deploy**: Services automatically deploy when you push to your main branch

## 🔧 Environment Variables Reference

### Backend (Render Web Service)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.onrender.com
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=https://your-backend-service.onrender.com/api/notion/callback
```

**Security Note**: The `NOTION_CLIENT_SECRET` is only used during OAuth token exchange and should never be exposed to the client. It's kept secure on the server side.

### Frontend (Render Static Site)
```env
VITE_API_URL=https://your-backend-service.onrender.com
```

## 🧪 Testing Your Deployment

1. **Frontend**: Visit your deployed frontend URL (e.g., `https://your-frontend-app.onrender.com`)
2. **Backend Health**: Check `https://your-backend-service.onrender.com/health`
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

1. **CORS Errors**: Check `FRONTEND_URL` in backend environment variables
2. **OAuth Redirect**: Ensure redirect URI matches exactly in Notion integration
3. **API Calls**: Verify `VITE_API_URL` in frontend environment variables
4. **Build Errors**: Check Node.js version compatibility (Render uses Node 18 by default)
5. **Service Sleep**: Free tier services sleep after 15 minutes of inactivity

### Debug Steps

1. Check Render service logs in the dashboard
2. Verify environment variables are set correctly
3. Test API endpoints directly using curl or Postman
4. Check browser console for frontend errors
5. Ensure both services are deployed and running

### Render-Specific Issues

1. **Cold Start**: First request after sleep may take 30+ seconds
2. **Build Timeout**: Free tier has 15-minute build timeout
3. **Memory Limits**: Free tier has 512MB RAM limit
4. **Auto-Deploy**: Services auto-deploy on git push to main branch

## 📈 Production Optimizations

1. **Database**: Replace in-memory token storage with Render PostgreSQL
2. **Caching**: Add Redis for caching (available on Render)
3. **Monitoring**: Add logging and monitoring
4. **CDN**: Render provides CDN for static sites automatically
5. **SSL**: Render provides SSL certificates automatically
6. **Upgrade Tiers**: Consider upgrading to paid tiers for better performance
7. **Health Checks**: Implement health check endpoints for monitoring

## 🆘 Support

If you encounter issues:
1. Check the logs in your Render dashboard
2. Verify all environment variables are set correctly
3. Test the OAuth flow step by step
4. Check Notion integration settings
5. Review Render documentation: [Render Docs](https://render.com/docs)
6. Check service status in Render dashboard

---

**Happy Deploying! 🎉**
