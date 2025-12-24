import { useCallback, useMemo, useState } from 'react'
import {
  type InterviewQuestion,
  getPostContactQuestions,
  getStructuredQuestions,
} from '../config/questions'

export interface InterviewAnswers {
  [key: string]: string
}

export type InterviewPhase = 'structured' | 'chat' | 'post_contact' | 'complete'

interface UseInterviewReturn {
  phase: InterviewPhase
  currentQuestionIndex: number
  currentQuestion: InterviewQuestion | undefined
  answers: InterviewAnswers
  progress: { current: number; total: number }
  contactCollected: boolean
  answerQuestion: (questionId: string, value: string) => void
  setContactCollected: (collected: boolean) => void
}

export function useInterview(): UseInterviewReturn {
  const [phase, setPhase] = useState<InterviewPhase>('structured')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<InterviewAnswers>({})
  const [contactCollected, setContactCollectedState] = useState(false)

  const structuredQuestions = useMemo(() => getStructuredQuestions(), [])
  const postContactQuestions = useMemo(() => getPostContactQuestions(), [])

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
    (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }))

      if (phase === 'structured') {
        const nextIndex = currentQuestionIndex + 1
        if (nextIndex >= structuredQuestions.length) {
          setPhase('chat')
        } else {
          setCurrentQuestionIndex(nextIndex)
        }
      } else if (phase === 'post_contact' && questionId === 'budget_range') {
        setPhase('complete')
      }
    },
    [phase, currentQuestionIndex, structuredQuestions.length],
  )

  const setContactCollected = useCallback((collected: boolean) => {
    setContactCollectedState(collected)
    if (collected) {
      setPhase('post_contact')
    }
  }, [])

  return {
    phase,
    currentQuestionIndex,
    currentQuestion,
    answers,
    progress,
    contactCollected,
    answerQuestion,
    setContactCollected,
  }
}
