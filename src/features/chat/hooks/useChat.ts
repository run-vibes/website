import { useCallback, useState } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UseChatOptions {
  apiEndpoint?: string
  interviewAnswers?: Record<string, string>
  onLeadExtracted?: () => void
}

export function useChat(options: UseChatOptions = {}) {
  const { apiEndpoint = '/api/chat', interviewAnswers, onLeadExtracted } = options
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Great to connect! Based on what you've shared, I'd love to learn more about what you're looking to build. What's the main challenge you're trying to solve?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            sessionId,
            phase: 'chat',
            interviewAnswers,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const data = await response.json()

        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId)
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Notify when lead is extracted (backend confirmed contact collection)
        if (data.leadExtracted && onLeadExtracted) {
          onLeadExtracted()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [apiEndpoint, sessionId, interviewAnswers, onLeadExtracted],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
