# Weather Chat Agent ���️

A modern, responsive chat interface for interacting with an AI-powered weather agent. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Weather Chat Agent](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## ��� Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)

## ✨ Features

### Core Features ✅

- **Real-time Chat Interface** - Message input with auto-resize, user/agent message distinction, auto-scroll
- **Streaming API Integration** - Server-Sent Events support, real-time response streaming, error handling
- **Message Management** - Persistent chat history (localStorage), export to JSON, clear chat
- **Responsive Design** - Mobile-first approach, works on all screen sizes (320px+)

### Advanced Features ���

- **Dark/Light Theme Toggle** - System preference detection, manual switching, persistent selection
- **Search Functionality** - Real-time message search with result count
- **Accessibility** - ARIA labels, keyboard navigation, screen reader friendly
- **User Experience** - Smooth animations, loading indicators, sound notifications, error handling

## ���️ Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **API**: Fetch API with Streaming Support
- **Storage**: LocalStorage

## ��� Getting Started

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

## ��� Project Structure

```
frontendpazago/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Mock API with streaming weather responses
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
│   │   ├── MessageList.tsx       # Messages list with auto-scroll
│   │   └── SearchBar.tsx         # Search functionality
│   ├── providers/
│   │   └── ThemeProvider.tsx     # Theme context provider
│   └── ThemeToggle.tsx           # Dark/light mode toggle button
├── hooks/
│   ├── useChat.ts                # Chat state & API integration
│   ├── useLocalStorage.ts        # LocalStorage persistence hook
│   └── useTheme.ts               # Theme management hook
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

API endpoint and parameters are in `lib/constants.ts`. Replace the THREAD_ID in `hooks/useChat.ts` with your college roll number.

### API Implementation Note

**Important:** The streaming API endpoint provided in the assignment could not be resolved via public DNS. The application therefore demonstrates streaming behavior using a mocked ReadableStream that mirrors the expected API response format.

The mock API (`app/api/chat/route.ts`) simulates realistic weather responses with word-by-word streaming for cities like London, Paris, Mumbai, New York, Tokyo, Sydney, and Dubai. This implementation showcases all the required functionality including:
- Server-Sent Events (SSE) streaming
- Real-time response display
- Error handling
- Loading states

To integrate with a real API endpoint, simply replace the mock implementation in `app/api/chat/route.ts` with the actual API call.

## ��� Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
npm start
```

## ��� Author

**Your Name**
- Roll Number: [YOUR_ROLL_NUMBER]
- GitHub: [@yourusername]

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
