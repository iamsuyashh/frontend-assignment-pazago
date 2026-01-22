'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, UseChatReturn } from '@/types/chat';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId, exportToJSON, playNotificationSound, extractSuggestionsFromText } from '@/lib/utils';

const THREAD_ID = '231255'; // Replace with actual roll number

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastUserMessageRef = useRef<string>('');

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMessages(parsed.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } catch (e) {
          console.error('Failed to load messages:', e);
        }
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // Cleanup: abort ongoing requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Process SSE streaming response from Provue AI API
   * Extracts only text-delta events and builds the response
   * @param reader - ReadableStream reader for response body
   * @param messageId - ID of the message to update
   */
  const processStreamResponse = useCallback(async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    messageId: string
  ) => {
    const decoder = new TextDecoder();
    let accumulatedContent = '';
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream completed');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);
              
              // Process text-delta events
              if (data.type === 'text-delta' && data.payload?.text) {
                accumulatedContent += data.payload.text;
                
                setMessages(prev => prev.map(msg => 
                  msg.id === messageId
                    ? { ...msg, content: accumulatedContent, isStreaming: true }
                    : msg
                ));
              }
              
              console.log('SSE Event:', data.type);
              
            } catch (parseError) {
              if (line.includes('"type":"done"')) {
                console.log('Stream done event received');
              }
            }
          }
        }
      }

      // Extract suggestions from the accumulated content
      const suggestions = extractSuggestionsFromText(accumulatedContent);

      // Finalize the message with suggestions
      setMessages(prev => prev.map(msg => 
        msg.id === messageId
          ? { 
              ...msg, 
              isStreaming: false, 
              status: 'sent',
              suggestions: suggestions.length > 0 ? suggestions : undefined
            }
          : msg
      ));

      playNotificationSound();

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        console.error('Stream error:', error);
        throw error;
      }
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Input validation
    if (!content || !content.trim() || isLoading) return;

    const trimmedContent = content.trim();
    
    // Validate message length (max 2000 characters)
    if (trimmedContent.length > 2000) {
      setError('Message is too long. Please keep it under 2000 characters.');
      return;
    }

    lastUserMessageRef.current = trimmedContent;
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmedContent,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Update status to sent after a brief delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
      ));
    }, 100);

    // Create placeholder for assistant response
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      status: 'sending'
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Prepare API request
      const requestBody = {
        prompt: trimmedContent,
        stream: true
      };

      console.log('Sending request:', requestBody);

      // Set timeout for API request (60 seconds for streaming)
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 60000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Network error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      await processStreamResponse(reader, assistantMessageId);

    } catch (err) {
      // Determine error type for better user feedback
      let errorMessage = 'Failed to send message';
      let userFriendlyMessage = 'Sorry, I encountered an error. Please try again.';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timeout - please check your connection';
          userFriendlyMessage = '⏱️ The request took too long. Please check your internet connection and try again.';
        } else if (err.message.includes('Network error')) {
          errorMessage = err.message;
          userFriendlyMessage = '🌐 Network error occurred. Please check your internet connection and try again.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network connection failed';
          userFriendlyMessage = '❌ Unable to reach the server. Please check your internet connection.';
        } else {
          errorMessage = err.message;
          userFriendlyMessage = `❌ ${err.message}`;
        }
      }

      setError(errorMessage);
      
      // Update assistant message with user-friendly error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId
          ? { 
              ...msg, 
              content: userFriendlyMessage, 
              isStreaming: false,
              status: 'error'
            }
          : msg
      ));
      
      console.error('Send message error:', err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, processStreamResponse]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    }
  }, []);

  const exportChat = useCallback(() => {
    const exportData = {
      threadId: THREAD_ID,
      exportedAt: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };
    
    const filename = `weather-chat-${new Date().toISOString().split('T')[0]}.json`;
    exportToJSON(exportData, filename);
  }, [messages]);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current) {
      // Remove last assistant message if it was an error
      setMessages(prev => {
        const filtered = [...prev];
        if (filtered[filtered.length - 1]?.role === 'assistant') {
          filtered.pop();
        }
        if (filtered[filtered.length - 1]?.role === 'user') {
          filtered.pop();
        }
        return filtered;
      });
      
      await sendMessage(lastUserMessageRef.current);
    }
  }, [sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    exportChat,
    retryLastMessage
  };
}
