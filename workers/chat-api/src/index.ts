import { callClaude, cleanResponse, isLeadComplete } from './claude'
import { notifyTeam } from './email'
import { extractLeadFromConversation, generatePRDDraft, saveLead } from './leads'
import { calculateLeadScore, getLeadTier } from './scoring'
import {
  checkRateLimit,
  getConversationHistory,
  getOrCreateSession,
  hashIP,
  incrementMessageCount,
  saveMessage,
} from './session'
import type { ChatRequest, ChatResponse, Env, InterviewAnswers, LeadTierValue } from './types'

// In-memory store for interview answers per session
const sessionInterviewAnswers = new Map<string, InterviewAnswers>()

function getCorsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function jsonResponse(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(origin),
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: getCorsHeaders(origin) })
    }

    const url = new URL(request.url)

    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, 200, origin)
    }

    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const body = (await request.json()) as ChatRequest
        const clientIP = request.headers.get('CF-Connecting-IP') ?? 'unknown'
        const ipHash = await hashIP(clientIP)
        const session = await getOrCreateSession(env.DB, body.sessionId, ipHash)

        // Store/update interview answers for this session
        if (body.interviewAnswers) {
          const existing = sessionInterviewAnswers.get(session.id) ?? {}
          sessionInterviewAnswers.set(session.id, { ...existing, ...body.interviewAnswers })
        }

        // Handle structured phase (no Claude call needed)
        if (body.phase === 'structured' && body.structuredAnswer) {
          const answers = sessionInterviewAnswers.get(session.id) ?? {}
          answers[body.structuredAnswer.questionId as keyof InterviewAnswers] = body
            .structuredAnswer.answer as never
          sessionInterviewAnswers.set(session.id, answers)

          const response: ChatResponse = {
            sessionId: session.id,
          }
          return jsonResponse(response, 200, origin)
        }

        // Handle post_contact phase (budget question)
        if (body.phase === 'post_contact' && body.structuredAnswer) {
          const answers = sessionInterviewAnswers.get(session.id) ?? {}
          answers[body.structuredAnswer.questionId as keyof InterviewAnswers] = body
            .structuredAnswer.answer as never
          sessionInterviewAnswers.set(session.id, answers)

          const score = calculateLeadScore(answers)
          const tier = getLeadTier(score)

          const response: ChatResponse = {
            sessionId: session.id,
            leadScore: score,
            leadTier: tier,
            nextPhase: 'complete',
          }
          return jsonResponse(response, 200, origin)
        }

        // Chat phase - requires message
        if (!body.message?.trim()) {
          return jsonResponse({ error: 'Message is required' }, 400, origin)
        }

        const maxMessagesPerSession = Number.parseInt(env.MAX_MESSAGES_PER_SESSION, 10) || 20
        const { allowed } = await checkRateLimit(env.DB, session.id, maxMessagesPerSession)

        if (!allowed) {
          return jsonResponse(
            {
              error: 'Message limit reached for this session',
              message:
                "Thanks for your interest! You've reached the message limit. Please email us at hello@vibes.run to continue the conversation.",
              sessionId: session.id,
            },
            200,
            origin,
          )
        }

        await saveMessage(env.DB, session.id, 'user', body.message)
        await incrementMessageCount(env.DB, session.id)

        const history = await getConversationHistory(env.DB, session.id)
        const interviewAnswers = sessionInterviewAnswers.get(session.id)
        const response = await callClaude(
          env.ANTHROPIC_API_KEY,
          history,
          body.message,
          interviewAnswers,
        )

        await saveMessage(env.DB, session.id, 'assistant', response)

        let leadExtracted = false
        let leadScore: number | undefined
        let leadTier: LeadTierValue | undefined

        if (isLeadComplete(response)) {
          try {
            const lead = await extractLeadFromConversation(
              env.ANTHROPIC_API_KEY,
              await getConversationHistory(env.DB, session.id),
            )

            const prdDraft = generatePRDDraft(lead)
            const result = await saveLead(env.DB, session.id, lead, prdDraft, interviewAnswers)
            leadScore = result.score
            leadTier = result.tier as LeadTierValue

            if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
              await notifyTeam(env.RESEND_API_KEY, env.NOTIFICATION_EMAIL, lead, prdDraft, {
                interviewAnswers,
                leadScore,
                leadTier,
              })
            }

            leadExtracted = true
          } catch (err) {
            console.error('Lead extraction failed:', err)
          }
        }

        const chatResponse: ChatResponse = {
          message: cleanResponse(response),
          sessionId: session.id,
          leadExtracted,
          leadScore,
          leadTier,
          nextPhase: leadExtracted ? 'post_contact' : undefined,
        }

        return jsonResponse(chatResponse, 200, origin)
      } catch (err) {
        console.error('Chat error:', err)
        return jsonResponse(
          { error: 'Internal server error', message: 'Something went wrong. Please try again.' },
          500,
          origin,
        )
      }
    }

    return new Response('Not found', { status: 404 })
  },
}
