# Interview-Style Contact Chat Design

Transform the contact chat from freeform conversation into a structured interview with creative multiple choice questions that adapts to who you're talking to.

## Design Goals

1. **Structured, comparable leads** — Extract consistent data for qualification and scoring
2. **Engaging experience** — Personality quiz energy, not a boring form
3. **Adaptive paths** — Tailor the interview based on who they are and what they need
4. **Seamless handoff** — Transition naturally from structured questions to conversational discovery

## Interview Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. OPENER (2 questions)                                        │
│     → Intent: What brings you here?                             │
│     → Role: What's your perspective?                            │
├─────────────────────────────────────────────────────────────────┤
│  2. PERSONALITY (2 questions)                                   │
│     → AI Relationship: Where's your team at with AI?            │
│     → Working Style: How do you like to partner?                │
├─────────────────────────────────────────────────────────────────┤
│  3. QUALIFICATION (3 questions)                                 │
│     → Timeline: When are you looking to move?                   │
│     → Company Size: How big is your organization?               │
│     → Industry: What space are you in?                          │
├─────────────────────────────────────────────────────────────────┤
│  4. HYBRID CHAT                                                 │
│     → Claude takes over with full context                       │
│     → Suggested response starters reduce friction               │
│     → Explores problem, vision, capabilities conversationally   │
│     → Claude naturally collects contact info                    │
├─────────────────────────────────────────────────────────────────┤
│  5. POST-CONTACT                                                │
│     → Budget range question (after commitment)                  │
│     → Summary + next steps                                      │
└─────────────────────────────────────────────────────────────────┘
```

All structured questions use **visual card selection** for a cohesive, premium feel.

## Structured Questions

### Opener Questions

**Q1 — Intent:** *"What brings you to Vibes today?"*

| Icon | Value | Label |
|------|-------|-------|
| 🎯 | `specific_project` | I have a specific AI project in mind |
| 🔍 | `exploring` | I'm exploring what's possible with AI |
| 🔧 | `existing_system` | I need help with an existing AI system |
| 🎓 | `upskill` | I want to upskill my team |

**Q2 — Role:** *"What's your perspective on this?"*

| Icon | Value | Label |
|------|-------|-------|
| ⚙️ | `technical` | Technical (CTO, VP Eng, Developer) |
| 📊 | `business` | Business (CEO, COO, Strategy) |
| 🚀 | `ai_lead` | AI/Innovation Lead |
| 💡 | `founder` | Founder building something new |

### Personality Questions

**Q3 — AI Relationship:** *"Your team's relationship with AI is best described as..."*

| Icon | Value | Label |
|------|-------|-------|
| 🌱 | `first_date` | First date — curious but cautious |
| 🔥 | `going_steady` | Going steady — some experiments working |
| 💍 | `committed` | Committed — AI is core to our strategy |

**Q4 — Working Style:** *"When you work with partners, you prefer..."*

| Icon | Value | Label |
|------|-------|-------|
| 🎯 | `full_ownership` | Give us the keys — full ownership |
| 🤝 | `embedded` | Collaborate closely — embedded partnership |
| 🎓 | `knowledge_transfer` | Teach us to fish — knowledge transfer focus |

### Qualification Questions

**Q5 — Timeline:** *"When are you looking to move?"*

| Icon | Value | Label |
|------|-------|-------|
| 🔥 | `asap` | ASAP (within weeks) |
| 📅 | `quarter` | This quarter |
| 🗓️ | `year` | This year |
| 🔭 | `exploring` | Just exploring |

**Q6 — Company Size:** *"How big is your organization?"*

| Icon | Value | Label |
|------|-------|-------|
| 🚀 | `startup` | Startup (1-20) |
| 📈 | `growth` | Growth (21-100) |
| 🏢 | `midmarket` | Mid-market (101-1000) |
| 🏛️ | `enterprise` | Enterprise (1000+) |

**Q7 — Industry:** *"What space are you in?"*

| Icon | Value | Label |
|------|-------|-------|
| 💳 | `fintech` | Fintech |
| 🛒 | `ecommerce` | E-commerce |
| 💻 | `saas` | SaaS |
| 👔 | `professional_services` | Professional Services |
| 🏥 | `healthcare` | Healthcare |
| 🎯 | `other` | Other |

### Post-Contact Question

**Q8 — Budget:** *"What's your budget range for this initiative?"*

| Icon | Value | Label |
|------|-------|-------|
| 💰 | `under_50k` | Under $50k |
| 💰💰 | `50k_150k` | $50k – $150k |
| 💰💰💰 | `150k_500k` | $150k – $500k |
| 💰💰💰💰 | `500k_plus` | $500k+ |
| 🤷 | `unsure` | Not sure yet |

## Hybrid Chat with Response Starters

After structured questions, the UI transitions to conversational chat. Claude has full context from the 7 answers.

### Transition Message

Claude opens with a personalized greeting based on their answers:

> *"Great to meet you! So you're a founder exploring what's possible with AI, and your team is just getting started. I'd love to hear more about what's on your mind."*

### Response Starters

When Claude asks an open-ended question, the UI shows 2-3 clickable pills below the input field:

**For "Tell me about the problem you're trying to solve":**
- `Our biggest challenge is...`
- `We've been struggling with...`
- `Our customers keep asking for...`

