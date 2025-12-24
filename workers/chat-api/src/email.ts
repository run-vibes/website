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

export function formatLeadEmail(
  lead: {
    name: string | null
    email: string | null
    company: string | null
    projectSummary: string | null
  },
  prdDraft: string,
  conversationUrl?: string,
): string {
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
    .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
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
      <div class="section">
        <div class="label">Contact</div>
        <div class="value">
          <strong>${lead.name ?? 'Name not provided'}</strong><br>
          ${lead.email ? `<a href="mailto:${lead.email}">${lead.email}</a>` : 'Email not provided'}<br>
          ${lead.company ?? 'Company not provided'}
        </div>
      </div>

      <div class="section">
        <div class="label">Project Summary</div>
        <div class="value">${lead.projectSummary ?? 'Not captured'}</div>
      </div>

      <div class="section">
        <div class="label">Generated PRD Draft</div>
        <div class="prd">${prdDraft.replace(/\n/g, '<br>')}</div>
      </div>

      ${
        conversationUrl
          ? `
      <div class="section">
        <a href="${conversationUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Full Conversation</a>
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
): Promise<void> {
  const sender = lead.company ?? lead.name ?? 'Unknown'
  const summary = truncate(lead.projectSummary, 50) || 'New inquiry'
  const subject = `New Lead: ${sender} — ${summary}`

  await sendEmail(resendApiKey, {
    to: notificationEmail,
    subject,
    html: formatLeadEmail(lead, prdDraft),
  })
}
