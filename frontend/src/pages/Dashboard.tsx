import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { BookOpen, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { notionApi, formatErrorMessage } from '@/lib/api'

interface NotionConfig {
  clientId: string
  redirectUri: string
  isConnected: boolean
}

export default function Dashboard() {
  const [config, setConfig] = useState<NotionConfig>({
    clientId: '',
    redirectUri: '',
    isConnected: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('notion-config')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search)
    const connected = urlParams.get('connected')
    const botId = urlParams.get('bot_id')
    const error = urlParams.get('error')

    if (connected === 'true' && botId) {
      // Store the bot ID for future use
      localStorage.setItem('notion-bot-id', botId)
      setConfig(prev => ({ ...prev, isConnected: true }))
      
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
    if (storedBotId) {
      setConfig(prev => ({ ...prev, isConnected: true }))
    }
  }, [])

  const handleSaveConfig = () => {
    if (!config.clientId || !config.redirectUri) {
      toast({
        title: "Missing Information",
        description: "Please provide both Client ID and Redirect URI",
        variant: "destructive"
      })
      return
    }

    localStorage.setItem('notion-config', JSON.stringify(config))
    toast({
      title: "Configuration Saved",
      description: "Notion configuration has been saved successfully",
    })
  }

  const handleConnectNotion = async () => {
    if (!config.clientId || !config.redirectUri) {
      toast({
        title: "Configuration Required",
        description: "Please configure Notion integration first",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const { authUrl } = await notionApi.auth({
        clientId: config.clientId,
        redirectUri: config.redirectUri
      })
      
      // Store the client ID for later use
      localStorage.setItem('notion-client-id', config.clientId)
      
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard",
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
          Manage your Notion integration and view your summaries
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Notion Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span>Notion Integration</span>
              </CardTitle>
              <CardDescription>
                Configure your Notion integration to save summaries automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client-id">Notion Client ID</Label>
                <Input
                  id="client-id"
                  placeholder="Enter your Notion Client ID"
                  value={config.clientId}
                  onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-uri">Redirect URI</Label>
                <Input
                  id="redirect-uri"
                  placeholder="http://localhost:3000/auth/notion/callback"
                  value={config.redirectUri}
                  onChange={(e) => setConfig(prev => ({ ...prev, redirectUri: e.target.value }))}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveConfig} variant="outline">
                  Save Configuration
                </Button>
                <Button 
                  onClick={handleConnectNotion} 
                  disabled={isLoading || !config.clientId || !config.redirectUri}
                  className="flex-1"
                >
                  {isLoading ? 'Connecting...' : 'Connect to Notion'}
                </Button>
              </div>

              {config.isConnected && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Connected to Notion</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span>Setup Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1. Create Notion Integration</h4>
                  <p className="text-muted-foreground mb-2">
                    Go to{' '}
                    <a 
                      href="https://www.notion.so/my-integrations" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      notion.so/my-integrations
                    </a>
                    {' '}and create a new integration
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Get Client ID</h4>
                  <p className="text-muted-foreground mb-2">
                    Copy the "Internal Integration Token" from your integration settings
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Set Redirect URI</h4>
                  <p className="text-muted-foreground mb-2">
                    Use: <code className="bg-gray-100 px-1 rounded">http://localhost:3000/auth/notion/callback</code>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard('http://localhost:3000/auth/notion/callback')}
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. Share Database</h4>
                  <p className="text-muted-foreground">
                    Share your Notion database with the integration to allow saving summaries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Summaries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Summaries</CardTitle>
            <CardDescription>
              Your recently created video summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No summaries yet. Start by creating your first summary!</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
