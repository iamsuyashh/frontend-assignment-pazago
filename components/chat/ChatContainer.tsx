'use client';

import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useChat } from '@/hooks/useChat';
import { SearchBar } from './SearchBar';

export function ChatContainer() {
  const { messages, isLoading, error, sendMessage, clearChat, exportChat, retryLastMessage } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery
    ? messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Handle search navigation
  const handleSearchNavigate = () => {
    if (filteredMessages.length > 0) {
      setCurrentSearchIndex((prev) => (prev + 1) % filteredMessages.length);
    }
  };

  // Reset search index when query changes
  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentSearchIndex(0);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      <ChatHeader
        onClear={clearChat}
        onExport={exportChat}
        onToggleSearch={() => setShowSearch(!showSearch)}
        messageCount={messages.length}
      />

      {showSearch && (
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          resultCount={filteredMessages.length}
          totalCount={messages.length}
          onNavigate={handleSearchNavigate}
          currentIndex={currentSearchIndex}
        />
      )}

      {error && (
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl shadow-lg animate-slideUp">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-red-800 dark:text-red-300 break-words">
                Error: {error}
              </p>
              <button
                onClick={async () => {
                  setIsRetrying(true);
                  try {
                    await retryLastMessage();
                  } finally {
                    setIsRetrying(false);
                  }
                }}
                disabled={isRetrying || isLoading}
                className="mt-2 text-xs sm:text-sm text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-semibold underline underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isRetrying ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Retrying...
                  </>
                ) : (
                  <>🔄 Retry last message</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <MessageList 
        messages={filteredMessages} 
        isLoading={isLoading} 
        onPromptClick={handlePromptClick}
        searchQuery={searchQuery}
        currentSearchIndex={currentSearchIndex}
      />

      <ChatInput 
        onSend={(msg) => {
          sendMessage(msg);
          setInputValue('');
        }} 
        disabled={isLoading}
        value={inputValue}
        onChange={setInputValue}
      />
    </div>
  );
}
