'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onPromptClick?: (prompt: string) => void;
  searchQuery?: string;
  currentSearchIndex?: number;
}

export function MessageList({ messages, isLoading, onPromptClick, searchQuery = '', currentSearchIndex = 0 }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Scroll to current search result
  useEffect(() => {
    if (searchQuery && messageRefs.current[currentSearchIndex]) {
      messageRefs.current[currentSearchIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentSearchIndex, searchQuery]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // Show button if user scrolled up more than 100px from bottom
      setShowScrollButton(distanceFromBottom > 100);
      setIsUserScrolling(distanceFromBottom > 100);
    }
  };

  // Auto-scroll to bottom when new messages arrive or during streaming
  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading, isUserScrolling]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    setIsUserScrolling(false);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const promptSuggestions = [
    "What's the weather in London?",
    "Will it rain tomorrow in Paris?",
    "How hot is Dubai today?",
  ];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-white dark:bg-gray-950">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Weather Chat Agent
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ask me about weather conditions in any city
            </p>
          </div>
          
          <div className="space-y-2">
            {promptSuggestions.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptClick?.(prompt)}
                className="w-full text-left px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 scroll-smooth bg-white dark:bg-gray-950 relative"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <div key={message.id} ref={(el) => { messageRefs.current[index] = el; }}>
            <MessageBubble message={message} onPromptClick={onPromptClick} searchQuery={searchQuery} />
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start mb-4 animate-fadeIn">
            <div className="rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-4 sm:right-8 p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 animate-fadeIn z-10"
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}
