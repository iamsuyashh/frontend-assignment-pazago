'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@/types/chat';
import { formatTimestamp, parseLinksInText } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  onPromptClick?: (prompt: string) => void;
}

/**
 * MessageBubble component displays individual chat messages
 * Memoized to prevent unnecessary re-renders when parent updates
 */
export const MessageBubble = memo(function MessageBubble({ message, onPromptClick }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isAssistant = message.role === 'assistant';

  // Default suggestions for errors only
  const defaultSuggestions = [
    "What's the weather in London?",
    "How's the weather in New York?",
    "Tell me about weather in Tokyo?",
  ];

  return (
    <>
      <div className={`flex w-full mb-3 sm:mb-4 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 transition-all ${
            isUser
              ? 'bg-[#F5F5F5] text-black rounded-br-md'
              : isError
              ? 'bg-red-50 border border-red-200 text-red-900 rounded-bl-md'
              : 'text-gray-900 rounded-bl-md'
          }`}
        >
          <div className="flex flex-col gap-1.5 sm:gap-2">

            {/* Message content with Markdown rendering */}
            <div className="text-[13px] sm:text-[15px] break-words leading-relaxed tracking-wide prose prose-sm max-w-none">
              {isAssistant ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {children}
                      </a>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content || (message.isStreaming ? '...' : '')}
                </ReactMarkdown>
              ) : (
                <span className="whitespace-pre-wrap">
                  {parseLinksInText(message.content || '')}
                </span>
              )}
              {message.isStreaming && (
                <span className="inline-block ml-1 w-0.5 h-4 bg-current animate-pulse" />
              )}
            </div>

            {/* Timestamp and status */}
            <div
              className={`flex items-center gap-2 text-[10px] sm:text-xs mt-0.5 ${
                isUser ? 'text-gray-600' : 'text-gray-500'
              }`}
            >
              <span className="font-medium">{formatTimestamp(message.timestamp)}</span>
              
              {message.status === 'sending' && (
                <span className="flex items-center gap-1 animate-fadeIn">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sending</span>
                </span>
              )}
              
              {message.status === 'sent' && isUser && (
                <svg className="w-3.5 h-3.5 animate-scaleIn" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {message.status === 'error' && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden sm:inline text-red-600">Failed</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic suggestions after assistant completes response */}
      {isAssistant && !message.isStreaming && message.status === 'sent' && message.suggestions && message.suggestions.length > 0 && onPromptClick && (
        <div className="flex justify-end mb-3 sm:mb-4 animate-fadeIn">
          <div className="max-w-full sm:max-w-full md:max-w-full flex flex-col gap-2">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(suggestion)}
                className="px-10 py-5 bg-[#F5F5F5] text-gray-700 text-xs sm:text-sm rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Default suggestions for errors */}
      {isError && onPromptClick && (
        <div className="flex justify-start mb-3 sm:mb-4 animate-fadeIn">
          <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[70%] flex flex-col gap-2">
            <p className="text-xs text-gray-600 mb-1 px-2">Try asking about these cities:</p>
            {defaultSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onPromptClick(suggestion)}
                className="px-4 py-3 bg-white text-gray-700 text-xs sm:text-sm rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
});