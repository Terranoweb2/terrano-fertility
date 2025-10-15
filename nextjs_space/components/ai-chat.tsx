
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export function AiChat() {
  const { data: session } = useSession() || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/history');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Êtes-vous sûr de vouloir effacer tout l\'historique de conversation ?')) {
      return;
    }

    try {
      const response = await fetch('/api/chat/history', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Read streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage.content += chunk;

          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...assistantMessage };
            return newMessages;
          });
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolée, une erreur s\'est produite. Veuillez réessayer.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Comment savoir si j'ovule ?",
    "Quels sont les meilleurs aliments pour la fertilité ?",
    "Comment calculer ma période fertile ?",
    "Que signifient mes symptômes actuels ?",
  ];

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">FertiliBot</h2>
            <p className="text-sm text-muted-foreground">
              Votre assistante IA experte en fertilité et grossesse
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Bienvenue ! Je suis là pour vous aider 💜
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Posez-moi toutes vos questions sur la fertilité, le cycle menstruel, 
                la conception ou la grossesse. Je suis là pour vous accompagner !
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto py-3 px-4"
                    onClick={() => {
                      setInput(question);
                      textareaRef.current?.focus();
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg h-fit">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-4 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="bg-primary p-2 rounded-lg h-fit">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Posez votre question sur la fertilité, le cycle ou la grossesse..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="min-h-[60px] resize-none"
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
          </p>
        </div>
      </Card>
    </div>
  );
}
