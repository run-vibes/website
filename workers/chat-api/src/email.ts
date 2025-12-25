import type { InterviewAnswers, LeadTierValue } from './types'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(apiKey: string, options: EmailOptions): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Vibes Lead Bot <leads@vibes.run>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Resend error:', error)
    throw new Error(`Failed to send email: ${response.status}`)
  }
}

// Label maps for human-readable display
const INTENT_LABELS: Record<string, string> = {
  specific_project: 'Specific project in mind',
  exploring: 'Exploring possibilities',
  existing_system: 'Help with existing AI',
  upskill: 'Team upskilling',
}

const ROLE_LABELS: Record<string, string> = {
  technical: 'Technical (CTO/VP Eng/Dev)',
  business: 'Business (CEO/COO/Strategy)',
  ai_lead: 'AI/Innovation Lead',
  founder: 'Founder',
}

const AI_MATURITY_LABELS: Record<string, string> = {
  first_date: 'First date — curious',
  going_steady: 'Going steady — experimenting',
  committed: 'Committed — AI is core',
}

const WORKING_STYLE_LABELS: Record<string, string> = {
  full_ownership: 'Full ownership',
  embedded: 'Embedded partnership',
  knowledge_transfer: 'Knowledge transfer',
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: 'ASAP (weeks)',
  quarter: 'This quarter',
  year: 'This year',
  exploring: 'Just exploring',
}

const COMPANY_SIZE_LABELS: Record<string, string> = {
  startup: 'Startup (1-20)',
  growth: 'Growth (21-100)',
  midmarket: 'Mid-market (101-1000)',
  enterprise: 'Enterprise (1000+)',
}

const INDUSTRY_LABELS: Record<string, string> = {
  fintech: 'Fintech',
  ecommerce: 'E-commerce',
  saas: 'SaaS',
  professional_services: 'Professional Services',
  healthcare: 'Healthcare',
  other: 'Other',
}

const BUDGET_LABELS: Record<string, string> = {
  under_50k: 'Under $50k',
  '50k_150k': '$50k – $150k',
  '150k_500k': '$150k – $500k',
  '500k_plus': '$500k+',
  unsure: 'Not sure yet',
}

const TIER_EMOJI: Record<LeadTierValue, string> = {
  hot: '🔥',
  warm: '🌡️',
  cool: '❄️',
  cold: '🧊',
}

function formatInterviewSection(answers: InterviewAnswers): string {
  const rows: string[] = []

  if (answers.intent)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Intent</td><td style="padding:4px 8px;">${INTENT_LABELS[answers.intent] ?? answers.intent}</td></tr>`,
    )
  if (answers.role)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Role</td><td style="padding:4px 8px;">${ROLE_LABELS[answers.role] ?? answers.role}</td></tr>`,
    )
  if (answers.ai_maturity)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">AI Maturity</td><td style="padding:4px 8px;">${AI_MATURITY_LABELS[answers.ai_maturity] ?? answers.ai_maturity}</td></tr>`,
    )
  if (answers.working_style)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Working Style</td><td style="padding:4px 8px;">${WORKING_STYLE_LABELS[answers.working_style] ?? answers.working_style}</td></tr>`,
    )
  if (answers.timeline)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Timeline</td><td style="padding:4px 8px;">${TIMELINE_LABELS[answers.timeline] ?? answers.timeline}</td></tr>`,
    )
  if (answers.company_size)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Company Size</td><td style="padding:4px 8px;">${COMPANY_SIZE_LABELS[answers.company_size] ?? answers.company_size}</td></tr>`,
    )
  if (answers.industry)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Industry</td><td style="padding:4px 8px;">${INDUSTRY_LABELS[answers.industry] ?? answers.industry}</td></tr>`,
    )
  if (answers.budget_range)
    rows.push(
      `<tr><td style="color:#64748b;padding:4px 8px;">Budget</td><td style="padding:4px 8px;">${BUDGET_LABELS[answers.budget_range] ?? answers.budget_range}</td></tr>`,
    )

  if (rows.length === 0) return ''

  return `
    <div class="section">
      <div class="label">Interview Profile</div>
      <table style="width:100%;border-collapse:collapse;">
        ${rows.join('')}
      </table>
    </div>
  `
}

export function formatLeadEmail(
  lead: {
    name: string | null
    email: string | null
    company: string | null
    projectSummary: string | null
  },
  prdDraft: string,
  options?: {
    interviewAnswers?: InterviewAnswers
    leadScore?: number
    leadTier?: LeadTierValue
    conversationUrl?: string
  },
): string {
  const tierEmoji = options?.leadTier ? TIER_EMOJI[options.leadTier] : ''
  const tierLabel = options?.leadTier
    ? options.leadTier.charAt(0).toUpperCase() + options.leadTier.slice(1)
    : ''
  const scoreSection =
    options?.leadScore !== undefined
      ? `<div style="background:#f0fdf4;border:1px solid #22c55e;padding:12px;border-radius:8px;margin-bottom:20px;">
        <strong>${tierEmoji} ${tierLabel} Lead</strong> (Score: ${options.leadScore}/13)
      </div>`
      : ''

  const interviewSection = options?.interviewAnswers
    ? formatInterviewSection(options.interviewAnswers)
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .section { margin-bottom: 20px; }
    .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
    .value { font-size: 16px; margin-top: 4px; }
    .prd { background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-family: monospace; font-size: 13px; }
    .footer { padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 20px;">New Lead from Vibes Chat</h1>
    </div>
    <div class="content">
      ${scoreSection}

      <div class="section">
        <div class="label">Contact</div>
        <div class="value">
          <strong>${lead.name ?? 'Name not provided'}</strong><br>
          ${lead.email ? `<a href="mailto:${lead.email}">${lead.email}</a>` : 'Email not provided'}<br>
          ${lead.company ?? 'Company not provided'}
        </div>
      </div>

      ${interviewSection}

      <div class="section">
        <div class="label">Project Summary</div>
        <div class="value">${lead.projectSummary ?? 'Not captured'}</div>
      </div>

      <div class="section">
        <div class="label">Generated PRD Draft</div>
        <div class="prd">${prdDraft.replace(/\n/g, '<br>')}</div>
      </div>

      ${
        options?.conversationUrl
          ? `
      <div class="section">
        <a href="${options.conversationUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Full Conversation</a>
      </div>
      `
          : ''
      }
    </div>
    <div class="footer">
      This lead was captured via the Vibes website chat.
    </div>
  </div>
</body>
</html>
`
}

function truncate(text: string | null, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export async function notifyTeam(
  resendApiKey: string,
  notificationEmail: string,
  lead: {
    name: string | null
    email: string | null
    company: string | null
    projectSummary: string | null
  },
  prdDraft: string,
  options?: {
    interviewAnswers?: InterviewAnswers
    leadScore?: number
    leadTier?: LeadTierValue
  },
): Promise<void> {
  const sender = lead.company ?? lead.name ?? 'Unknown'
  const summary = truncate(lead.projectSummary, 50) || 'New inquiry'
  const tierEmoji = options?.leadTier ? TIER_EMOJI[options.leadTier] : ''
  const subject = `${tierEmoji} New Lead: ${sender} — ${summary}`

  await sendEmail(resendApiKey, {
    to: notificationEmail,
    subject,
    html: formatLeadEmail(lead, prdDraft, options),
  })
}
