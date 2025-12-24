import type { InterviewAnswers, Message } from './types'

function buildContextFromAnswers(answers: InterviewAnswers): string {
  const parts: string[] = []

  // Intent context
  if (answers.intent === 'specific_project') {
    parts.push('They have a specific AI project in mind.')
  } else if (answers.intent === 'exploring') {
    parts.push("They're exploring what's possible with AI.")
  } else if (answers.intent === 'existing_system') {
    parts.push('They need help with an existing AI system.')
  } else if (answers.intent === 'upskill') {
    parts.push('They want to upskill their team on AI.')
  }

  // Role context
  if (answers.role === 'technical') {
    parts.push('They have a technical background (CTO, VP Eng, or developer).')
  } else if (answers.role === 'business') {
    parts.push('They focus on the business side (CEO, COO, or strategy).')
  } else if (answers.role === 'ai_lead') {
    parts.push('They lead AI or innovation initiatives.')
  } else if (answers.role === 'founder') {
    parts.push("They're a founder building something new.")
  }

  // AI maturity context
  if (answers.ai_maturity === 'first_date') {
    parts.push("Their team is new to AI — they're curious but cautious.")
  } else if (answers.ai_maturity === 'going_steady') {
    parts.push('Their team has some AI experiments working.')
  } else if (answers.ai_maturity === 'committed') {
    parts.push('AI is core to their strategy — they are committed.')
  }

  // Working style context
  if (answers.working_style === 'full_ownership') {
    parts.push('They prefer partners who take full ownership.')
  } else if (answers.working_style === 'embedded') {
    parts.push('They want close collaboration with embedded partnership.')
  } else if (answers.working_style === 'knowledge_transfer') {
    parts.push('They prioritize knowledge transfer — teach them to fish.')
  }

  // Timeline context
  if (answers.timeline === 'asap') {
    parts.push('They want to move ASAP (within weeks).')
  } else if (answers.timeline === 'quarter') {
    parts.push('Their timeline is this quarter.')
  } else if (answers.timeline === 'year') {
    parts.push('Their timeline is this year.')
  } else if (answers.timeline === 'exploring') {
    parts.push("They're just exploring for now.")
  }

  // Company size context
  if (answers.company_size === 'startup') {
    parts.push("They're a startup (1-20 people).")
  } else if (answers.company_size === 'growth') {
    parts.push("They're a growth-stage company (21-100 people).")
  } else if (answers.company_size === 'midmarket') {
    parts.push("They're a mid-market company (101-1000 people).")
  } else if (answers.company_size === 'enterprise') {
    parts.push("They're an enterprise (1000+ people).")
  }

  // Industry context
  const industryMap: Record<string, string> = {
    fintech: 'fintech',
    ecommerce: 'e-commerce',
    saas: 'SaaS',
    professional_services: 'professional services',
    healthcare: 'healthcare',
    other: 'another industry',
  }
  if (answers.industry) {
    parts.push(`They work in ${industryMap[answers.industry] ?? answers.industry}.`)
  }

  return parts.join(' ')
}

function buildSystemPrompt(interviewContext?: string): string {
  const contextSection = interviewContext
    ? `
## What You Know About Them
${interviewContext}

Use this context to personalize your questions and show you've been listening.
`
    : ''

  return `You are a friendly, professional assistant for Vibes, an AI agent development studio. Your goal is to have a natural conversation that helps understand what the visitor is looking to build.

${contextSection}
## Your Objectives
1. Understand their project and business needs
2. Extract enough information to create a mini-PRD
3. Collect their contact information to follow up

## Information to Gather (naturally, not as a checklist)
- **Problem/Opportunity**: What challenge are they facing? What's the current pain?
- **Vision**: What does success look like? What would an ideal solution do?
- **Users**: Who will use this? What are their needs?
- **Key Capabilities**: What must it do? What's nice-to-have?
- **Contact**: Name, company, email

## Conversation Style
- Be warm and conversational, not robotic
- Ask follow-up questions that show you're listening
- Reference what you know about them from the interview
- Share brief, relevant insights when appropriate
- Keep responses concise (2-4 sentences typically)
- Don't ask multiple questions at once

## When You Have Enough Information
When you feel you have a good understanding of their needs AND have their contact info, summarize what you've learned and let them know the team will be in touch. Use the phrase "LEAD_COMPLETE" somewhere in your response (this triggers our system to extract the data).

## Important
- Never make up information about Vibes' capabilities or past work
- If asked about pricing, say you'll connect them with the team who can discuss specifics
- If they seem unsure, help them articulate their needs through questions`
}

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
  newMessage: string,
  interviewAnswers?: InterviewAnswers,
): Promise<string> {
  const interviewContext = interviewAnswers
    ? buildContextFromAnswers(interviewAnswers)
    : undefined
  const systemPrompt = buildSystemPrompt(interviewContext)

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
      system: systemPrompt,
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
