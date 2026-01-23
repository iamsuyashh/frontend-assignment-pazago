/**
 * Server-side configuration
 * Reads environment variables and provides typed configuration
 */

export const config = {
  // API Configuration
  api: {
    url: process.env.PROVUE_API_URL || 'https://api-dev.provue.ai/api/webapp/agent/test-agent',
    key: process.env.PROVUE_API_KEY || '',
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '2000', 10),
  },

  // Development Settings
  dev: {
    useMockApi: process.env.USE_MOCK_API === 'true',
    debugMode: process.env.DEBUG_MODE === 'true',
  },

  // Thread Configuration
  thread: {
    id: process.env.NEXT_PUBLIC_THREAD_ID || '',
  },
} as const;

/**
 * Validate required environment variables
 * @throws Error if required variables are missing
 */
export function validateConfig(): void {
  const errors: string[] = [];

  if (!config.api.url) {
    errors.push('PROVUE_API_URL is not configured');
  }

  if (config.api.timeout < 1000 || config.api.timeout > 60000) {
    errors.push('API_TIMEOUT must be between 1000 and 60000 milliseconds');
  }

  if (config.api.maxMessageLength < 1 || config.api.maxMessageLength > 10000) {
    errors.push('MAX_MESSAGE_LENGTH must be between 1 and 10000 characters');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Log current configuration (safe for production - hides sensitive data)
 */
export function logConfig(): void {
  if (config.dev.debugMode) {
    console.log('=== Application Configuration ===');
    console.log('API URL:', config.api.url);
    console.log('API Key:', config.api.key ? '***configured***' : 'not set');
    console.log('API Timeout:', config.api.timeout + 'ms');
    console.log('Max Message Length:', config.api.maxMessageLength);
    console.log('Mock API:', config.dev.useMockApi ? 'ENABLED' : 'disabled');
    console.log('Debug Mode:', config.dev.debugMode ? 'ENABLED' : 'disabled');
    console.log('================================');
  }
}
