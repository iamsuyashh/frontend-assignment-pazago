import { NextRequest } from 'next/server';
import { config, validateConfig, logConfig } from '@/lib/config';

// Validate configuration on module load
validateConfig();
logConfig();

/**
 * POST handler for weather chat API
 * Proxies requests to the Provue AI weather agent API with streaming support
 * @param request - NextRequest containing the chat message/prompt
 * @returns Streaming response from the Provue AI API
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    if (config.dev.debugMode) {
      console.log('Received request:', body);
    }
    
    // Extract prompt from messages array or direct prompt field
    const messages = body.messages || [];
    const userMessage = messages[messages.length - 1]?.content || body.prompt || '';
    
    // Validate required fields
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate message length using config
    if (userMessage.length > config.api.maxMessageLength) {
      return new Response(
        JSON.stringify({ 
          error: `Message too long. Maximum ${config.api.maxMessageLength} characters allowed.` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (config.dev.debugMode) {
      console.log('Forwarding to Provue AI API:', userMessage);
    }

    // Check if mock mode is enabled
    if (config.dev.useMockApi) {
      console.log('Using mock API mode');
      return createMockStreamResponse(userMessage);
    }

    // Forward request to Provue AI weather agent API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.api.timeout);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      };

      // Add API key if configured
      if (config.api.key) {
        headers['Authorization'] = `Bearer ${config.api.key}`;
      }

      const apiResponse = await fetch(config.api.url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: userMessage,
          stream: true
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      clearTimeout(timeout);

      if (!apiResponse.ok) {
        console.error('API Error:', apiResponse.status, apiResponse.statusText);
        const errorText = await apiResponse.text();
        console.error('Error details:', errorText);
        
        return new Response(
          JSON.stringify({ 
            error: `Weather API error: ${apiResponse.status} ${apiResponse.statusText}`,
            timestamp: new Date().toISOString()
          }),
          { 
            status: apiResponse.status, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }

      // Stream the response directly to the client
      return new Response(apiResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      
      // Handle fetch-specific errors
      console.error('Fetch Error:', {
        message: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        name: fetchError instanceof Error ? fetchError.name : undefined,
      });

      // Determine error type
      let errorMessage = 'Failed to connect to weather API';
      let statusCode = 503;

      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          errorMessage = `Request timeout after ${config.api.timeout}ms - please try again`;
          statusCode = 504;
        } else if (fetchError.message.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to weather API - service may be down';
        } else if (fetchError.message.includes('ENOTFOUND') || fetchError.message.includes('getaddrinfo')) {
          errorMessage = 'Weather API endpoint not found - check network connection';
        } else if (fetchError.message.includes('certificate')) {
          errorMessage = 'SSL certificate error - check API configuration';
        } else {
          errorMessage = `Network error: ${fetchError.message}`;
        }
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: config.dev.debugMode && fetchError instanceof Error ? fetchError.message : undefined,
          timestamp: new Date().toISOString()
        }),
        { 
          status: statusCode, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    // Comprehensive error logging
    console.error('API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: config.dev.debugMode && error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    const isClientError = errorMessage.includes('Invalid') || errorMessage.includes('required');
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        status: isClientError ? 400 : 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

/**
 * Create a mock streaming response for development/testing
 * @param prompt - User's question
 * @returns Mock SSE stream
 */
function createMockStreamResponse(prompt: string): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Mock response based on the prompt
      let mockResponse = `This is a mock response for: "${prompt}". `;
      
      if (prompt.toLowerCase().includes('weather')) {
        mockResponse += 'The weather service is currently in mock mode. ';
        mockResponse += 'To use the real API, set USE_MOCK_API=false in your .env.local file.';
      } else {
        mockResponse += 'This is a test response. Configure your environment variables to connect to the real API.';
      }
      
      // Simulate streaming by sending chunks
      const words = mockResponse.split(' ');
      
      // Send start event
      controller.enqueue(encoder.encode('data: {"type":"start","payload":{}}\n\n'));
      
      // Send text in chunks with delays
      for (const word of words) {
        const chunk = word + ' ';
        controller.enqueue(encoder.encode(`data: {"type":"text-delta","payload":{"text":"${chunk}"}}\n\n`));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Send done event
      controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
