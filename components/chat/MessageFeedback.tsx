'use client';

import React, { useState } from 'react';

interface MessageFeedbackProps {
  messageId: string;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

export function MessageFeedback({ messageId, onFeedback }: MessageFeedbackProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleFeedback = (feedback: 'positive' | 'negative') => {
    setSelectedFeedback(feedback);
    onFeedback(messageId, feedback);
    setShowThanks(true);
    
    // Hide thank you message after 2 seconds
    setTimeout(() => setShowThanks(false), 2000);
  };

  if (showThanks) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 animate-fadeIn">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rate this response">
      <button
        onClick={() => handleFeedback('positive')}
        disabled={selectedFeedback !== null}
        className={`p-1.5 rounded-md transition-colors ${ 
          selectedFeedback === 'positive' 
            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
            : 'text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
        } disabled:opacity-50`}
        aria-label="Good response"
        title="Good response"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      </button>
      
      <button
        onClick={() => handleFeedback('negative')}
        disabled={selectedFeedback !== null}
        className={`p-1.5 rounded-md transition-colors ${ 
          selectedFeedback === 'negative' 
            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
            : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
        } disabled:opacity-50`}
        aria-label="Bad response"
        title="Bad response"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      </button>
    </div>
  );
}
