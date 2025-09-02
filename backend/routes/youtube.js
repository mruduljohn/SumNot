import express from 'express'
import { YoutubeTranscript } from 'youtube-transcript'
import axios from 'axios'

const router = express.Router()

/**
 * YouTube transcript extraction endpoint
 * Fetches transcript from YouTube videos using multiple methods
 * 
 * @route POST /api/transcript
 * @param {string} url - YouTube video URL
 * @returns {Object} - Video title and transcript text
 */
router.post('/', async (req, res) => {
  try {
    const { url } = req.body

    // Validate input
    if (!url) {
      return res.status(400).json({
        error: 'YouTube URL is required',
        code: 'MISSING_URL'
      })
    }

    // Extract video ID from various YouTube URL formats
    const videoId = extractVideoId(url)
    if (!videoId) {
      return res.status(400).json({
        error: 'Invalid YouTube URL format',
        code: 'INVALID_URL'
      })
    }

    console.log(`📹 Fetching transcript for video: ${videoId}`)

    // Get video title first
    const title = await getVideoTitle(videoId)
    
    // Try to get transcript using multiple methods
    let transcript
    let transcriptSource = 'unknown'
    
    try {
      // Method 1: Try to get any available transcript (including auto-generated)
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: 'en', // Try English first
        country: 'US'
      })
      transcript = transcriptData
        .map(item => item.text)
        .join(' ')
        .trim()
      transcriptSource = 'auto-generated'
      
      console.log(`✅ Transcript fetched successfully (${transcript.length} characters)`)
    } catch (transcriptError) {
      console.warn('⚠️ Primary transcript method failed:', transcriptError.message)
      
      try {
        // Method 2: Try without language specification (gets any available)
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)
        transcript = transcriptData
          .map(item => item.text)
          .join(' ')
          .trim()
        transcriptSource = 'available'
        
        console.log(`✅ Transcript fetched with fallback method (${transcript.length} characters)`)
      } catch (fallbackError) {
        console.warn('⚠️ Fallback transcript method failed:', fallbackError.message)
        
        try {
          // Method 3: Try with different language codes
          const languages = ['en-US', 'en-GB', 'en', 'auto']
          for (const lang of languages) {
            try {
              const transcriptData = await YoutubeTranscript.fetchTranscript(videoId, { lang })
              transcript = transcriptData
                .map(item => item.text)
                .join(' ')
                .trim()
              transcriptSource = `language-${lang}`
              console.log(`✅ Transcript fetched with language ${lang} (${transcript.length} characters)`)
              break
            } catch (langError) {
              continue
            }
          }
        } catch (finalError) {
          console.error('❌ All transcript methods failed:', finalError.message)
          
          return res.status(400).json({
            error: 'Transcript not available for this video',
            code: 'NO_TRANSCRIPT',
            details: 'This video may not have captions, auto-generated captions, or they may be disabled. Try a different video.'
          })
        }
      }
    }

    // Validate transcript content
    if (!transcript || transcript.length < 50) {
      return res.status(400).json({
        error: 'Transcript too short or empty',
        code: 'INVALID_TRANSCRIPT',
        details: 'The video transcript appears to be too short for summarization'
      })
    }

    res.json({
      title: title || 'Untitled Video',
      transcript,
      videoId,
      transcriptLength: transcript.length,
      transcriptSource
    })

  } catch (error) {
    console.error('❌ Error fetching transcript:', error)
    
    // Handle specific error types
    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({
        error: 'Video not found or unavailable',
        code: 'VIDEO_NOT_FOUND'
      })
    }
    
    if (error.message.includes('Private video')) {
      return res.status(403).json({
        error: 'Video is private or restricted',
        code: 'VIDEO_PRIVATE'
      })
    }

    res.status(500).json({
      error: 'Failed to fetch video transcript',
      code: 'TRANSCRIPT_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * Extract video ID from YouTube URL
 * Supports various YouTube URL formats
 * 
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
function extractVideoId(url) {
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
 * Get video title using YouTube Data API
 * Falls back to generic title if API fails
 * 
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Video title
 */
async function getVideoTitle(videoId) {
  try {
    // Note: In a production app, you'd want to use YouTube Data API v3
    // For now, we'll use a simple approach or return a generic title
    return `YouTube Video ${videoId}`
  } catch (error) {
    console.warn('Failed to fetch video title:', error.message)
    return `YouTube Video ${videoId}`
  }
}

export default router
