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

  describe('messages array', () => {
    it('starts with welcome message and first question', () => {
      const { result } = renderHook(() => useInterview())
      expect(result.current.messages).toHaveLength(2)
      expect(result.current.messages[0].role).toBe('assistant')
      expect(result.current.messages[0].content).toContain("I'm here to learn")
      expect(result.current.messages[1].role).toBe('assistant')
      expect(result.current.messages[1].content).toContain('brings you')
    })

    it('adds user message and next question when answering', () => {
      const { result } = renderHook(() => useInterview())
      act(() => {
        result.current.answerQuestion('intent', 'specific_project', 'I have a project')
      })
      expect(result.current.messages).toHaveLength(4)
      expect(result.current.messages[2].role).toBe('user')
      expect(result.current.messages[2].content).toBe('I have a project')
      expect(result.current.messages[3].role).toBe('assistant')
    })

    it('adds transition message when entering chat phase', () => {
      const { result } = renderHook(() => useInterview())
      // Answer all 7 structured questions
      const answers = [
        ['intent', 'specific_project'],
        ['role', 'technical'],
        ['ai_maturity', 'going_steady'],
        ['working_style', 'embedded'],
        ['timeline', 'quarter'],
        ['company_size', 'startup'],
        ['industry', 'saas'],
      ]
      for (const [id, value] of answers) {
        act(() => {
          result.current.answerQuestion(id, value)
        })
      }
      const lastMessage = result.current.messages[result.current.messages.length - 1]
      expect(lastMessage.role).toBe('assistant')
      expect(lastMessage.content).toContain('tell me more')
    })

    it('adds budget question when contact collected', () => {
      const { result } = renderHook(() => useInterview())
      // Fast-forward to chat phase
      const answers = [
        ['intent', 'specific_project'],
        ['role', 'technical'],
        ['ai_maturity', 'going_steady'],
        ['working_style', 'embedded'],
        ['timeline', 'quarter'],
        ['company_size', 'startup'],
        ['industry', 'saas'],
      ]
      for (const [id, value] of answers) {
        act(() => {
          result.current.answerQuestion(id, value)
        })
      }
      act(() => {
        result.current.setContactCollected(true)
      })
      const lastMessage = result.current.messages[result.current.messages.length - 1]
      expect(lastMessage.role).toBe('assistant')
      expect(lastMessage.content).toContain('budget')
    })

    it('adds completion message after budget answered', () => {
      const { result } = renderHook(() => useInterview())
      // Fast-forward through all phases
      const answers = [
        ['intent', 'specific_project'],
        ['role', 'technical'],
        ['ai_maturity', 'going_steady'],
        ['working_style', 'embedded'],
        ['timeline', 'quarter'],
        ['company_size', 'startup'],
        ['industry', 'saas'],
      ]
      for (const [id, value] of answers) {
        act(() => {
          result.current.answerQuestion(id, value)
        })
      }
      act(() => {
        result.current.setContactCollected(true)
      })
      act(() => {
        result.current.answerQuestion('budget_range', '50k_150k', '$50k - $150k')
      })
      const lastMessage = result.current.messages[result.current.messages.length - 1]
      expect(lastMessage.role).toBe('assistant')
      expect(lastMessage.content).toContain('reach out')
    })
  })
})
