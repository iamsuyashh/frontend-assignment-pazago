# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Your Roll Number

Open `hooks/useChat.ts` and find this line:

```typescript
const THREAD_ID = 'YOUR_COLLEGE_ROLL_NUMBER';
```

Replace `'YOUR_COLLEGE_ROLL_NUMBER'` with your actual college roll number.

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

Try asking:
- "What's the weather in London?"
- "Will it rain tomorrow in Paris?"
- "Weather forecast for New York next week"

## Troubleshooting

### Dependencies not installing?
Try:
```bash
npm cache clean --force
npm install
```

### API not responding?
- Check your internet connection
- Verify your roll number is configured correctly
- Check browser console for errors

### Build errors?
Run:
```bash
npm run build
```

Look for any TypeScript or build errors in the output.

## Features to Test

- ✅ Send messages
- ✅ Receive streaming responses
- ✅ Toggle dark/light mode
- ✅ Search messages
- ✅ Export chat history
- ✅ Clear chat
- ✅ Retry failed messages
- ✅ Responsive design (try different screen sizes)

## Production Build

```bash
npm run build
npm start
```

## Deployment

The easiest way is to deploy to Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

For other platforms, ensure they support Next.js 14+ and Node.js 18+.
