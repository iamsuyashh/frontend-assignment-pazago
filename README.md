# Weather Chat Agent ️

A modern, responsive chat interface for interacting with an AI-powered weather agent. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Weather Chat Agent](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)

## ✨ Features

### Core Features ✅

- **Real-time Chat Interface** - Message input with auto-resize, user/agent message distinction, smart auto-scroll
- **Live API Integration** - Connected to Provue AI Weather Agent with real-time streaming
- **Server-Sent Events** - True SSE streaming for instant response updates
- **Message Management** - Persistent chat history (localStorage), export to JSON, clear chat
- **Responsive Design** - Mobile-first approach, works on all screen sizes (320px+)
- **Dark/Light Theme** - Persistent theme switching with smooth transitions

### API Integration

The application is now integrated with the **Provue AI Weather Agent API** (`https://api-dev.provue.ai/api/webapp/agent/test-agent`). The implementation includes:

- **Real-time Streaming**: Server-Sent Events (SSE) for live response updates
- **Direct API Proxy**: Next.js API route forwards requests to Provue AI
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual indicators during API calls
- **Conversation Context**: Full message history sent with each request

The API endpoint accepts POST requests with:
```json
{
  "prompt": "What's the weather in Mumbai?",
  "stream": true
}
```

Responses are streamed in real-time using Server-Sent Events format.

### Advanced Features 

- **Dark/Light Theme Toggle** - System preference detection, manual switching, persistent selection
- **Search Functionality** - Real-time message search with result count
- **Accessibility** - ARIA labels, keyboard navigation, screen reader friendly
- **User Experience** - Smooth animations, loading indicators, sound notifications, error handling

## ️ Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **API**: Fetch API with Streaming Support
- **Storage**: LocalStorage

##  Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Thread ID in `hooks/useChat.ts`:
   ```typescript
   const THREAD_ID = 'YOUR_COLLEGE_ROLL_NUMBER';
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
frontendpazago/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API proxy to Provue AI weather agent
│   ├── favicon.ico
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout with ThemeProvider
│   └── page.tsx                  # Main chat interface page
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx     # Main chat wrapper component
│   │   ├── ChatHeader.tsx        # Header with theme toggle & actions
│   │   ├── ChatInput.tsx         # Message input with auto-resize
│   │   ├── MessageBubble.tsx     # Individual message display
│   │   ├── MessageList.tsx       # Message list with auto-scroll
│   │   └── SearchBar.tsx         # Search functionality
│   
│  
│   
├── hooks/
│   ├── useChat.ts                # Chat state & API integration
│   ├── useLocalStorage.ts        # LocalStorage persistence hook
│ 
├── lib/
│   ├── constants.ts              # API config & app constants
│   └── utils.ts                  # Utility functions (cn, formatTimestamp, etc.)
├── types/
│   └── chat.ts                   # TypeScript type definitions
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── ARCHITECTURE.md               # Architecture documentation
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # This file
├── SETUP.md                      # Setup instructions
└── tsconfig.json                 # TypeScript configuration
```

## ⚙️ Configuration

The application connects to the **Provue AI Weather Agent API** at:
```
https://api-dev.provue.ai/api/webapp/agent/test-agent
```

API configuration is handled in `app/api/chat/route.ts`. The Thread ID can be customized in `hooks/useChat.ts`:

```typescript
const THREAD_ID = 'YOUR_COLLEGE_ROLL_NUMBER';
```

## 🚀 Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
npm start
```

The API route automatically proxies requests to the Provue AI backend, so no additional environment variables are required.

##  Author

**Suyash Labde**
- Roll Number: [231255]
- GitHub: [@iamsuyashh]

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
