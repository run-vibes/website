import { cn } from '@/lib/cn'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getResponseStarters } from '../config/questions'
import { useChat } from '../hooks/useChat'
import { useInterview } from '../hooks/useInterview'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { InterviewQuestion } from './InterviewQuestion'
import { ProgressIndicator } from './ProgressIndicator'
import { ResponseStarter } from './ResponseStarter'

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
    currentQuestionIndex,
    answers,
    progress,
    answerQuestion,
    setContactCollected,
  } = useInterview()

  const { messages, isLoading, error, sendMessage } = useChat({
    apiEndpoint,
    interviewAnswers: answers,
    onLeadExtracted: () => setContactCollected(true),
  })

  const messagesAreaRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const initialMessageCount = useRef(messages.length)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > initialMessageCount.current && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight
    }
  }, [messages.length])

  const handleInputFocus = useCallback(() => {
    setIsExpanded(true)
    onInputFocus?.()
  }, [onInputFocus])

  const handleSend = useCallback(
    async (content: string) => {
      setInputValue('')
      await sendMessage(content)
    },
    [sendMessage],
  )

  const handleStarterSelect = useCallback((starter: string) => {
    setInputValue(starter)
  }, [])

  // Get response starters based on conversation state
  const getActiveStarters = (): string[] => {
    if (phase !== 'chat' || isLoading) return []

    // Determine which starters to show based on message count
    const userMessages = messages.filter((m) => m.role === 'user').length
    if (userMessages === 0) return getResponseStarters('problem')
    if (userMessages === 1) return getResponseStarters('vision')
    if (userMessages === 2) return getResponseStarters('users')
    return []
  }

  // Render structured question phase
  if (phase === 'structured' && currentQuestion) {
    return (
      <div
        className={cn(
          'flex flex-col border rounded-xl bg-background p-6',
          'min-h-[350px] sm:min-h-[400px]',
          className,
        )}
      >
        <ProgressIndicator
          current={progress.current}
          total={progress.total}
          showLabel
          className="mb-8"
        />
        <div className="flex-1 flex items-center justify-center">
          <InterviewQuestion
            question={currentQuestion}
            currentValue={answers[currentQuestion.id]}
            onAnswer={answerQuestion}
            className="w-full max-w-lg"
          />
        </div>
      </div>
    )
  }

  // Render post-contact budget question
  if (phase === 'post_contact' && currentQuestion) {
    return (
      <div
        className={cn(
          'flex flex-col border rounded-xl bg-background p-6',
          'min-h-[350px] sm:min-h-[400px]',
          className,
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <InterviewQuestion
            question={currentQuestion}
            currentValue={answers[currentQuestion.id]}
            onAnswer={answerQuestion}
            className="w-full max-w-lg"
          />
        </div>
      </div>
    )
  }

  // Render complete phase
  if (phase === 'complete') {
    return (
      <div
        className={cn(
          'flex flex-col border rounded-xl bg-background p-6',
          'min-h-[350px] sm:min-h-[400px]',
          className,
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-4xl">✨</div>
            <h2 className="text-xl font-bold">Thanks for sharing your vision!</h2>
            <p className="text-muted-foreground">
              A member of the Vibes team will reach out within 24 hours to discuss next steps.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Render chat phase
  const activeStarters = getActiveStarters()

  return (
    <div
      className={cn(
        'flex flex-col border rounded-xl bg-background transition-all duration-300',
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

      {/* Response Starters */}
      {activeStarters.length > 0 && (
        <div className="px-4 pb-2">
          <ResponseStarter starters={activeStarters} onSelect={handleStarterSelect} />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 shrink-0">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          loading={isLoading}
          onFocus={handleInputFocus}
        />
      </div>
    </div>
  )
}
