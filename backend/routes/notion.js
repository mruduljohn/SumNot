import express from 'express'
import { Client } from '@notionhq/client'
import axios from 'axios'

const router = express.Router()

// In-memory storage for demo (use database in production)
const tokenStorage = new Map()

/**
 * Notion OAuth authentication endpoint
 * Initiates OAuth flow with Notion
 * 
 * @route POST /api/notion/auth
 * @param {string} clientId - Notion integration client ID
 * @param {string} redirectUri - OAuth redirect URI
 * @returns {Object} - Authorization URL for OAuth flow
 */
router.post('/auth', async (req, res) => {
  try {
    // Use environment variables instead of request body for security
    const clientId = process.env.NOTION_CLIENT_ID
    const redirectUri = process.env.NOTION_REDIRECT_URI

    if (!clientId || !redirectUri) {
      return res.status(500).json({
        error: 'Notion integration not configured. Please contact administrator.',
        code: 'NOTION_NOT_CONFIGURED'
      })
    }

    // Generate OAuth URL according to Notion's OAuth 2.0 specification
    const authUrl = `https://api.notion.com/v1/oauth/authorize?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `response_type=code&` +
      `owner=user&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}`

    console.log(`🔐 Generated Notion OAuth URL for client: ${clientId}`)

    res.json({
      authUrl,
      message: 'Redirect user to this URL to complete OAuth flow'
    })

  } catch (error) {
    console.error('❌ Error initiating Notion OAuth:', error)
    res.status(500).json({
      error: 'Failed to initiate Notion OAuth',
      code: 'OAUTH_INIT_ERROR'
    })
  }
})

/**
 * Notion OAuth callback handler
 * Processes OAuth callback and exchanges code for access token
 * 
 * @route GET /api/notion/callback
 * @param {string} code - OAuth authorization code
 * @param {string} state - OAuth state parameter
 * @returns {Object} - Success message and user info
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query

    if (!code) {
      return res.status(400).json({
        error: 'Authorization code is required',
        code: 'MISSING_CODE'
      })
    }

    // Get client credentials from environment
    const clientId = process.env.NOTION_CLIENT_ID
    const clientSecret = process.env.NOTION_CLIENT_SECRET
    const redirectUri = process.env.NOTION_REDIRECT_URI || 'http://localhost:3000/auth/notion/callback'

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Notion client credentials not configured',
        code: 'MISSING_CLIENT_CREDENTIALS'
      })
    }

    // Exchange code for access token according to Notion's OAuth 2.0 spec
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    const tokenResponse = await axios.post('https://api.notion.com/v1/oauth/token', {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    }, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    const { access_token, refresh_token, bot_id, workspace_id, workspace_name } = tokenResponse.data

    // Store tokens (in production, use secure database)
    const tokenData = {
      access_token,
      refresh_token,
      bot_id,
      workspace_id,
      workspace_name,
      created_at: new Date().toISOString()
    }
    
    tokenStorage.set(bot_id, tokenData)

    console.log(`✅ Notion OAuth completed for bot: ${bot_id}, workspace: ${workspace_name}`)

    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendUrl}/dashboard?connected=true&bot_id=${bot_id}`)

  } catch (error) {
    console.error('❌ Error processing Notion OAuth callback:', error)
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    
    if (error.response?.status === 400) {
      return res.redirect(`${frontendUrl}/dashboard?error=invalid_code`)
    }
    
    res.redirect(`${frontendUrl}/dashboard?error=oauth_failed`)
  }
})

/**
 * Save summary to Notion database
 * Creates a new page in the user's Notion database
 * 
 * @route POST /api/notion/save
 * @param {string} title - Summary title
 * @param {string} summary - Summary content
 * @param {Array} tags - Summary tags
 * @param {string} videoUrl - Original YouTube URL
 * @param {string} botId - Notion bot ID for token lookup
 * @returns {Object} - Success message and Notion page URL
 */
