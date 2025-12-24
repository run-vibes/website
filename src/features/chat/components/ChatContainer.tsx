import { useRef, useEffect } from 'react'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { useChat } from '../hooks/useChat'
import { cn } from '@/lib/cn'

interface ChatContainerProps {
  className?: string
  apiEndpoint?: string
}

export function ChatContainer({ className, apiEndpoint }: ChatContainerProps) {
  const { messages, isLoading, error, sendMessage } = useChat({ apiEndpoint })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className={cn(
        'flex flex-col h-[600px] max-h-[80vh] border rounded-xl bg-background',
        className
      )}
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            sender={message.role === 'user' ? 'user' : 'assistant'}
          >
            {message.content}
          </ChatBubble>
        ))}
        {isLoading && (
          <ChatBubble sender="assistant">
            <span className="animate-pulse">Thinking...</span>
          </ChatBubble>
        )}
        {error && (
          <div className="text-center text-sm text-destructive p-2">
            {error}. Please try again.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <ChatInput onSend={sendMessage} loading={isLoading} />
      </div>
    </div>
  )
}
