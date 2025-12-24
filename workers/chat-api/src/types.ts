export interface Env {
  DB: D1Database
  ALLOWED_ORIGIN: string
  MAX_MESSAGES_PER_SESSION: string
  ANTHROPIC_API_KEY: string
  RESEND_API_KEY: string
  NOTIFICATION_EMAIL: string
}

export interface Session {
  id: string
  ip_hash: string
  message_count: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

// Interview answer value types
export type IntentValue = 'specific_project' | 'exploring' | 'existing_system' | 'upskill'
export type RoleValue = 'technical' | 'business' | 'ai_lead' | 'founder'
export type AiMaturityValue = 'first_date' | 'going_steady' | 'committed'
export type WorkingStyleValue = 'full_ownership' | 'embedded' | 'knowledge_transfer'
export type TimelineValue = 'asap' | 'quarter' | 'year' | 'exploring'
export type CompanySizeValue = 'startup' | 'growth' | 'midmarket' | 'enterprise'
export type IndustryValue = 'fintech' | 'ecommerce' | 'saas' | 'professional_services' | 'healthcare' | 'other'
export type BudgetRangeValue = 'under_50k' | '50k_150k' | '150k_500k' | '500k_plus' | 'unsure'
export type LeadTierValue = 'hot' | 'warm' | 'cool' | 'cold'

export interface InterviewAnswers {
  intent?: IntentValue
  role?: RoleValue
  ai_maturity?: AiMaturityValue
  working_style?: WorkingStyleValue
  timeline?: TimelineValue
  company_size?: CompanySizeValue
  industry?: IndustryValue
  budget_range?: BudgetRangeValue
}

export type InterviewPhase = 'structured' | 'chat' | 'post_contact' | 'complete'

export interface Lead {
  id: number
  session_id: string
  name: string | null
  email: string | null
  company: string | null
  project_summary: string | null
  problem: string | null
  vision: string | null
  users: string | null
  capabilities: string | null
  constraints: string | null
  prd_draft: string | null
  // Interview fields
  intent: IntentValue | null
  role: RoleValue | null
  ai_maturity: AiMaturityValue | null
  working_style: WorkingStyleValue | null
  timeline: TimelineValue | null
  company_size: CompanySizeValue | null
  industry: IndustryValue | null
  budget_range: BudgetRangeValue | null
  lead_score: number | null
  lead_tier: LeadTierValue | null
  interview_answers: string | null
  created_at: string
}

export interface ChatRequest {
  message?: string
  sessionId?: string
  phase: InterviewPhase
  structuredAnswer?: {
    questionId: string
    answer: string
  }
  interviewAnswers?: InterviewAnswers
}

export interface ChatResponse {
  message?: string
  sessionId: string
  leadExtracted?: boolean
  leadScore?: number
  leadTier?: LeadTierValue
  nextPhase?: InterviewPhase
}