**For "What would success look like?":**
- `If this worked, we could...`
- `The dream scenario is...`
- `We'd measure success by...`

**For "Who would use this?":**
- `Our internal team needs...`
- `Our customers want...`
- `Both internal and external...`

Clicking a pill populates the input field with that text, cursor at end.

### Context-Aware Questions

Claude adapts based on structured answers:

| If they selected... | Claude might ask... |
|---------------------|---------------------|
| 🔧 Help with existing AI | *"What's currently not working the way you'd hoped?"* |
| 🎓 Upskill my team | *"What capabilities do you want your team to have?"* |
| 💍 Committed to AI | *"What's the most ambitious thing on your AI roadmap?"* |
| 🎯 Full ownership | *"What does your ideal handoff look like?"* |
| 🔥 ASAP timeline | *"What's driving the urgency?"* |

## Lead Scoring

The structured data enables automatic lead scoring:

### Scoring Criteria

| Factor | Hot (+3) | Warm (+2) | Cool (+1) | Cold (0) |
|--------|----------|-----------|-----------|----------|
| Timeline | ASAP | This quarter | This year | Exploring |
| Budget | $500k+ | $150k-500k | $50k-150k | <$50k / Unsure |
| Intent | Specific project | Existing system | Upskill | Exploring |
| AI Maturity | Committed | Going steady | First date | — |
| Company Size | Enterprise | Mid-market | Growth | Startup |

### Score Thresholds

| Score | Label | Response SLA | Action |
|-------|-------|--------------|--------|
| 12+ | 🔥 Hot | 4 hours | Founder/partner outreach |
| 8-11 | 🌡️ Warm | 24 hours | Senior team follow-up |
| 4-7 | ❄️ Cool | 48 hours | Standard follow-up |
| 0-3 | 🧊 Cold | Best effort | Nurture sequence |

### Score Calculation

```typescript
function calculateLeadScore(lead: Lead): number {
  let score = 0

  // Timeline
  if (lead.timeline === 'asap') score += 3
  else if (lead.timeline === 'quarter') score += 2
  else if (lead.timeline === 'year') score += 1

  // Budget
  if (lead.budget_range === '500k_plus') score += 3
  else if (lead.budget_range === '150k_500k') score += 2
  else if (lead.budget_range === '50k_150k') score += 1

  // Intent
  if (lead.intent === 'specific_project') score += 3
  else if (lead.intent === 'existing_system') score += 2
  else if (lead.intent === 'upskill') score += 1

  // AI Maturity
  if (lead.ai_maturity === 'committed') score += 2
  else if (lead.ai_maturity === 'going_steady') score += 1

  // Company Size
  if (lead.company_size === 'enterprise') score += 2
  else if (lead.company_size === 'midmarket') score += 1

  return score
}
```

## Technical Architecture

### Data Model

The `Lead` table expands to store structured answers:

```typescript
interface Lead {
  // Existing fields
  id: number
  session_id: string
  name: string | null
  email: string | null
  company: string | null

  // Structured interview answers
  intent: 'specific_project' | 'exploring' | 'existing_system' | 'upskill' | null
  role: 'technical' | 'business' | 'ai_lead' | 'founder' | null
  ai_maturity: 'first_date' | 'going_steady' | 'committed' | null
  working_style: 'full_ownership' | 'embedded' | 'knowledge_transfer' | null
  timeline: 'asap' | 'quarter' | 'year' | 'exploring' | null
  company_size: 'startup' | 'growth' | 'midmarket' | 'enterprise' | null
  industry: 'fintech' | 'ecommerce' | 'saas' | 'professional_services' | 'healthcare' | 'other' | null
  budget_range: 'under_50k' | '50k_150k' | '150k_500k' | '500k_plus' | 'unsure' | null

  // Lead scoring
  lead_score: number | null
  lead_tier: 'hot' | 'warm' | 'cool' | 'cold' | null

  // Existing freeform fields (populated by Claude extraction)
  project_summary: string | null
  problem: string | null
  vision: string | null
  users: string | null
  capabilities: string | null
  constraints: string | null
  prd_draft: string | null

  created_at: string
}
```

