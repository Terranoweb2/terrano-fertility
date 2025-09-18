import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Heart,
  Calendar,
  TrendingUp,
  Lightbulb
} from 'lucide-react'

const AIChat = () => {
  const { user, apiCall } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [quickQuestions, setQuickQuestions] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchQuickQuestions()
    // Message de bienvenue
    setMessages([{
      id: 1,
      type: 'ai',
      content: `Bonjour ${user?.first_name} ! 👋 Je suis TerranoIA, votre assistante personnelle en fertilité. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date().toISOString()
    }])
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchQuickQuestions = async () => {
    try {
      const response = await apiCall('/ai/quick-questions')
      setQuickQuestions(response.questions || [])
    } catch (error) {
      console.error('Erreur lors du chargement des questions rapides:', error)
    }
  }

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await apiCall('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      })

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response,
        timestamp: response.timestamp,
        contextUsed: response.context_used
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Désolée, je rencontre des difficultés techniques. Pouvez-vous réessayer ? 😊',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const handleQuickQuestion = (question) => {
    sendMessage(question)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span>Chat avec TerranoIA</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Votre assistante personnelle en fertilité et santé reproductive
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Quick Questions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Questions rapides</span>
            </CardTitle>
            <CardDescription>
              Cliquez pour poser une question
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.slice(0, 6).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="w-full text-left justify-start h-auto py-2 px-3 text-xs leading-relaxed"
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Conversation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-fertility text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-card border'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.contextUsed && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Personnalisé
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-fertility text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-card border p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Posez votre question sur la fertilité..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Help Text */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">TerranoIA utilise vos données personnelles</span>
              </div>
              <p>
                Mes réponses sont personnalisées selon vos cycles, données quotidiennes et profil. 
                Plus vous enregistrez de données, plus mes conseils sont précis ! 
                Mes conseils ne remplacent pas un avis médical professionnel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Conseils de fertilité</h3>
                <p className="text-sm text-muted-foreground">
                  Optimisez vos chances de conception
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Analyse de cycle</h3>
                <p className="text-sm text-muted-foreground">
                  Comprenez vos patterns menstruels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Suivi personnalisé</h3>
                <p className="text-sm text-muted-foreground">
                  Recommandations basées sur vos données
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AIChat

