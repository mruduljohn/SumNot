import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Key, Brain, Save, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { AI_PROVIDERS } from '@/lib/constants'

interface AppSettings {
  apiKey: string
  aiProvider: string
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    aiProvider: 'openai'
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSaveSettings = () => {
    if (!settings.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide an API key to use AI features",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    // Save to localStorage
    localStorage.setItem('app-settings', JSON.stringify(settings))
    
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully",
      })
    }, 1000)
  }

  const handleClearSettings = () => {
    localStorage.removeItem('app-settings')
    setSettings({
      apiKey: '',
      aiProvider: 'openai'
    })
    toast({
      title: "Settings Cleared",
      description: "All settings have been cleared",
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
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure your AI provider and API keys
        </p>
      </motion.div>

      {/* AI Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span>AI Configuration</span>
            </CardTitle>
            <CardDescription>
              Set up your AI provider and API key for video summarization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ai-provider">AI Provider</Label>
              <Select 
                value={settings.aiProvider} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, aiProvider: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your API key"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser and never sent to our servers
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
              <Button 
                onClick={handleClearSettings} 
                variant="outline"
                disabled={isLoading}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Key Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-amber-500" />
              <span>API Key Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-2">OpenAI</h4>
                <p className="text-muted-foreground mb-2">
                  Get your API key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    platform.openai.com/api-keys
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Anthropic (Claude)</h4>
                <p className="text-muted-foreground mb-2">
                  Get your API key from{' '}
                  <a 
                    href="https://console.anthropic.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    console.anthropic.com
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Google (Gemini)</h4>
                <p className="text-muted-foreground mb-2">
                  Get your API key from{' '}
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    makersuite.google.com/app/apikey
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
