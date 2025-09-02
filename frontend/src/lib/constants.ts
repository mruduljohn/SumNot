/**
 * Application constants and configuration
 */

export const AI_PROVIDERS = [
  {
    value: 'openai',
    label: 'OpenAI (GPT-4)',
    description: 'Most advanced model with excellent summarization quality'
  },
  {
    value: 'anthropic',
    label: 'Anthropic (Claude)',
    description: 'Fast and efficient with good reasoning capabilities'
  },
  {
    value: 'openrouter',
    label: 'OpenRouter',
    description: 'Access to multiple AI models from different providers'
  }
] as const

export const DEFAULT_TAGS = [
  'Education',
  'Technology',
  'Business',
  'Health',
  'Science',
  'Politics',
  'Entertainment',
  'Sports',
  'News',
  'Tutorial',
  'Review',
  'Analysis',
  'General'
] as const

export const API_ENDPOINTS = {
  TRANSCRIPT: '/api/transcript',
  SUMMARIZE: '/api/summarize',
  NOTION_AUTH: '/api/notion/auth',
  NOTION_SAVE: '/api/notion/save',
  NOTION_DATABASES: '/api/notion/databases'
} as const

export const NOTION_DATABASE_SCHEMA = {
  TITLE: 'title',
  VIDEO_URL: 'Video URL',
  DATE: 'Date',
  TAGS: 'Tags',
  SUMMARY: 'Summary'
} as const

export const SUPPORTED_VIDEO_FORMATS = [
  'youtube.com/watch?v=',
  'youtu.be/',
  'youtube.com/embed/',
  'youtube.com/v/'
] as const

export const MAX_TRANSCRIPT_LENGTH = 100000 // characters
export const MIN_TRANSCRIPT_LENGTH = 100 // characters
export const MAX_SUMMARY_LENGTH = 2000 // words
export const MIN_SUMMARY_LENGTH = 50 // words
