import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useInterview } from './useInterview'

describe('useInterview', () => {
  it('starts at question 0 in structured phase', () => {
    const { result } = renderHook(() => useInterview())
    expect(result.current.phase).toBe('structured')
    expect(result.current.currentQuestionIndex).toBe(0)
  })

  it('advances to next question on answer', () => {
    const { result } = renderHook(() => useInterview())
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    expect(result.current.currentQuestionIndex).toBe(1)
    expect(result.current.answers.intent).toBe('specific_project')
  })

  it('transitions to chat phase after all structured questions', () => {
    const { result } = renderHook(() => useInterview())
    // Answer all 7 structured questions
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    act(() => {
      result.current.answerQuestion('role', 'technical')
    })
    act(() => {
      result.current.answerQuestion('ai_maturity', 'going_steady')
    })
    act(() => {
      result.current.answerQuestion('working_style', 'embedded')
    })
    act(() => {
      result.current.answerQuestion('timeline', 'quarter')
    })
    act(() => {
      result.current.answerQuestion('company_size', 'startup')
    })
    act(() => {
      result.current.answerQuestion('industry', 'saas')
    })
    expect(result.current.phase).toBe('chat')
  })

  it('transitions to post_contact when contact collected', () => {
    const { result } = renderHook(() => useInterview())
    // Fast-forward to chat phase
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    act(() => {
      result.current.answerQuestion('role', 'technical')
    })
    act(() => {
      result.current.answerQuestion('ai_maturity', 'going_steady')
    })
    act(() => {
      result.current.answerQuestion('working_style', 'embedded')
    })
    act(() => {
      result.current.answerQuestion('timeline', 'quarter')
    })
    act(() => {
      result.current.answerQuestion('company_size', 'startup')
    })
    act(() => {
      result.current.answerQuestion('industry', 'saas')
    })
    act(() => {
      result.current.setContactCollected(true)
    })
    expect(result.current.phase).toBe('post_contact')
  })

  it('transitions to complete after budget answered', () => {
    const { result } = renderHook(() => useInterview())
    // Fast-forward through all phases
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    act(() => {
      result.current.answerQuestion('role', 'technical')
    })
    act(() => {
      result.current.answerQuestion('ai_maturity', 'going_steady')
    })
    act(() => {
      result.current.answerQuestion('working_style', 'embedded')
    })
    act(() => {
      result.current.answerQuestion('timeline', 'quarter')
    })
    act(() => {
      result.current.answerQuestion('company_size', 'startup')
    })
    act(() => {
      result.current.answerQuestion('industry', 'saas')
    })
    act(() => {
      result.current.setContactCollected(true)
    })
    act(() => {
      result.current.answerQuestion('budget_range', '50k_150k')
    })
    expect(result.current.phase).toBe('complete')
    expect(result.current.answers.budget_range).toBe('50k_150k')
  })

  it('returns current question', () => {
    const { result } = renderHook(() => useInterview())
    expect(result.current.currentQuestion?.id).toBe('intent')
  })

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useInterview())
    expect(result.current.progress).toEqual({ current: 0, total: 7 })
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    expect(result.current.progress).toEqual({ current: 1, total: 7 })
  })
})
