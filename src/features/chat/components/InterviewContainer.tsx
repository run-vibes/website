import { cn } from '@/lib/cn'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getResponseStarters } from '../config/questions'
import { useChat } from '../hooks/useChat'
import { useInterview } from '../hooks/useInterview'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { ResponseStarter } from './ResponseStarter'
import { SuggestionChips } from './SuggestionChips'

interface InterviewContainerProps {
  className?: string
  apiEndpoint?: string
  onInputFocus?: () => void
}

export function InterviewContainer({
  className,
  apiEndpoint,
  onInputFocus,
}: InterviewContainerProps) {
  const {
    phase,
    currentQuestion,
    answers,
    messages: interviewMessages,
    answerQuestion,
    setContactCollected,
  } = useInterview()

  const {
    messages: chatMessages,
    isLoading,
    error,
    sendMessage,
  } = useChat({
    apiEndpoint,
    interviewAnswers: answers,
    onLeadExtracted: () => setContactCollected(true),
  })

  const messagesAreaRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const prevMessageCount = useRef(0)

  // Combine interview messages with chat messages for display
  // Chat messages only appear after the transition to chat phase
  const allMessages = [...interviewMessages, ...chatMessages.slice(1)] // Skip welcome message from chat since interview has its own

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (allMessages.length > prevMessageCount.current && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight
    }
    prevMessageCount.current = allMessages.length
  }, [allMessages.length])

  const handleInputFocus = useCallback(() => {
    onInputFocus?.()
  }, [onInputFocus])

  const handleSend = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      setInputValue('')

      // During structured or post_contact phase, treat typed input as a custom answer
      if ((phase === 'structured' || phase === 'post_contact') && currentQuestion) {
        answerQuestion(currentQuestion.id, trimmed, trimmed)
      } else if (phase === 'chat') {
        // During chat phase, send to AI
        await sendMessage(trimmed)
      }
    },
    [phase, currentQuestion, answerQuestion, sendMessage],
  )

  const handleSuggestionSelect = useCallback(
    (value: string, label: string) => {
      if (currentQuestion) {
        answerQuestion(currentQuestion.id, value, label)
      }
    },
    [currentQuestion, answerQuestion],
  )

  const handleStarterSelect = useCallback((starter: string) => {
    setInputValue(starter)
  }, [])

  // Get response starters for chat phase
  const getActiveStarters = (): string[] => {
    if (phase !== 'chat' || isLoading) return []

    const userChatMessages = chatMessages.filter((m) => m.role === 'user').length
    if (userChatMessages === 0) return getResponseStarters('problem')
    if (userChatMessages === 1) return getResponseStarters('vision')
    if (userChatMessages === 2) return getResponseStarters('users')
    return []
  }

  const activeStarters = getActiveStarters()
  const showSuggestions = (phase === 'structured' || phase === 'post_contact') && currentQuestion
  const isComplete = phase === 'complete'

  return (
    <div
      className={cn(
        'flex flex-col border rounded-xl bg-background',
        'h-[400px] sm:h-[500px] max-h-[70vh]',
        className,
      )}
    >
      {/* Messages Area */}
      <div ref={messagesAreaRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {allMessages.map((message) => (
          <ChatBubble key={message.id} sender={message.role}>
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
            Something went wrong. Please try again.
          </div>
        )}
      </div>

      {/* Suggestion Chips for structured questions */}
      {showSuggestions && (
        <div className="px-4 pb-2 border-t pt-3">
          <SuggestionChips options={currentQuestion.options} onSelect={handleSuggestionSelect} />
        </div>
      )}

      {/* Response Starters for chat phase */}
      {activeStarters.length > 0 && (
        <div className="px-4 pb-2">
          <ResponseStarter starters={activeStarters} onSelect={handleStarterSelect} />
        </div>
      )}

      {/* Input Area */}
      {!isComplete && (
        <div className={cn('p-4 shrink-0', !showSuggestions && 'border-t')}>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            loading={isLoading}
            onFocus={handleInputFocus}
            placeholder={
              showSuggestions ? 'Choose an option or type your own...' : 'Type your message...'
            }
          />
        </div>
      )}
    </div>
  )
}