### Frontend State Machine

The chat moves through distinct phases:

```typescript
type InterviewPhase =
  | { type: 'structured'; questionIndex: number }  // Q1-Q7
  | { type: 'chat' }                                // Hybrid conversation
  | { type: 'post_contact' }                        // Budget question
  | { type: 'complete' }                            // Summary shown

// State transitions
// STRUCTURED (0-6) → CHAT → POST_CONTACT → COMPLETE
```

### API Changes

The chat API receives structured answers alongside messages:

```typescript
interface ChatRequest {
  message?: string                    // For chat phase
  structuredAnswer?: {                // For structured phase
    questionId: string
    answer: string
  }
  sessionId?: string
  phase: 'structured' | 'chat' | 'post_contact'
}

interface ChatResponse {
  message?: string                    // For chat phase
  sessionId: string
  leadExtracted?: boolean
  leadScore?: number
  leadTier?: 'hot' | 'warm' | 'cool' | 'cold'
}
```

Claude's system prompt is enhanced with the structured context before the conversation begins.

## UI Components

### Question Card Component

Each structured question displays as a full-width card:

```
┌─────────────────────────────────────────────────────────────────┐
│  What brings you to Vibes today?                                │
│  (We'll tailor the conversation to your needs)                  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │      🎯      │  │      🔍      │                            │
│  │   Specific   │  │   Exploring  │                            │
│  │   project    │  │   what's     │                            │
│  │   in mind    │  │   possible   │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │      🔧      │  │      🎓      │                            │
│  │    Help      │  │   Upskill    │                            │
│  │    with      │  │   my team    │                            │
│  │   existing   │  │              │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

### Answer Card States

| State | Treatment |
|-------|-----------|
| Default | Subtle border, light background |
| Hover | Elevated shadow, border highlight |
| Selected | Brand color border, subtle fill, checkmark |
| Disabled | Reduced opacity (during loading) |

### Progress Indicator

Subtle progress dots showing interview progress:

```
  ●───●───●───○───○───○───○
  1   2   3   4   5   6   7
```

Or text: "Question 3 of 7"

### Response Starter Pills

Clickable chips below the chat input during hybrid phase:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Our biggest challenge is...]  [We've been struggling with...] │
└─────────────────────────────────────────────────────────────────┘
│  Type your message...                                      Send │
└─────────────────────────────────────────────────────────────────┘
```

### Transition Animation

When moving from structured → chat:
- Question card fades out
- Chat interface fades in
- Claude's personalized greeting appears with typing indicator

## Lead Summary View

After budget is collected, Claude generates a summary:

```
┌─────────────────────────────────────────────────────────────────┐
│  ✨ Thanks for sharing your vision!                             │
│                                                                 │
│  Here's what I learned:                                        │
│  ───────────────────────────────────────────────────────────── │
│  📋 Project: AI-powered customer support agent                 │
│  🎯 Goal: Reduce ticket response time by 80%                   │
│  👥 Users: Support team + end customers                        │
│  ⏰ Timeline: This quarter                                     │
│  💰 Budget: $50k – $150k                                       │
│  ───────────────────────────────────────────────────────────── │
│                                                                 │
│  A member of the Vibes team will reach out within 24 hours     │
│  to discuss next steps.                                        │
│                                                                 │
│  [Start Over]                              [Learn More About Us]│
└─────────────────────────────────────────────────────────────────┘
```

## Internal Lead Notification

The email to the Vibes team includes structured data, score, and conversation:

```
New Lead: Sarah Chen (sarah@acme.co)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEAD SCORE: 🔥 Hot (14 points)

PROFILE
• Role: Founder
• Intent: Specific project in mind
• AI Maturity: Going steady
• Working Style: Embedded partnership
• Company: Acme (Startup, 1-20)
• Industry: SaaS
• Timeline: This quarter
• Budget: $50k – $150k

PRD SUMMARY
[Claude-generated summary of problem/vision/capabilities]

FULL CONVERSATION
[Transcript]
```

## Open Questions

1. **Skip option?** — Should users be able to skip questions? Risk: incomplete data. Benefit: reduces friction.

2. **Back navigation?** — Can users go back and change previous answers? Adds complexity but improves UX.

3. **Keyboard navigation?** — Number keys (1-4) to select options? Accessibility consideration.

4. **Mobile optimization?** — How do cards stack on small screens? 2x2 grid or vertical list?

5. **Analytics events?** — Track drop-off by question to identify friction points.
