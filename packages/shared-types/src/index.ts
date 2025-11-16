// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Chat Message Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  isTyping?: boolean
}

export interface ChatHistory {
  messages: ChatMessage[]
  sessionId: string
  createdAt: number
  updatedAt: number
}

// API Configuration Types
export interface ApiConfig {
  baseUrl: string
  apiKey: string
  model?: string
  maxTokens?: number
  temperature?: number
}

// Theme Types
export type Theme = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  mode: Theme
  primaryColor: string
  backgroundColor: string
  textColor: string
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  value?: string
  disabled?: boolean
  required?: boolean
  onChange?: (value: string) => void
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>