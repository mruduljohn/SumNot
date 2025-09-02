import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { Youtube, Brain, Database, Loader2, CheckCircle, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { transcriptApi, summarizeApi, notionApi, isValidYouTubeUrl, formatErrorMessage } from '@/lib/api'

interface SummaryResult {
  title: string
  summary: string
  tags: string[]
  videoUrl: string
  notionUrl?: string
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [result, setResult] = useState<SummaryResult | null>(null)
  const { toast } = useToast()

  // Load settings from localStorage
  const [settings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings')
    return savedSettings ? JSON.parse(savedSettings) : { 
      apiKey: '', 
      aiProvider: 'openai',
      openrouterModel: 'openai/gpt-4o'
    }
  })

  const handleSummarize = async () => {
    if (!youtubeUrl) {
      toast({
        title: "YouTube URL Required",
        description: "Please provide a YouTube URL",
        variant: "destructive"
      })
      return
    }

    if (!settings.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your API key in Settings first",
        variant: "destructive"
      })
      return
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid YouTube URL",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setProgress(0)
    setResult(null)

    try {
      // Step 1: Fetch transcript
      setCurrentStep('Fetching video transcript...')
      setProgress(20)
      
      const transcriptData = await transcriptApi.fetch(youtubeUrl)
      const { transcript, title } = transcriptData

      // Step 2: Generate summary
      setCurrentStep('Generating AI summary...')
      setProgress(60)

      const summaryData = await summarizeApi.generate({
        transcript,
        title,
        apiKey: settings.apiKey,
        provider: settings.aiProvider,
        model: settings.openrouterModel
      })

      // Step 3: Save to Notion
      setCurrentStep('Saving to Notion...')
      setProgress(90)

      // Get the bot ID from localStorage
      const botId = localStorage.getItem('notion-bot-id')

      const notionData = await notionApi.save({
        ...summaryData,
        videoUrl: youtubeUrl,
        botId: botId
      })

      setProgress(100)
      setCurrentStep('Complete!')
      setResult({
        ...summaryData,
        videoUrl: youtubeUrl,
        notionUrl: notionData.notionUrl
      })

      toast({
        title: "Success!",
        description: "Video summarized and saved to Notion successfully",
      })

    } catch (error) {
      console.error('Error:', error)
      
      // Handle specific transcript errors
      if (error.response?.data?.code === 'NO_TRANSCRIPT') {
        toast({
          title: "Transcript Not Available",
          description: "This video doesn't have captions available. Try a different video with captions enabled.",
          variant: "destructive"
        })
      } else if (error.response?.data?.code === 'VIDEO_NOT_FOUND') {
        toast({
          title: "Video Not Found",
          description: "The video URL is invalid or the video is no longer available.",
          variant: "destructive"
        })
      } else if (error.response?.data?.code === 'VIDEO_PRIVATE') {
        toast({
          title: "Video Not Accessible",
          description: "This video is private or restricted and cannot be accessed.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Error",
          description: formatErrorMessage(error),
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setProgress(0)
        setCurrentStep('')
      }, 2000)
    }
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
          SumNot
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform YouTube videos into structured notes and automatically save them to your Notion workspace
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <span>Video Details</span>
              </CardTitle>
              <CardDescription>
                Paste a YouTube URL to create structured notes automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {!settings.apiKey && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-700">
                    <strong>API Key Required:</strong> Please configure your AI provider and API key in{' '}
                    <a href="/settings" className="text-blue-600 hover:underline">Settings</a> first.
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> The video must have captions/transcripts available. 
                  Try videos with auto-generated captions or manually added subtitles.
                </p>
              </div>

              <Button 
                onClick={handleSummarize} 
                disabled={isLoading || !youtubeUrl || !settings.apiKey}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Notes...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Create Notes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress & Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Progress Card */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">{currentStep}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Summary Complete</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{result.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Summary</Label>
                      <Textarea
                        value={result.summary}
                        readOnly
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(result.videoUrl, '_blank')}
                      >
                        <Youtube className="mr-2 h-4 w-4" />
                        View Video
                      </Button>
                      {result.notionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.notionUrl, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View in Notion
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  <span>Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Automatic transcript extraction</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI-powered summarization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Smart topic tagging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Direct Notion integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multiple AI providers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
