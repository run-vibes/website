import { describe, expect, it } from 'vitest'
import { calculateLeadScore, getLeadTier } from './scoring'
import type { InterviewAnswers } from './types'

describe('calculateLeadScore', () => {
  it('returns 0 for empty answers', () => {
    expect(calculateLeadScore({})).toBe(0)
  })

  it('scores timeline correctly', () => {
    expect(calculateLeadScore({ timeline: 'asap' })).toBe(3)
    expect(calculateLeadScore({ timeline: 'quarter' })).toBe(2)
    expect(calculateLeadScore({ timeline: 'year' })).toBe(1)
    expect(calculateLeadScore({ timeline: 'exploring' })).toBe(0)
  })

  it('scores budget correctly', () => {
    expect(calculateLeadScore({ budget_range: '500k_plus' })).toBe(3)
    expect(calculateLeadScore({ budget_range: '150k_500k' })).toBe(2)
    expect(calculateLeadScore({ budget_range: '50k_150k' })).toBe(1)
    expect(calculateLeadScore({ budget_range: 'under_50k' })).toBe(0)
    expect(calculateLeadScore({ budget_range: 'unsure' })).toBe(0)
  })

  it('scores intent correctly', () => {
    expect(calculateLeadScore({ intent: 'specific_project' })).toBe(3)
    expect(calculateLeadScore({ intent: 'existing_system' })).toBe(2)
    expect(calculateLeadScore({ intent: 'upskill' })).toBe(1)
    expect(calculateLeadScore({ intent: 'exploring' })).toBe(0)
  })

  it('scores ai_maturity correctly', () => {
    expect(calculateLeadScore({ ai_maturity: 'committed' })).toBe(2)
    expect(calculateLeadScore({ ai_maturity: 'going_steady' })).toBe(1)
    expect(calculateLeadScore({ ai_maturity: 'first_date' })).toBe(0)
  })

  it('scores company_size correctly', () => {
    expect(calculateLeadScore({ company_size: 'enterprise' })).toBe(2)
    expect(calculateLeadScore({ company_size: 'midmarket' })).toBe(1)
    expect(calculateLeadScore({ company_size: 'growth' })).toBe(0)
    expect(calculateLeadScore({ company_size: 'startup' })).toBe(0)
  })

  it('combines all scores correctly', () => {
    const hotLead: InterviewAnswers = {
      timeline: 'asap',
      budget_range: '500k_plus',
      intent: 'specific_project',
      ai_maturity: 'committed',
      company_size: 'enterprise',
    }
    expect(calculateLeadScore(hotLead)).toBe(13) // 3+3+3+2+2
  })
})

describe('getLeadTier', () => {
  it('returns hot for score >= 12', () => {
    expect(getLeadTier(12)).toBe('hot')
    expect(getLeadTier(13)).toBe('hot')
  })

  it('returns warm for score 8-11', () => {
    expect(getLeadTier(8)).toBe('warm')
    expect(getLeadTier(11)).toBe('warm')
  })

  it('returns cool for score 4-7', () => {
    expect(getLeadTier(4)).toBe('cool')
    expect(getLeadTier(7)).toBe('cool')
  })

  it('returns cold for score < 4', () => {
    expect(getLeadTier(0)).toBe('cold')
    expect(getLeadTier(3)).toBe('cold')
  })
})
