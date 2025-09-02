import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { BookOpen, CheckCircle, AlertCircle, Settings, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { notionApi, formatErrorMessage } from '@/lib/api'
import { Link } from 'react-router-dom'

interface NotionConnection {
  isConnected: boolean
  selectedPage?: {
    id: string
    title: string
    url: string
  }
}

export default function Dashboard() {
  const [connection, setConnection] = useState<NotionConnection>({
    isConnected: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search)
    const connected = urlParams.get('connected')
    const botId = urlParams.get('bot_id')
    const error = urlParams.get('error')

    if (connected === 'true' && botId) {
      // Store the bot ID for future use
      localStorage.setItem('notion-bot-id', botId)
      setConnection(prev => ({ ...prev, isConnected: true }))
      
      toast({
        title: "Success!",
        description: "Successfully connected to Notion",
      })

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to Notion: ${error}`,
        variant: "destructive"
      })

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Check if already connected
    const storedBotId = localStorage.getItem('notion-bot-id')
    const selectedPage = localStorage.getItem('notion-selected-page')
    
    if (storedBotId) {
      setConnection(prev => ({ 
        ...prev, 
        isConnected: true,
        selectedPage: selectedPage ? JSON.parse(selectedPage) : undefined
      }))
    }
  }, [])

  const handleConnectNotion = async () => {
    setIsLoading(true)
    try {
      const { authUrl } = await notionApi.auth()
      
      // Redirect to Notion OAuth
      window.location.href = authUrl
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Connection Failed",
        description: formatErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    localStorage.removeItem('notion-bot-id')
    localStorage.removeItem('notion-selected-page')
    setConnection({ isConnected: false })
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Notion",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Connect to Notion and select where to save your video notes
        </p>
      </motion.div>

      {/* Notion Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>Notion Connection</span>
            </CardTitle>
            <CardDescription>
              Connect your Notion account to save video summaries automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!connection.isConnected ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <span className="text-amber-700">Not connected to Notion</span>
                </div>
                <Button 
                  onClick={handleConnectNotion} 
                  disabled={isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? 'Connecting...' : 'Connect to Notion'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to Notion to authorize the connection
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 font-medium">Connected to Notion</span>
                  </div>
                  <Button 
                    onClick={handleDisconnect} 
                    variant="outline" 
                    size="sm"
                  >
                    Disconnect
                  </Button>
                </div>

                {connection.selectedPage ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">Selected Page</p>
                        <p className="text-sm text-blue-700">{connection.selectedPage.title}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={connection.selectedPage.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">No page selected yet</p>
                    <Button variant="outline">
                      Select Notion Page
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span>Create Notes</span>
            </CardTitle>
            <CardDescription>
              Generate notes from YouTube videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/">
                Go to Home
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-500" />
              <span>Settings</span>
            </CardTitle>
            <CardDescription>
              Configure API keys and models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/settings">
                Open Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
