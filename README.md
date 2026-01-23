# Weather Chat Agent ☁️

A modern, responsive chat interface for interacting with an AI-powered weather agent. Built with Next.js 14, TypeScript, and Tailwind CSS with comprehensive environment variable configuration and PDF export capabilities.

![Weather Chat Agent](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)

## ✨ Features

### Core Features ✅

- **Real-time Chat Interface** - Message input with auto-resize, user/agent message distinction, smart auto-scroll
- **Live API Integration** - Connected to Provue AI Weather Agent with real-time streaming
- **Server-Sent Events** - True SSE streaming for instant response updates
- **Chat History Sidebar** - View all conversations in an organized sidebar with:
  - Conversation pairs (user question + assistant response)
  - Numbered conversations for easy reference
  - Timestamps for each exchange
  - Mobile-responsive slide-in panel
  - Quick export and clear actions
- **PDF Export** - Export chat history as professionally formatted PDF files
- **Message Management** - Persistent chat history (localStorage), search functionality
- **Responsive Design** - Mobile-first approach, works on all screen sizes (320px+)
- **Environment Variables** - Secure configuration management for API settings

### Advanced Features 🚀

- **Configuration Management** - Centralized config with validation
- **Mock API Mode** - Test the application without connecting to the real API
- **Debug Mode** - Detailed logging for troubleshooting
- **Error Handling** - Comprehensive error messages with retry functionality
- **Search Functionality** - Real-time message search with result count
- **Accessibility** - ARIA labels, keyboard navigation, screen reader friendly
- **User Experience** - Smooth animations, loading indicators, sound notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **API**: Fetch API with Streaming Support
- **Storage**: LocalStorage
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontendpazago
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your configuration:
   ```env
   NEXT_PUBLIC_THREAD_ID=your_college_roll_number
   PROVUE_API_URL=https://api-dev.provue.ai/api/webapp/agent/test-agent
   PROVUE_API_KEY=your_api_key_if_required
   API_TIMEOUT=30000
   MAX_MESSAGE_LENGTH=2000
   USE_MOCK_API=false
   DEBUG_MODE=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start with Mock API

For testing without the real API:
```env
USE_MOCK_API=true
```

This enables mock responses for development and testing.

## ⚙️ Environment Configuration

The application uses environment variables for secure configuration. See [ENV_SETUP.md](ENV_SETUP.md) for detailed documentation.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_THREAD_ID` | Your college roll number | `231255` |
| `PROVUE_API_URL` | API endpoint URL | `https://api-dev.provue.ai/...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PROVUE_API_KEY` | API authentication key | Empty |
| `API_TIMEOUT` | Request timeout (ms) | `30000` |
| `MAX_MESSAGE_LENGTH` | Max characters per message | `2000` |
| `USE_MOCK_API` | Enable mock mode | `false` |
| `DEBUG_MODE` | Enable debug logging | `false` |

For complete configuration details, see [ENV_SETUP.md](ENV_SETUP.md).

## 📁 Project Structure

```
frontendpazago/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API proxy with config integration
│   ├── favicon.ico
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main chat interface page
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx     # Main chat wrapper with sidebar
│   │   ├── ChatHeader.tsx        # Header with actions
│   │   ├── ChatInput.tsx         # Message input with auto-resize
│   │   ├── ChatSidebar.tsx       # Chat history sidebar (NEW)
│   │   ├── MessageBubble.tsx     # Individual message display
│   │   ├── MessageFeedback.tsx   # Message feedback component
│   │   ├── MessageList.tsx       # Message list with auto-scroll
│   │   └── SearchBar.tsx         # Search functionality
├── hooks/
│   ├── useChat.ts                # Chat state & API integration
│   └── useLocalStorage.ts        # LocalStorage persistence hook
├── lib/
│   ├── config.ts                 # Environment config management (NEW)
│   ├── constants.ts              # App constants
│   └── utils.ts                  # Utility functions + PDF export (NEW)
├── types/
│   └── chat.ts                   # TypeScript type definitions
├── public/
│   └── manifest.json             # PWA manifest
├── .env.example                  # Environment variables template
├── .env.local                    # Your local config (not in git)
├── .gitignore                    # Git ignore rules
├── ENV_SETUP.md                  # Environment setup guide (NEW)
├── FEATURES.md                   # Feature documentation
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # This file
├── SETUP.md                      # Setup instructions
└── tsconfig.json                 # TypeScript configuration
```

