import { useCallback, useMemo, useState } from 'react'
import {
  type InterviewQuestion,
  getPostContactQuestions,
  getStructuredQuestions,
} from '../config/questions'

export interface InterviewMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface InterviewAnswers {
  [key: string]: string
}

export type InterviewPhase = 'structured' | 'chat' | 'post_contact' | 'complete'

interface UseInterviewReturn {
  phase: InterviewPhase
  currentQuestionIndex: number
  currentQuestion: InterviewQuestion | undefined
  answers: InterviewAnswers
  messages: InterviewMessage[]
  progress: { current: number; total: number }
  contactCollected: boolean
  answerQuestion: (questionId: string, value: string, displayText?: string) => void
  setContactCollected: (collected: boolean) => void
}

/** Create the initial welcome message and first question */
function createInitialMessages(firstQuestion: InterviewQuestion): InterviewMessage[] {
  return [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hey! I'm here to learn about what you're building. Let me ask a few quick questions to understand how we can help.",
      timestamp: new Date(),
    },
    {
      id: `q-${firstQuestion.id}`,
      role: 'assistant',
      content: firstQuestion.question,
      timestamp: new Date(),
    },
  ]
}

export function useInterview(): UseInterviewReturn {
  const structuredQuestions = useMemo(() => getStructuredQuestions(), [])
  const postContactQuestions = useMemo(() => getPostContactQuestions(), [])

  const [phase, setPhase] = useState<InterviewPhase>('structured')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<InterviewAnswers>({})
  const [contactCollected, setContactCollectedState] = useState(false)
  const [messages, setMessages] = useState<InterviewMessage[]>(() =>
    createInitialMessages(structuredQuestions[0]),
  )

  const currentQuestion = useMemo(() => {
    if (phase === 'structured') {
      return structuredQuestions[currentQuestionIndex]
    }
    if (phase === 'post_contact') {
      return postContactQuestions[0] // Budget question
    }
    return undefined
  }, [phase, currentQuestionIndex, structuredQuestions, postContactQuestions])

  const progress = useMemo(
    () => ({
      current: currentQuestionIndex,
      total: structuredQuestions.length,
    }),
    [currentQuestionIndex, structuredQuestions.length],
  )

  const answerQuestion = useCallback(
    (questionId: string, value: string, displayText?: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }))

      // Add user's answer as a message
      const userMessage: InterviewMessage = {
        id: `a-${questionId}-${Date.now()}`,
        role: 'user',
        content: displayText || value,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      if (phase === 'structured') {
        const nextIndex = currentQuestionIndex + 1
        if (nextIndex >= structuredQuestions.length) {
          // Transition to chat phase - add transition message
          const transitionMessage: InterviewMessage = {
            id: 'transition-to-chat',
            role: 'assistant',
            content:
              "Thanks for sharing! Now tell me more about what you're working on. What's the main challenge you're trying to solve?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, transitionMessage])
          setPhase('chat')
        } else {
          // Add next question as a message
          const nextQuestion = structuredQuestions[nextIndex]
          const questionMessage: InterviewMessage = {
            id: `q-${nextQuestion.id}`,
            role: 'assistant',
            content: nextQuestion.question,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, questionMessage])
          setCurrentQuestionIndex(nextIndex)
        }
      } else if (phase === 'post_contact' && questionId === 'budget_range') {
        // Add completion message
        const completionMessage: InterviewMessage = {
          id: 'completion',
          role: 'assistant',
          content:
            'Thanks for sharing your vision! A member of the Vibes team will reach out within 24 hours to discuss next steps.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, completionMessage])
        setPhase('complete')
      }
    },
    [phase, currentQuestionIndex, structuredQuestions],
  )

  const setContactCollected = useCallback(
    (collected: boolean) => {
      setContactCollectedState(collected)
      if (collected && phase === 'chat') {
        // Add budget question as a message
        const budgetQuestion = postContactQuestions[0]
        const questionMessage: InterviewMessage = {
          id: `q-${budgetQuestion.id}`,
          role: 'assistant',
          content: budgetQuestion.question,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, questionMessage])
        setPhase('post_contact')
      }
    },
    [phase, postContactQuestions],
  )

  return {
    phase,
    currentQuestionIndex,
    currentQuestion,
    answers,
    messages,
    progress,
    contactCollected,
    answerQuestion,
    setContactCollected,
  }
}
