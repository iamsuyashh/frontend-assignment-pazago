import { NextRequest } from 'next/server';

interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  rain: number;
}

interface Message {
  role: string;
  content: string;
}

// Weather data for different cities
const weatherData: Record<string, WeatherInfo> = {
  london: { temp: 15, condition: 'cloudy', humidity: 75, wind: 20, rain: 60 },
  paris: { temp: 18, condition: 'sunny', humidity: 65, wind: 10, rain: 10 },
  mumbai: { temp: 32, condition: 'humid', humidity: 85, wind: 15, rain: 40 },
  'new york': { temp: 22, condition: 'clear', humidity: 60, wind: 15, rain: 5 },
  tokyo: { temp: 20, condition: 'partly cloudy', humidity: 60, wind: 12, rain: 20 },
  sydney: { temp: 26, condition: 'sunny', humidity: 55, wind: 18, rain: 0 },
  dubai: { temp: 38, condition: 'hot and sunny', humidity: 35, wind: 22, rain: 0 },
  berlin: { temp: 12, condition: 'overcast', humidity: 70, wind: 18, rain: 45 },
  singapore: { temp: 30, condition: 'humid', humidity: 80, wind: 10, rain: 60 },
  toronto: { temp: 10, condition: 'cold', humidity: 65, wind: 20, rain: 30 },
};

/**
 * Generate contextual weather response based on user query
 * Analyzes the question type and provides relevant weather information
 * @param city - The city name to get weather for
 * @param userMessage - The user's original message
 * @param conversationHistory - Previous messages in the conversation
 * @returns AI-like conversational response with weather data
 */
function generateWeatherResponse(city: string, userMessage: string, conversationHistory: Message[]): string {
  const data = weatherData[city.toLowerCase()];
  
  if (!data) {
    // Check if asking about general weather
    if (userMessage.toLowerCase().includes('weather') || userMessage.toLowerCase().includes('forecast')) {
      return "I'm your weather assistant! I can help you check the weather for cities like London, Paris, Mumbai, New York, Tokyo, Sydney, Dubai, Berlin, Singapore, and Toronto. Which city would you like to know about?";
    }
    
    // Conversational fallback
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(g => userMessage.toLowerCase().includes(g))) {
      return "Hello! 👋 I'm your weather assistant. I can provide you with current weather conditions and forecasts for cities around the world. Just ask me about any city you'd like to know about!";
    }
    
    return `I'd be happy to help you with weather information! However, I don't have current data for that location. I can provide detailed weather for cities like London, Paris, Mumbai, New York, Tokyo, Sydney, Dubai, and more. Which city interests you?`;
  }
  
  // Build contextual response
  const tempF = Math.round((data.temp * 9/5) + 32);
  const cityName = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Analyze the question type
  const isTemperatureQuery = userMessage.toLowerCase().includes('temperature') || userMessage.toLowerCase().includes('hot') || userMessage.toLowerCase().includes('cold');
  const isRainQuery = userMessage.toLowerCase().includes('rain') || userMessage.toLowerCase().includes('umbrella');
  const isForecastQuery = userMessage.toLowerCase().includes('tomorrow') || userMessage.toLowerCase().includes('forecast') || userMessage.toLowerCase().includes('week');
  
  let response = '';
  
  // Temperature-focused response
  if (isTemperatureQuery) {
    response = `In ${cityName}, the current temperature is ${data.temp}°C (${tempF}°F). `;
    if (data.temp > 30) {
      response += `It's quite hot 🌡️! I'd recommend staying hydrated and using sun protection. `;
    } else if (data.temp < 10) {
      response += `It's quite chilly ❄️! Make sure to dress warmly. `;
    } else {
      response += `The temperature is quite comfortable. `;
    }
  }
  
  // Rain-focused response
  else if (isRainQuery) {
    response = `Looking at ${cityName}, `;
    if (data.rain > 50) {
      response += `there's a high chance of rain today (${data.rain}% probability) ☔. Definitely bring an umbrella! `;
    } else if (data.rain > 20) {
      response += `there's a ${data.rain}% chance of rain. You might want to carry an umbrella just in case. `;
    } else {
      response += `rain is unlikely today with only a ${data.rain}% chance. You should be fine without an umbrella! `;
    }
  }
  
  // Forecast-focused response
  else if (isForecastQuery) {
    response = `For ${cityName}, `;
    const tomorrowTemp = data.temp + Math.floor(Math.random() * 3) - 1;
    response += `today is ${data.condition} at ${data.temp}°C. Tomorrow, expect similar conditions with temperatures around ${tomorrowTemp}°C. `;
    
    if (data.rain > 30) {
      response += `Keep an eye out for possible rain showers. `;
    }
  }
  
  // General weather query
  else {
    response = `Here's the current weather in ${cityName}: It's ${data.condition} with a temperature of ${data.temp}°C (${tempF}°F). `;
    
    response += `Humidity is at ${data.humidity}%, and wind speed is ${data.wind} km/h. `;
    
    if (data.rain > 50) {
      response += `⚠️ High chance of rain (${data.rain}%), so don't forget your umbrella! `;
    } else if (data.rain > 20) {
      response += `There's a ${data.rain}% chance of rain, so you might want to keep an umbrella handy. `;
    }
    
    // Add helpful tips
    if (data.temp > 30) {
      response += `\n\n💡 Tip: It's quite hot, so stay hydrated and avoid prolonged sun exposure.`;
    } else if (data.temp < 10) {
      response += `\n\n💡 Tip: It's cold out there! Layer up and stay warm.`;
    } else if (data.condition === 'sunny' || data.condition === 'clear') {
      response += `\n\n💡 Tip: Perfect day to spend time outdoors!`;
    }
  }
  
  // Add conversational follow-up
  if (conversationHistory.length > 2) {
    response += `\n\nIs there anything else about ${cityName}'s weather you'd like to know, or should I check another city for you?`;
  }
  
  return response.trim();
}

/**
 * Extract city name from user message
 * Searches for known city names in the message text
 * @param message - User's message text
 * @returns City name if found, null otherwise
 */
function extractCity(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const city of Object.keys(weatherData)) {
    if (lowerMessage.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  return null;
}

/**
 * Create a streaming response that simulates typing effect
 * Sends response word-by-word to provide real-time feedback to users
 * @param text - The complete response text to stream
 * @returns ReadableStream in Server-Sent Events (SSE) format
 */
async function createStreamingResponse(text: string): Promise<ReadableStream> {
  const words = text.split(' ');
  
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const isLast = i === words.length - 1;
        
        // Send word with space (except last word)
        const chunk = isLast ? word : word + ' ';
        const data = JSON.stringify({ type: 'text', content: chunk });
        controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
        
        // Simulate typing delay (faster for better UX)
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Send completion signal
      controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
      controller.close();
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    console.log('Received request:', body);
    
    // Extract conversation history
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

    // Validate messages array format
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Detect city and generate contextual response
    const city = extractCity(userMessage);
    let responseText: string;
    
    if (city) {
      responseText = generateWeatherResponse(city, userMessage, messages);
      console.log('Detected city:', city);
    } else {
      responseText = generateWeatherResponse('', userMessage, messages);
      console.log('No city detected, general response');
    }
    
    console.log('User message:', userMessage);
    console.log('Response:', responseText);
    
    // Create streaming response
    const stream = await createStreamingResponse(responseText);
    
    return new Response(stream, {
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
