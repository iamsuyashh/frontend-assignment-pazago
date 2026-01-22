export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  isStreaming?: boolean;
  suggestions?: string[]; // Add suggestions field
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface APIRequest {
  messages: ChatMessage[];
  runId: string;
  maxRetries: number;
  maxSteps: number;
  temperature: number;
  topP: number;
  runtimeContext: Record<string, unknown>;
  threadId: string;
  resourceId: string;
}

export interface StreamChunk {
  type?: string;
  content?: string;
  data?: string;
  delta?: string;
  done?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  streamingMessageId: string | null;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  exportChat: () => void;
  retryLastMessage: () => Promise<void>;
}
