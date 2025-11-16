import type { ChatMessage, ApiResponse, ThemeConfig } from '@ai-learning/shared-types'

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str
}

// Date utilities
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString()
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString()
}

// Storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }
}

// Chat utilities
export const createMessage = (
  content: string,
  role: ChatMessage['role'] = 'user'
): ChatMessage => {
  return {
    id: generateId(),
    role,
    content,
    timestamp: Date.now()
  }
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// API utilities
export const createApiError = (message: string): ApiResponse => {
  return {
    success: false,
    error: message
  }
}

export const createApiSuccess = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message
  }
}

// Theme utilities
export const applyTheme = (config: ThemeConfig): void => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', config.primaryColor)
  root.style.setProperty('--background-color', config.backgroundColor)
  root.style.setProperty('--text-color', config.textColor)

  if (config.mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Validation utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}