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

export const OPENROUTER_MODELS = [
  {
    value: 'openai/gpt-4o',
    label: 'GPT-4o',
    description: 'Latest OpenAI model with enhanced capabilities'
  },
  {
    value: 'openai/gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Faster and cheaper GPT-4o variant'
  },
  {
    value: 'anthropic/claude-3.5-sonnet',
    label: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most capable model'
  },
  {
    value: 'anthropic/claude-3-haiku',
    label: 'Claude 3 Haiku',
    description: 'Fast and efficient Claude model'
  },
  {
    value: 'google/gemini-pro-1.5',
    label: 'Gemini Pro 1.5',
    description: 'Google\'s advanced multimodal model'
  },
  {
    value: 'meta-llama/llama-3.1-70b-instruct',
    label: 'Llama 3.1 70B',
    description: 'Meta\'s open-source large model'
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
