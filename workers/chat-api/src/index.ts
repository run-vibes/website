import type { Env, ChatRequest, ChatResponse } from './types'
import {
  getOrCreateSession,
  incrementMessageCount,
  saveMessage,
  getConversationHistory,
  checkRateLimit,
  hashIP,
} from './session'
import { callClaude, isLeadComplete, cleanResponse } from './claude'
import { extractLeadFromConversation, generatePRDDraft, saveLead } from './leads'
import { notifyTeam } from './email'

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

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: getCorsHeaders(origin) })
    }

    const url = new URL(request.url)

    // Health check
    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, 200, origin)
    }

    // Chat endpoint
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const body = (await request.json()) as ChatRequest

        if (!body.message?.trim()) {
          return jsonResponse({ error: 'Message is required' }, 400, origin)
        }

        // Get client IP for session management
        const clientIP = request.headers.get('CF-Connecting-IP') ?? 'unknown'
        const ipHash = hashIP(clientIP)

        // Get or create session
        const session = await getOrCreateSession(env.DB, body.sessionId, ipHash)

        // Check rate limit
        const maxMessages = parseInt(env.MAX_MESSAGES_PER_SESSION, 10) || 20
        const { allowed } = await checkRateLimit(env.DB, session.id, maxMessages)

        if (!allowed) {
          return jsonResponse(
            {
              error: 'Message limit reached for this session',
              message:
                "Thanks for your interest! You've reached the message limit. Please email us at hello@vibes.run to continue the conversation.",
              sessionId: session.id,
            },
            200,
            origin
          )
        }

        // Save user message
        await saveMessage(env.DB, session.id, 'user', body.message)
        await incrementMessageCount(env.DB, session.id)

        // Get conversation history
        const history = await getConversationHistory(env.DB, session.id)

        // Call Claude
        const response = await callClaude(env.ANTHROPIC_API_KEY, history, body.message)

        // Save assistant response
        await saveMessage(env.DB, session.id, 'assistant', response)

        // Check if lead is complete
        let leadExtracted = false
        if (isLeadComplete(response)) {
          try {
            // Extract lead data
            const lead = await extractLeadFromConversation(
              env.ANTHROPIC_API_KEY,
              await getConversationHistory(env.DB, session.id)
            )

            // Generate PRD draft
            const prdDraft = generatePRDDraft(lead)

            // Save lead to database
            await saveLead(env.DB, session.id, lead, prdDraft)

            // Send notification email
            if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
              await notifyTeam(env.RESEND_API_KEY, env.NOTIFICATION_EMAIL, lead, prdDraft)
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
        }

        return jsonResponse(chatResponse, 200, origin)
      } catch (err) {
        console.error('Chat error:', err)
        return jsonResponse(
          { error: 'Internal server error', message: 'Something went wrong. Please try again.' },
          500,
          origin
        )
      }
    }

    return new Response('Not found', { status: 404 })
  },
}
