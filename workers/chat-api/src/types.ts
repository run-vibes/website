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
  created_at: string
}

export interface ChatRequest {
  message: string
  sessionId?: string
}

export interface ChatResponse {
  message: string
  sessionId: string
  leadExtracted?: boolean
}
