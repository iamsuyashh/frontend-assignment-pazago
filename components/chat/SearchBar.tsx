'use client';

import React, { useEffect, useRef, memo } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

/**
 * SearchBar component for filtering chat messages
 * Memoized to prevent unnecessary re-renders
 */
export const SearchBar = memo(function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_SEARCH_LENGTH = 100; // Reasonable limit for search queries

  // Auto-focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sanitize and validate search input
  const handleSearchChange = (newValue: string) => {
    // Limit search length
    if (newValue.length <= MAX_SEARCH_LENGTH) {
      onChange(newValue);
    }
  };

  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search messages..."
              maxLength={MAX_SEARCH_LENGTH}
              className="w-full px-4 py-2 pr-10 bg-white border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search messages"
            />
            {value && (
              <button
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {value && (
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {resultCount} of {totalCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
