import { cn } from '@/lib/cn'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useChat } from '../hooks/useChat'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

interface ChatContainerProps {
  className?: string
  apiEndpoint?: string
}

export function ChatContainer({ className, apiEndpoint }: ChatContainerProps) {
  const { messages, isLoading, error, sendMessage } = useChat({ apiEndpoint })
  const messagesAreaRef = useRef<HTMLDivElement>(null)
  const inputAreaRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const initialMessageCount = useRef(messages.length)

  // Scroll within the messages area (not the page) when new messages arrive
  useEffect(() => {
    if (messages.length > initialMessageCount.current && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight
    }
  }, [messages.length])

  const handleInputFocus = useCallback(() => {
    setIsExpanded(true)
    // On mobile, scroll input into view only if needed (won't scroll if already visible)
    // Delay allows iOS keyboard animation to complete
    setTimeout(() => {
      inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 300)
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col border rounded-xl bg-background transition-all duration-300',
        // Compact height initially, expand when focused (smaller on mobile to stay above keyboard)
        isExpanded
          ? 'h-[320px] sm:h-[500px] max-h-[50vh] sm:max-h-[70vh]'
          : 'h-[280px] sm:h-[350px]',
        className,
      )}
    >
      {/* Messages Area */}
      <div ref={messagesAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <ChatBubble key={message.id} sender={message.role === 'user' ? 'user' : 'assistant'}>
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
            Gremlins in the system prevented us from sending your message. Please try again.
          </div>
        )}
      </div>

      {/* Input Area */}
      <div ref={inputAreaRef} className="border-t p-4 shrink-0">
        <ChatInput onSend={sendMessage} loading={isLoading} onFocus={handleInputFocus} />
      </div>
    </div>
  )
}