## 🔌 API Integration

### Provue AI Weather Agent

The application integrates with the Provue AI Weather Agent API through a secure Next.js API route.

**Endpoint**: Configured via `PROVUE_API_URL` environment variable  
**Default**: `https://api-dev.provue.ai/api/webapp/agent/test-agent`

#### Request Format
```json
{
  "prompt": "What's the weather in Mumbai?",
  "stream": true
}
```

#### Response Format
Server-Sent Events (SSE) stream:
```
data: {"type":"start","payload":{}}

data: {"type":"text-delta","payload":{"text":"The "}}

data: {"type":"text-delta","payload":{"text":"weather "}}

data: {"type":"done"}
```

#### Features
- **Real-time Streaming**: SSE for live response updates
- **Secure Proxy**: Next.js API route protects credentials
- **Error Handling**: Comprehensive error messages
- **Timeout Management**: Configurable request timeouts
- **Mock Mode**: Test without real API connection
- **Retry Logic**: Automatic retry on failures

#### Configuration
Set in `.env.local`:
```env
PROVUE_API_URL=https://api-dev.provue.ai/api/webapp/agent/test-agent
PROVUE_API_KEY=your_api_key  # Optional
API_TIMEOUT=30000
```

### Mock API Mode

For development and testing without API access:
```env
USE_MOCK_API=true
```

This provides simulated responses that mimic the real API behavior.

## 🚀 Deployment

### Environment Variables Setup

Before deploying, ensure all environment variables are configured:

1. **Set required variables**:
   - `NEXT_PUBLIC_THREAD_ID`
   - `PROVUE_API_URL`

2. **Optional variables**:
   - `PROVUE_API_KEY` (if API requires authentication)
   - `API_TIMEOUT`, `MAX_MESSAGE_LENGTH`, etc.

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

Set environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

Set environment variables in Netlify dashboard:
- Go to Site Settings → Build & Deploy → Environment
- Add all required variables

### Self-Hosted Deployment

```bash
npm run build
npm start
```

Ensure environment variables are set in your hosting environment.

## 📖 Documentation

- **[ENV_SETUP.md](ENV_SETUP.md)** - Complete environment configuration guide
- **[FEATURES.md](FEATURES.md)** - Detailed feature documentation
- **[SETUP.md](SETUP.md)** - Initial setup instructions

## 🔒 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ API key never exposed to client
- ✅ Request validation and sanitization
- ✅ Rate limiting considerations
- ✅ Secure API proxy pattern
- ✅ `.env.local` excluded from version control

## 🐛 Troubleshooting

### API Connection Issues

1. **Enable debug mode**:
   ```env
   DEBUG_MODE=true
   ```

2. **Use mock mode for testing**:
   ```env
   USE_MOCK_API=true
   ```

3. **Check API URL**:
   Verify `PROVUE_API_URL` is correct

4. **Check logs**:
   Look at browser console and server logs

### Common Issues

- **"fetch failed" error**: Network connectivity or DNS issue
- **Timeout errors**: Increase `API_TIMEOUT` value
- **403/401 errors**: Check `PROVUE_API_KEY` is set correctly

See [ENV_SETUP.md](ENV_SETUP.md) for more troubleshooting tips.

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 👤 Author

**Suyash Labde**
- Roll Number: 231255
- GitHub: [@iamsuyashh]

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and jsPDF