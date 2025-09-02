# 🎥 YouTube to Notion Summarizer

A modern web application that automatically summarizes YouTube videos and saves them to your Notion workspace. Perfect for students, researchers, and content creators who want to quickly capture key insights from educational videos.

## ✨ Features

- **🎬 YouTube Integration**: Extract transcripts from any YouTube video
- **🤖 AI-Powered Summarization**: Support for OpenAI, Anthropic, and OpenRouter
- **📝 Notion Integration**: Automatically save summaries to your Notion database
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🔒 Privacy-First**: Your API keys stay on your device
- **⚡ Real-time Progress**: Live updates during processing
- **🏷️ Smart Tagging**: Automatic topic categorization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Notion account
- An AI API key (OpenAI, Anthropic, or OpenRouter)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube-notion-summarizer
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   cd ..
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Configuration

### Notion Setup

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new **Public** integration
3. Fill out the required information:
   - **Company name**: Your app name
   - **Website**: Your app's website
   - **Redirect URI**: `http://localhost:3000/auth/notion/callback` (for development)
4. Copy the **Client ID** and **Client Secret**
5. Create a new database in Notion with these properties:
   - **Title** (Title)
   - **Video URL** (URL)
   - **Date** (Date)
   - **Tags** (Multi-select)
6. The integration will automatically have access to your workspace through OAuth

### AI Provider Setup

Choose one of the following AI providers:

#### OpenAI
- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Supports GPT-4 and GPT-3.5 models

#### Anthropic
- Get your API key from [Anthropic Console](https://console.anthropic.com/)
- Supports Claude models

#### OpenRouter
- Get your API key from [OpenRouter](https://openrouter.ai/)
- Supports multiple models from different providers

## 📖 Usage

1. **Configure Notion** (Dashboard tab)
   - Enter your Notion Client ID
   - Set redirect URI to `http://localhost:3000/auth/notion/callback`
   - Click "Connect to Notion"

2. **Summarize a Video** (Home tab)
   - Paste a YouTube URL
   - Select your AI provider
   - Enter your API key
   - Click "Summarize & Save to Notion"

3. **View Results**
   - Summary appears in real-time
   - Click "View in Notion" to see the saved page

## 🏗️ Project Structure

```
youtube-notion-summarizer/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   └── lib/            # Utility functions
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── routes/             # API route handlers
│   │   ├── notion.js       # Notion integration
│   │   ├── youtube.js      # YouTube transcript fetching
│   │   └── ai.js          # AI summarization
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Backend Routes

- `POST /api/transcript` - Extract YouTube transcript
- `POST /api/summarize` - Generate AI summary
- `POST /api/notion/auth` - Initiate Notion OAuth
- `GET /api/notion/callback` - Handle OAuth callback
- `POST /api/notion/save` - Save summary to Notion
- `GET /api/notion/databases` - List user's databases

## 🛡️ Security Features

- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Secure cross-origin requests
- **Error Handling**: Comprehensive error management
- **No Data Storage**: API keys stored locally only

## 🎨 UI Components

Built with modern design principles:

- **shadcn/ui**: High-quality, accessible components
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Responsive Design**: Works on all devices
- **Dark Mode Ready**: Built-in theme support

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment

**Build for production:**
```bash
# Windows PowerShell
.\deploy.ps1

# Linux/Mac
chmod +x deploy.sh && ./deploy.sh
```

### Recommended Platforms

- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io)

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=https://your-backend-domain.com/api/notion/callback
```

**Frontend (Vercel/Netlify):**
```env
VITE_API_URL=https://your-backend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: Report bugs on GitHub Issues
- **Documentation**: Check the code comments for detailed explanations
- **Community**: Join discussions in GitHub Discussions

## 🔮 Roadmap

- [ ] Batch processing for multiple videos
- [ ] Custom summary templates
- [ ] Export to PDF/Word
- [ ] Video timestamp highlights
- [ ] Chrome extension
- [ ] Mobile app

---

**Built with ❤️ for the community**
