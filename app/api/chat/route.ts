import { NextRequest } from 'next/server';

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
    console.log('Received request:', body);
    
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

    // Validate message length
    if (userMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long. Maximum 2000 characters allowed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Forwarding to Provue AI API:', userMessage);

    // Forward request to Provue AI weather agent API
    const apiResponse = await fetch('https://api-dev.provue.ai/api/webapp/agent/test-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userMessage,
        stream: true
      })
    });

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
  } catch (error) {
    // Comprehensive error logging
    console.error('API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
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
