import type { Message } from './types'

interface ExtractedLead {
  name: string | null
  email: string | null
  company: string | null
  projectSummary: string | null
  problem: string | null
  vision: string | null
  users: string | null
  capabilities: string | null
  constraints: string | null
}

export async function extractLeadFromConversation(
  apiKey: string,
  conversationHistory: Message[]
): Promise<ExtractedLead> {
  const conversationText = conversationHistory
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n')

  const extractionPrompt = `Analyze this conversation and extract the following information. Return a JSON object with these fields (use null if not mentioned):

{
  "name": "visitor's name",
  "email": "visitor's email",
  "company": "visitor's company",
  "projectSummary": "1-2 sentence summary of what they want to build",
  "problem": "the challenge or pain point they're trying to solve",
  "vision": "what success looks like for them",
  "users": "who will use the solution",
  "capabilities": "key features or capabilities needed",
  "constraints": "timeline, budget, technical requirements, or integrations mentioned"
}

CONVERSATION:
${conversationText}

Return ONLY the JSON object, no other text.`

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
      messages: [{ role: 'user', content: extractionPrompt }],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to extract lead data')
  }

  const data = (await response.json()) as { content: Array<{ text: string }> }
  const text = data.content[0]?.text ?? '{}'

  try {
    return JSON.parse(text) as ExtractedLead
  } catch {
    console.error('Failed to parse lead extraction:', text)
    return {
      name: null,
      email: null,
      company: null,
      projectSummary: null,
      problem: null,
      vision: null,
      users: null,
      capabilities: null,
      constraints: null,
    }
  }
}

export function generatePRDDraft(lead: ExtractedLead): string {
  const sections: string[] = []

  sections.push('# Project Requirements Draft\n')
  sections.push(`*Generated from conversation on ${new Date().toLocaleDateString()}*\n`)

  if (lead.projectSummary) {
    sections.push('## Overview\n')
    sections.push(lead.projectSummary + '\n')
  }

  if (lead.problem) {
    sections.push('## Problem Statement\n')
    sections.push(lead.problem + '\n')
  }

  if (lead.vision) {
    sections.push('## Vision / Success Criteria\n')
    sections.push(lead.vision + '\n')
  }

  if (lead.users) {
    sections.push('## Target Users\n')
    sections.push(lead.users + '\n')
  }

  if (lead.capabilities) {
    sections.push('## Key Capabilities\n')
    sections.push(lead.capabilities + '\n')
  }

  if (lead.constraints) {
    sections.push('## Constraints & Requirements\n')
    sections.push(lead.constraints + '\n')
  }

  sections.push('## Contact Information\n')
  sections.push(`- **Name:** ${lead.name ?? 'Not provided'}`)
  sections.push(`- **Email:** ${lead.email ?? 'Not provided'}`)
  sections.push(`- **Company:** ${lead.company ?? 'Not provided'}`)

  return sections.join('\n')
}

export async function saveLead(
  db: D1Database,
  sessionId: string,
  lead: ExtractedLead,
  prdDraft: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO leads (session_id, name, email, company, project_summary, problem, vision, users, capabilities, constraints, prd_draft)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(session_id) DO UPDATE SET
         name = excluded.name,
         email = excluded.email,
         company = excluded.company,
         project_summary = excluded.project_summary,
         problem = excluded.problem,
         vision = excluded.vision,
         users = excluded.users,
         capabilities = excluded.capabilities,
         constraints = excluded.constraints,
         prd_draft = excluded.prd_draft`
    )
    .bind(
      sessionId,
      lead.name,
      lead.email,
      lead.company,
      lead.projectSummary,
      lead.problem,
      lead.vision,
      lead.users,
      lead.capabilities,
      lead.constraints,
      prdDraft
    )
    .run()
}
