'use client';

import React, { useState } from 'react';

interface ChatHeaderProps {
  onClear: () => void;
  onExport: () => void;
  onToggleSearch: () => void;
  messageCount: number;
}

export function ChatHeader({ onClear, onExport, onToggleSearch, messageCount }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleClear = () => {
    if (messageCount > 0 && confirm('Are you sure you want to clear all messages?')) {
      onClear();
      setShowMenu(false);
    }
  };

  const handleExport = () => {
    onExport();
    setShowMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-900">
            {messageCount > 0 ? `${messageCount} messages` : 'No messages yet'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={onToggleSearch}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Toggle search"
            title="Search messages"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              aria-label="Menu"
              aria-expanded={showMenu}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={handleExport}
                    disabled={messageCount === 0}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export Chat
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={messageCount === 0}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Clear Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
