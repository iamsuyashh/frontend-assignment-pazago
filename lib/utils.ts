/**
 * Combines class names into a single string, filtering out falsy values
 * Useful for conditional className composition
 * @param inputs - Array of class names or conditional values
 * @returns Combined class name string
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format timestamp to human-readable relative time
 * Shows "Just now", "5m ago", "2h ago", or full date for older messages
 * @param date - The date to format
 * @returns Formatted timestamp string
 */
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate a unique ID for messages using timestamp and random string
 * @returns Unique identifier string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export data as a JSON file download
 * Creates a blob and triggers browser download
 * @param data - The data object to export
 * @param filename - Name for the downloaded file
 */
export function exportToJSON(data: unknown, filename: string): void {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Play a subtle notification sound using Web Audio API
 * Used to alert user when assistant response is complete
 */
export function playNotificationSound(): void {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}

/**
 * Extract suggestions from AI response text
 * Looks for phrases like "Let me know if..." or questions at the end
 * @param text - The AI response text
 * @returns Array of suggestion strings
 */
export function extractSuggestionsFromText(text: string): string[] {
  const suggestions: string[] = [];
  
  // Pattern 1: "Let me know if you'd like X, Y, or Z"
  const letMeKnowPattern = /Let me know if (?:you'd like|you want|you need)\s+([^.!?]+)/gi;
  const letMeKnowMatches = text.match(letMeKnowPattern);
  
  if (letMeKnowMatches) {
    letMeKnowMatches.forEach(match => {
      // Extract the suggestions part after "Let me know if you'd like"
      const suggestionsText = match.replace(/Let me know if (?:you'd like|you want|you need)\s+/i, '');
      
      // Split by common delimiters (comma, "or", "and")
      const items = suggestionsText
        .split(/,|\s+or\s+|\s+and\s+/i)
        .map(item => item.trim())
        .filter(item => item.length > 0 && item.length < 100); // Reasonable length
      
      // Convert to questions
      items.forEach(item => {
        // Remove trailing punctuation
        const cleanItem = item.replace(/[!?.]$/, '').trim();
        if (cleanItem) {
          // Capitalize first letter
          const suggestion = cleanItem.charAt(0).toUpperCase() + cleanItem.slice(1);
          suggestions.push(`Can you provide ${suggestion}?`);
        }
      });
    });
  }
  
  // Pattern 2: Questions at the end (e.g., "Would you like to know more?")
  const questionPattern = /([A-Z][^.!?]*\?)/g;
  const questions = text.match(questionPattern);
  
  if (questions) {
    questions.slice(-3).forEach(question => { // Take last 3 questions
      const trimmed = question.trim();
      if (trimmed.length > 10 && trimmed.length < 100) {
        suggestions.push(trimmed);
      }
    });
  }
  
  // Limit to 3 suggestions
  return [...new Set(suggestions)].slice(0, 3);
}
