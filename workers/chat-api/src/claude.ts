import type { Message } from './types'

const SYSTEM_PROMPT = `You are a friendly, professional assistant for Vibes, an AI agent development studio. Your goal is to have a natural conversation that helps understand what the visitor is looking to build.

## Your Objectives
1. Understand their project and business needs
2. Extract enough information to create a mini-PRD
3. Collect their contact information to follow up

## Information to Gather (naturally, not as a checklist)
- **Problem/Opportunity**: What challenge are they facing? What's the current pain?
- **Vision**: What does success look like? What would an ideal solution do?
- **Users**: Who will use this? What are their needs?
- **Key Capabilities**: What must it do? What's nice-to-have?
- **Constraints**: Timeline, budget range, technical requirements, integrations?
- **Contact**: Name, company, email

## Conversation Style
- Be warm and conversational, not robotic
- Ask follow-up questions that show you're listening
- Share brief, relevant insights when appropriate
- Keep responses concise (2-4 sentences typically)
- Don't ask multiple questions at once

## When You Have Enough Information
When you feel you have a good understanding of their needs AND have their contact info, summarize what you've learned and let them know the team will be in touch. Use the phrase "LEAD_COMPLETE" somewhere in your response (this triggers our system to extract the data).

## Important
- Never make up information about Vibes' capabilities or past work
- If asked about pricing, say you'll connect them with the team who can discuss specifics
- If they seem unsure, help them articulate their needs through questions`

interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeResponse {
  content: Array<{ type: 'text'; text: string }>
}

export async function callClaude(
  apiKey: string,
  conversationHistory: Message[],
  newMessage: string
): Promise<string> {
  const messages: ClaudeMessage[] = conversationHistory
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

  messages.push({ role: 'user', content: newMessage })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${error}`)
  }

  const data = (await response.json()) as ClaudeResponse
  return (
    data.content[0]?.text ??
    'I apologize, but I had trouble generating a response. Could you try again?'
  )
}

export function isLeadComplete(response: string): boolean {
  return response.includes('LEAD_COMPLETE')
}

export function cleanResponse(response: string): string {
  return response.replace(/LEAD_COMPLETE/g, '').trim()
}
