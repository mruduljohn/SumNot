# 📘 Development Documentation – YouTube to Notion Summarizer

## 📌 Project Overview
A lightweight web application that allows users to **summarize YouTube videos (e.g., daily current affairs for SSB prep)** and automatically save the summaries into their **Notion workspace**.  

- No separate user accounts needed → **Notion OAuth** acts as login.  
- Users can bring their own **AI API key** (OpenAI, Anthropic, OpenRouter, etc.).  
- Easy to deploy and share with others.  

---

## 🎯 Core Features (MVP)
- **YouTube Summarization**
  - Fetch transcript from YouTube videos.  
  - Generate summaries (bullet points, concise).  
  - Auto-tag topics (Defence, Economy, International, etc.).  

- **Notion Integration**
  - Login with Notion OAuth.  
  - Save summaries into a Notion database template (title, link, date, tags, summary).  

- **AI Model Flexibility**
  - Users can paste their own API key.  
  - Supported providers:  
    - OpenAI  
    - Anthropic  
    - OpenRouter  

- **UI**
  - Paste YouTube link → Click “Summarize & Save”.  
  - Paste/manage AI API key.  
  - Connect/disconnect Notion account.  

---

## 🚀 Future Features (Post-MVP)
- Auto-fetch top daily current affairs videos.  
- Daily digest → Push summaries directly into Notion.  
- Export summaries as PDF.  
- Timestamp-based highlights.  

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: React (Vite)  
- **Styling**: TailwindCSS  
- **Components**: shadcn/ui (for clean, modern UI)  
- **Auth Flow**: Redirect to Notion OAuth  

### **Backend**
- **Runtime**: Node.js  
- **Framework**: Express.js (or Fastify for performance)  
- **Notion API**: Official Notion SDK  
- **YouTube Transcript**: `youtube-transcript` package (fallback: Whisper API)  
- **AI Summarization**:  
  - OpenAI (`gpt-4o-mini` or `gpt-3.5-turbo`)  
  - Anthropic (Claude)  
  - OpenRouter (multi-model support)  

### **Database**
- **None required** → No user accounts.  
- Temporary session storage for tokens (frontend/localStorage or backend memory).  

---

## 🔄 High-Level Workflow

1. **User connects Notion** → App retrieves OAuth token.  
2. **User pastes AI API key** → App saves in session/local.  
3. **User pastes YouTube link** → Backend fetches transcript.  
4. **Backend sends transcript to AI** → Generates structured summary.  
5. **Backend saves summary into Notion DB** → With metadata:  
   - 📅 Date  
   - 🎥 Video title  
   - 🔗 YouTube link  
   - 📌 Summary (bullets)  
   - 🏷 Tags  

---

## 📂 Project Structure

youtube-notion-summarizer/
│
├── frontend/ # React (Vite + Tailwind)
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Routes (Home, Connect, Dashboard)
│ │ ├── utils/ # Notion & API helpers
│ │ └── App.tsx
│ └── package.json
│
├── backend/ # Node.js + Express
│ ├── routes/
│ │ ├── notion.js # Notion OAuth + push to DB
│ │ ├── youtube.js # Transcript fetching
│ │ ├── ai.js # AI summarization
│ ├── app.js
│ └── package.json
│
└── README.md # Setup & usage guide

markdown
Copy code

---

## ⚡ API Endpoints

### **Backend**
- `POST /auth/notion/connect` → Notion OAuth login.  
- `POST /summarize` → Input: YouTube link + API key → Output: Summary JSON.  
- `POST /save` → Saves summary into Notion DB.  

---

## 📋 Development Steps

### 1. **Frontend Setup**
- Initialize React + Vite.  
- Install Tailwind + shadcn/ui.  
- Create pages:  
  - Home (paste link + API key)  
  - Connect Notion (OAuth button)  
  - Dashboard (history view).  

### 2. **Backend Setup**
- Initialize Express.js.  
- Setup routes: `/auth/notion`, `/summarize`, `/save`.  
- Install: `notion-sdk`, `youtube-transcript`, `axios`.  

### 3. **Notion OAuth**
- Register Notion integration.  
- Get client_id, client_secret.  
- Implement OAuth flow.  

### 4. **Transcript Fetcher**
- Try `youtube-transcript` → if unavailable, fallback to Whisper API.  

### 5. **AI Summarization**
- Accept API key from user.  
- Based on provider selection (OpenAI/Anthropic/OpenRouter), send transcript.  
- Format output → concise bullet points + topic tags.  

### 6. **Notion Save**
- Push summary to Notion DB template.  
- Fields: title, link, date, tags, summary.  

---

## ✅ Example Notion Database Schema
- **Title**: Video title  
- **Date**: Auto-fill current date  
- **Link**: YouTube link  
- **Summary**: Rich text (bullet points)  
- **Tags**: Multi-select (Defence, Economy, International, etc.)  

---

## 🏗 Deployment
- **Frontend**: Vercel / Netlify  
- **Backend**: Render / Railway / Fly.io  
- **Notion OAuth Redirect URL** → Must match deployed backend URL  

---

## 🔒 Security Notes
- No database = reduced risks.  
- Users manage their own API keys (stored client-side).  
- Never log transcripts or summaries on backend.