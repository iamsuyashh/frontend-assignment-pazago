'use client';
import  { MoveUpRight } from 'lucide-react'
import React, { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Ask about the weather...', value: externalValue, onChange: externalOnChange }: ChatInputProps) {
  const [internalInput, setInternalInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isControlled = externalValue !== undefined;
  const input = isControlled ? externalValue : internalInput;
  const setInput = isControlled ? (externalOnChange || (() => {})) : setInternalInput;

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      if (!isControlled) {
        setInput('');
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-3 sm:p-4 animate-slideUp">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2 bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-100 dark:focus-within:shadow-blue-900/20 transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent px-4 sm:px-6 py-4 sm:py-15 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base leading-relaxed transition-all overflow-hidden"
            aria-label="Message input"
            aria-disabled={disabled}
            style={{ maxHeight: '200px', minHeight: '56px' }}
          />
          
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="m-2 p-2.5 sm:p-3 rounded-xl bg-black dark:bg-white text-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Send message"
            title={disabled ? 'Waiting for response...' : 'Send message (Enter)'}
          >
            {disabled ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <MoveUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 px-2 text-xs sm:text-xs text-gray-400 dark:text-gray-500 text-center">
          <span className="hidden sm:inline">Press Enter to send • Shift + Enter for new line</span>
          <span className="sm:hidden">Tap send or press Enter</span>
        </div>
      </div>
    </div>
  );
}
