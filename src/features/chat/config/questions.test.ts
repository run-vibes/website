import { describe, expect, it } from 'vitest'
import {
  INTERVIEW_QUESTIONS,
  getQuestionById,
  getResponseStarters,
  getStructuredQuestions,
} from './questions'

describe('INTERVIEW_QUESTIONS', () => {
  it('has 8 questions total', () => {
    expect(INTERVIEW_QUESTIONS).toHaveLength(8)
  })

  it('has correct question IDs', () => {
    const ids = INTERVIEW_QUESTIONS.map((q) => q.id)
    expect(ids).toEqual([
      'intent',
      'role',
      'ai_maturity',
      'working_style',
      'timeline',
      'company_size',
      'industry',
      'budget_range',
    ])
  })

  it('each question has required fields', () => {
    for (const q of INTERVIEW_QUESTIONS) {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('options')
      expect(q.options.length).toBeGreaterThanOrEqual(3)
      for (const opt of q.options) {
        expect(opt).toHaveProperty('value')
        expect(opt).toHaveProperty('label')
      }
    }
  })
})

describe('getQuestionById', () => {
  it('returns question for valid ID', () => {
    const q = getQuestionById('intent')
    expect(q?.question).toContain('brings you')
  })

  it('returns undefined for invalid ID', () => {
    expect(getQuestionById('invalid')).toBeUndefined()
  })
})

describe('getStructuredQuestions', () => {
  it('returns first 7 questions (excludes budget)', () => {
    const structured = getStructuredQuestions()
    expect(structured).toHaveLength(7)
    expect(structured.map((q) => q.id)).not.toContain('budget_range')
  })
})

describe('getResponseStarters', () => {
  it('returns starters for problem prompt', () => {
    const starters = getResponseStarters('problem')
    expect(starters.length).toBeGreaterThan(0)
    expect(starters[0]).toContain('...')
  })
})
