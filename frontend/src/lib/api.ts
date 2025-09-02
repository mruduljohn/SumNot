import axios from 'axios'
import { API_ENDPOINTS } from './constants'

/**
 * API client configuration
 * Handles all HTTP requests to the backend
 */

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor for logging
 */
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * YouTube transcript API
 */
export const transcriptApi = {
  /**
   * Fetch transcript from YouTube video
   * @param url - YouTube video URL
   * @returns Promise with transcript data
   */
  fetch: async (url: string) => {
    const response = await api.post(API_ENDPOINTS.TRANSCRIPT, { url })
    return response.data
  }
}

/**
 * AI summarization API
 */
export const summarizeApi = {
  /**
   * Generate AI summary from transcript
   * @param data - Summarization request data
   * @returns Promise with summary data
   */
  generate: async (data: {
    transcript: string
    title: string
    apiKey: string
    provider: string
  }) => {
    const response = await api.post(API_ENDPOINTS.SUMMARIZE, data)
    return response.data
  }
}

/**
 * Notion integration API
 */
export const notionApi = {
  /**
   * Initiate Notion OAuth flow
   * @param data - OAuth configuration
   * @returns Promise with auth URL
   */
  auth: async (data: {
    clientId: string
    redirectUri: string
  }) => {
    const response = await api.post(API_ENDPOINTS.NOTION_AUTH, data)
    return response.data
  },

  /**
   * Save summary to Notion
   * @param data - Summary data to save
   * @returns Promise with save result
   */
  save: async (data: {
    title: string
    summary: string
    tags: string[]
    videoUrl: string
    botId?: string
  }) => {
    const response = await api.post(API_ENDPOINTS.NOTION_SAVE, data)
    return response.data
  },

  /**
   * Get user's Notion databases
   * @returns Promise with databases list
   */
  getDatabases: async () => {
    const response = await api.get(API_ENDPOINTS.NOTION_DATABASES)
    return response.data
  }
}

/**
 * Utility function to validate YouTube URL
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)/,
  ]
  
  return patterns.some(pattern => pattern.test(url))
}

/**
 * Extract video ID from YouTube URL
 * @param url - YouTube URL
 * @returns video ID or null
 */
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Format error message for display
 * @param error - Error object
 * @returns User-friendly error message
 */
export const formatErrorMessage = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export default api
