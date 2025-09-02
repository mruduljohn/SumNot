import express from 'express'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'

const router = express.Router()

/**
 * AI summarization endpoint
 * Generates structured summaries using multiple AI providers
 * 
 * @route POST /api/summarize
 * @param {string} transcript - Video transcript text
 * @param {string} title - Video title
 * @param {string} apiKey - User's AI API key
 * @param {string} provider - AI provider (openai, anthropic, openrouter)
 * @returns {Object} - Structured summary with title, summary, and tags
 */
router.post('/', async (req, res) => {
  try {
    const { transcript, title, apiKey, provider, model } = req.body

    // Validate required fields
    if (!transcript || !apiKey || !provider) {
      return res.status(400).json({
        error: 'Missing required fields: transcript, apiKey, and provider are required',
        code: 'MISSING_FIELDS'
      })
    }

    // Validate transcript length
    if (transcript.length < 100) {
      return res.status(400).json({
        error: 'Transcript too short for summarization',
        code: 'TRANSCRIPT_TOO_SHORT'
      })
    }

    console.log(`🤖 Generating summary using ${provider} (${transcript.length} chars)`)

    let summaryResult
    switch (provider.toLowerCase()) {
      case 'openai':
        summaryResult = await summarizeWithOpenAI(transcript, title, apiKey)
        break
      case 'anthropic':
        summaryResult = await summarizeWithAnthropic(transcript, title, apiKey)
        break
      case 'openrouter':
        summaryResult = await summarizeWithOpenRouter(transcript, title, apiKey, model)
        break
      default:
        return res.status(400).json({
          error: 'Unsupported AI provider',
          code: 'UNSUPPORTED_PROVIDER',
          supported: ['openai', 'anthropic', 'openrouter']
        })
    }

    console.log(`✅ Summary generated successfully`)

    res.json({
      title: summaryResult.title || title,
      summary: summaryResult.summary,
      tags: summaryResult.tags || [],
      provider: provider,
      wordCount: summaryResult.summary.split(' ').length
    })

  } catch (error) {
    console.error('❌ Error generating summary:', error)
    
    // Handle specific error types
    if (error.message.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      })
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      return res.status(429).json({
        error: 'API rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED'
      })
    }

    res.status(500).json({
      error: 'Failed to generate summary',
      code: 'SUMMARIZATION_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * Generate summary using OpenAI GPT models
 * 
 * @param {string} transcript - Video transcript
 * @param {string} title - Video title
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} - Summary result
 */
async function summarizeWithOpenAI(transcript, title, apiKey) {
  const openai = new OpenAI({
    apiKey: apiKey,
  })

  const prompt = createSummaryPrompt(transcript, title)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert content summarizer specializing in creating concise, well-structured summaries for educational and informational videos.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  })

  const content = response.choices[0].message.content
  return parseSummaryResponse(content)
}

/**
 * Generate summary using Anthropic Claude models
 * 
 * @param {string} transcript - Video transcript
 * @param {string} title - Video title
 * @param {string} apiKey - Anthropic API key
 * @returns {Object} - Summary result
 */
async function summarizeWithAnthropic(transcript, title, apiKey) {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  })

  const prompt = createSummaryPrompt(transcript, title)

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  })

  const content = response.content[0].text
  return parseSummaryResponse(content)
}

/**
 * Generate summary using OpenRouter (multi-model support)
 * 
 * @param {string} transcript - Video transcript
 * @param {string} title - Video title
 * @param {string} apiKey - OpenRouter API key
 * @returns {Object} - Summary result
 */
async function summarizeWithOpenRouter(transcript, title, apiKey, model = 'openai/gpt-4o-mini') {
  const prompt = createSummaryPrompt(transcript, title)

  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert content summarizer specializing in creating concise, well-structured summaries for educational and informational videos.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'YouTube to Notion Summarizer'
    }
  })

  const content = response.data.choices[0].message.content
  return parseSummaryResponse(content)
}

/**
 * Create standardized prompt for AI summarization
 * 
 * @param {string} transcript - Video transcript
 * @param {string} title - Video title
 * @returns {string} - Formatted prompt
 */
function createSummaryPrompt(transcript, title) {
  return `Please analyze the following YouTube video transcript and create a comprehensive summary.

Video Title: ${title}

Transcript:
${transcript}

Please provide your response in the following JSON format:
{
  "title": "A concise, descriptive title for the summary",
  "summary": "A well-structured summary with bullet points covering the main topics, key insights, and important details. Use clear, concise language and organize information logically.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Guidelines:
- Keep the summary between 200-500 words
- Use bullet points for better readability
- Focus on the most important and actionable information
- Include key statistics, dates, or specific details when relevant
- Choose 3-5 relevant tags from categories like: Education, Technology, Business, Health, Science, Politics, Entertainment, Sports, News, Tutorial, Review, Analysis, etc.
- Make the summary suitable for someone who wants to quickly understand the video's content

Respond only with valid JSON, no additional text.`
}

/**
 * Parse AI response and extract structured data
 * 
 * @param {string} content - Raw AI response
 * @returns {Object} - Parsed summary data
 */
function parseSummaryResponse(content) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || 'Video Summary',
        summary: parsed.summary || content,
        tags: Array.isArray(parsed.tags) ? parsed.tags : []
      }
    }
    
    // Fallback: treat entire response as summary
    return {
      title: 'Video Summary',
      summary: content,
      tags: ['General']
    }
  } catch (error) {
    console.warn('Failed to parse AI response as JSON:', error.message)
    
    // Fallback: treat entire response as summary
    return {
      title: 'Video Summary',
      summary: content,
      tags: ['General']
    }
  }
}

export default router
