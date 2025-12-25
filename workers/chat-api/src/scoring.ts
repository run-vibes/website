import type { InterviewAnswers, LeadTierValue } from './types'

export function calculateLeadScore(answers: InterviewAnswers): number {
  let score = 0

  // Timeline (max 3)
  if (answers.timeline === 'asap') score += 3
  else if (answers.timeline === 'quarter') score += 2
  else if (answers.timeline === 'year') score += 1

  // Budget (max 3)
  if (answers.budget_range === '500k_plus') score += 3
  else if (answers.budget_range === '150k_500k') score += 2
  else if (answers.budget_range === '50k_150k') score += 1

  // Intent (max 3)
  if (answers.intent === 'specific_project') score += 3
  else if (answers.intent === 'existing_system') score += 2
  else if (answers.intent === 'upskill') score += 1

  // AI Maturity (max 2)
  if (answers.ai_maturity === 'committed') score += 2
  else if (answers.ai_maturity === 'going_steady') score += 1

  // Company Size (max 2)
  if (answers.company_size === 'enterprise') score += 2
  else if (answers.company_size === 'midmarket') score += 1

  return score
}

export function getLeadTier(score: number): LeadTierValue {
  if (score >= 12) return 'hot'
  if (score >= 8) return 'warm'
  if (score >= 4) return 'cool'
  return 'cold'
}
