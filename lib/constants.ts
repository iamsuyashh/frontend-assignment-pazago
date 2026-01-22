// API configuration is now handled server-side in app/api/chat/route.ts

export const DEFAULT_REQUEST_PARAMS = {
  runId: 'weatherAgent',
  maxRetries: 2,
  maxSteps: 5,
  temperature: 0.5,
  topP: 1,
  runtimeContext: {},
  resourceId: 'weatherAgent'
};

export const STORAGE_KEYS = {
  THEME: 'weather-chat-theme',
  MESSAGES: 'weather-chat-messages',
  THREAD_ID: 'weather-chat-thread-id'
};

export const SAMPLE_QUERIES = [
  "What's the weather in London?",
  "Will it rain tomorrow in Paris?",
  "Weather forecast for New York next week",
  "What's the temperature in Tokyo?"
];
