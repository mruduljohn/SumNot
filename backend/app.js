import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import notionRoutes from './routes/notion.js'
import youtubeRoutes from './routes/youtube.js'
import aiRoutes from './routes/ai.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

/**
 * Security middleware configuration
 * Implements comprehensive security headers and rate limiting
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

/**
 * Rate limiting to prevent abuse
 * Allows 100 requests per 15 minutes per IP
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

/**
 * CORS configuration for frontend communication
 * Allows requests from localhost:3000 in development
 */
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
}))

/**
 * Request logging for monitoring and debugging
 * Logs all HTTP requests with timing information
 */
app.use(morgan('combined'))

/**
 * Body parsing middleware
 * Parses JSON payloads up to 10MB
 */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * Health check endpoint
 * Returns server status and basic information
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
})

/**
 * API routes
 * Mounts all feature-specific routes with /api prefix
 */
app.use('/api/notion', notionRoutes)
app.use('/api/transcript', youtubeRoutes)
app.use('/api/summarize', aiRoutes)

/**
 * Global error handling middleware
 * Catches and handles all unhandled errors
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
  })
})

/**
 * 404 handler for undefined routes
 * Returns consistent error response for missing endpoints
 */
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  })
})

/**
 * Start server with error handling
 * Logs startup information and handles startup errors
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

export default app