router.post('/save', async (req, res) => {
  try {
    const { title, summary, tags, videoUrl, botId } = req.body

    // Validate required fields
    if (!title || !summary || !videoUrl) {
      return res.status(400).json({
        error: 'Title, summary, and video URL are required',
        code: 'MISSING_FIELDS'
      })
    }

    // Get access token from storage
    let tokenData
    if (botId) {
      tokenData = tokenStorage.get(botId)
    } else {
      // Fallback: get first available token (for demo purposes)
      tokenData = tokenStorage.values().next().value
    }

    if (!tokenData || !tokenData.access_token) {
      return res.status(401).json({
        error: 'Notion access token not found. Please complete OAuth flow first.',
        code: 'NO_ACCESS_TOKEN'
      })
    }

    // Initialize Notion client
    const notion = new Client({
      auth: tokenData.access_token,
    })

    // Get user's databases to find the right one
    const databases = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    })

    let database
    if (databases.results.length === 0) {
      console.log('📝 No databases found, creating a new one...')
      
      // Get user's pages to find a suitable parent page
      const pages = await notion.search({
        filter: {
          property: 'object',
          value: 'page'
        }
      })

      if (pages.results.length === 0) {
        return res.status(404).json({
          error: 'No Notion pages found. Please create a page in your workspace first.',
          code: 'NO_PAGES'
        })
      }

      // Use the first page as parent
      const parentPage = pages.results[0]

      // Create a new database automatically
      const newDatabase = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPage.id
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'YouTube Video Summaries'
            }
          }
        ],
        properties: {
          'Title': {
            title: {}
          },
          'Video URL': {
            url: {}
          },
          'Date': {
            date: {}
          },
          'Tags': {
            multi_select: {
              options: [
                { name: 'Education', color: 'blue' },
                { name: 'Technology', color: 'green' },
                { name: 'Business', color: 'yellow' },
                { name: 'Health', color: 'red' },
                { name: 'Science', color: 'purple' },
                { name: 'Entertainment', color: 'pink' },
                { name: 'Tutorial', color: 'orange' },
                { name: 'Review', color: 'brown' },
                { name: 'Analysis', color: 'gray' }
              ]
            }
          }
        }
      })

      database = newDatabase
      console.log(`✅ Created new database: ${newDatabase.id}`)
    } else {
      // Use the first existing database
      database = databases.results[0]
      console.log(`📊 Using existing database: ${database.id}`)
    }

    // Create page in Notion database
    const pageResponse = await notion.pages.create({
      parent: {
        database_id: database.id,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        'Video URL': {
          url: videoUrl,
        },
        'Date': {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
        'Tags': {
          multi_select: tags.map(tag => ({
            name: tag,
          })),
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Summary',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: summary,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Original Video',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: videoUrl,
                  link: {
                    url: videoUrl,
                  },
                },
              },
            ],
          },
        },
      ],
    })

    console.log(`📝 Summary saved to Notion page: ${pageResponse.id}`)

    res.json({
      success: true,
      notionUrl: pageResponse.url,
      pageId: pageResponse.id,
      message: 'Summary saved to Notion successfully'
    })

  } catch (error) {
    console.error('❌ Error saving to Notion:', error)
    
    if (error.code === 'unauthorized') {
      return res.status(401).json({
        error: 'Notion access token expired. Please reconnect your account.',
        code: 'TOKEN_EXPIRED'
      })
    }
    
    if (error.code === 'object_not_found') {
      return res.status(404).json({
        error: 'Notion database not found or access denied',
        code: 'DATABASE_NOT_FOUND'
      })
    }

    res.status(500).json({
      error: 'Failed to save summary to Notion',
      code: 'SAVE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * Get user's Notion databases
 * Lists all databases accessible to the user
 * 
 * @route GET /api/notion/databases
 * @returns {Array} - List of accessible databases
 */
router.get('/databases', async (req, res) => {
  try {
    const accessToken = req.session?.notionAccessToken
    if (!accessToken) {
      return res.status(401).json({
        error: 'Notion access token not found',
        code: 'NO_ACCESS_TOKEN'
      })
    }

    const notion = new Client({
      auth: accessToken,
    })

    const databases = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    })

    const formattedDatabases = databases.results.map(db => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || 'Untitled Database',
      url: db.url,
      created_time: db.created_time,
    }))

    res.json({
      databases: formattedDatabases,
      count: formattedDatabases.length
    })

  } catch (error) {
    console.error('❌ Error fetching Notion databases:', error)
    res.status(500).json({
      error: 'Failed to fetch Notion databases',
      code: 'FETCH_DATABASES_ERROR'
    })
  }
})

export default router
