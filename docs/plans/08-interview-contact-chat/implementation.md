# Interview-Style Contact Chat Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the contact chat from freeform conversation into a structured interview with creative multiple choice questions, adaptive branching, and lead scoring.

**Architecture:** Frontend state machine manages interview phases (structured → chat → post-contact → complete). Backend stores structured answers alongside freeform conversation. Lead scoring computed on extraction.

**Tech Stack:** React, TypeScript, Tailwind CSS, Cloudflare Workers, D1 SQLite, Claude API

---

## Phase 1: Data Layer

### Task 1: Update Database Schema

**Files:**
- Create: `workers/chat-api/migrations/0002_interview_fields.sql`
- Modify: `workers/chat-api/schema.sql`

**Step 1: Create migration file**

Create `workers/chat-api/migrations/0002_interview_fields.sql`:

```sql
-- Add structured interview fields to leads table
ALTER TABLE leads ADD COLUMN intent TEXT;
ALTER TABLE leads ADD COLUMN role TEXT;
ALTER TABLE leads ADD COLUMN ai_maturity TEXT;
ALTER TABLE leads ADD COLUMN working_style TEXT;
ALTER TABLE leads ADD COLUMN timeline TEXT;
ALTER TABLE leads ADD COLUMN company_size TEXT;
ALTER TABLE leads ADD COLUMN industry TEXT;
ALTER TABLE leads ADD COLUMN budget_range TEXT;
ALTER TABLE leads ADD COLUMN lead_score INTEGER;
ALTER TABLE leads ADD COLUMN lead_tier TEXT;

-- Add interview_answers JSON column for raw storage
ALTER TABLE leads ADD COLUMN interview_answers TEXT;

-- Add index on lead_tier for filtering
CREATE INDEX IF NOT EXISTS idx_leads_lead_tier ON leads(lead_tier);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
```

**Step 2: Update schema.sql with new columns**

Add the new columns to `workers/chat-api/schema.sql` leads table definition (after `prd_draft`):

```sql
  -- Structured interview answers
  intent TEXT,
  role TEXT,
  ai_maturity TEXT,
  working_style TEXT,
  timeline TEXT,
  company_size TEXT,
  industry TEXT,
  budget_range TEXT,
  lead_score INTEGER,
  lead_tier TEXT,
  interview_answers TEXT,
```

**Step 3: Run migration locally**

Run: `just worker-migrate local`
Expected: Migration applies successfully

**Step 4: Commit**

```bash
git add workers/chat-api/migrations/ workers/chat-api/schema.sql
git commit -m "feat(db): add interview fields to leads table"
```

---

### Task 2: Update TypeScript Types

**Files:**
- Modify: `workers/chat-api/src/types.ts`

**Step 1: Add interview types**

Add to `workers/chat-api/src/types.ts`:

```typescript
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
```

**Step 2: Update Lead interface**

Update the `Lead` interface in `workers/chat-api/src/types.ts`:

```typescript
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
```

**Step 3: Update ChatRequest/ChatResponse**

Update in `workers/chat-api/src/types.ts`:

```typescript
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
```

**Step 4: Commit**

```bash
git add workers/chat-api/src/types.ts
git commit -m "feat(types): add interview answer types and update Lead interface"
```

---

### Task 3: Implement Lead Scoring

**Files:**
- Create: `workers/chat-api/src/scoring.ts`
- Test: `workers/chat-api/src/scoring.test.ts`

**Step 1: Write the failing test**

Create `workers/chat-api/src/scoring.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { calculateLeadScore, getLeadTier } from './scoring'
import type { InterviewAnswers } from './types'

describe('calculateLeadScore', () => {
  it('returns 0 for empty answers', () => {
    expect(calculateLeadScore({})).toBe(0)
  })

  it('scores timeline correctly', () => {
    expect(calculateLeadScore({ timeline: 'asap' })).toBe(3)
    expect(calculateLeadScore({ timeline: 'quarter' })).toBe(2)
    expect(calculateLeadScore({ timeline: 'year' })).toBe(1)
    expect(calculateLeadScore({ timeline: 'exploring' })).toBe(0)
  })

  it('scores budget correctly', () => {
    expect(calculateLeadScore({ budget_range: '500k_plus' })).toBe(3)
    expect(calculateLeadScore({ budget_range: '150k_500k' })).toBe(2)
    expect(calculateLeadScore({ budget_range: '50k_150k' })).toBe(1)
    expect(calculateLeadScore({ budget_range: 'under_50k' })).toBe(0)
    expect(calculateLeadScore({ budget_range: 'unsure' })).toBe(0)
  })

  it('scores intent correctly', () => {
    expect(calculateLeadScore({ intent: 'specific_project' })).toBe(3)
    expect(calculateLeadScore({ intent: 'existing_system' })).toBe(2)
    expect(calculateLeadScore({ intent: 'upskill' })).toBe(1)
    expect(calculateLeadScore({ intent: 'exploring' })).toBe(0)
  })

  it('scores ai_maturity correctly', () => {
    expect(calculateLeadScore({ ai_maturity: 'committed' })).toBe(2)
    expect(calculateLeadScore({ ai_maturity: 'going_steady' })).toBe(1)
    expect(calculateLeadScore({ ai_maturity: 'first_date' })).toBe(0)
  })

  it('scores company_size correctly', () => {
    expect(calculateLeadScore({ company_size: 'enterprise' })).toBe(2)
    expect(calculateLeadScore({ company_size: 'midmarket' })).toBe(1)
    expect(calculateLeadScore({ company_size: 'growth' })).toBe(0)
    expect(calculateLeadScore({ company_size: 'startup' })).toBe(0)
  })

  it('combines all scores correctly', () => {
    const hotLead: InterviewAnswers = {
      timeline: 'asap',
      budget_range: '500k_plus',
      intent: 'specific_project',
      ai_maturity: 'committed',
      company_size: 'enterprise',
    }
    expect(calculateLeadScore(hotLead)).toBe(13) // 3+3+3+2+2
  })
})

describe('getLeadTier', () => {
  it('returns hot for score >= 12', () => {
    expect(getLeadTier(12)).toBe('hot')
    expect(getLeadTier(13)).toBe('hot')
  })

  it('returns warm for score 8-11', () => {
    expect(getLeadTier(8)).toBe('warm')
    expect(getLeadTier(11)).toBe('warm')
  })

  it('returns cool for score 4-7', () => {
    expect(getLeadTier(4)).toBe('cool')
    expect(getLeadTier(7)).toBe('cool')
  })

  it('returns cold for score < 4', () => {
    expect(getLeadTier(0)).toBe('cold')
    expect(getLeadTier(3)).toBe('cold')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd workers/chat-api && pnpm test src/scoring.test.ts`
Expected: FAIL with "Cannot find module './scoring'"

**Step 3: Write minimal implementation**

Create `workers/chat-api/src/scoring.ts`:

```typescript
import type { InterviewAnswers, LeadTierValue } from './types'

export function calculateLeadScore(answers: InterviewAnswers): number {
  let score = 0

  // Timeline (max 3)
  if (answers.timeline === 'asap') score += 3
  else if (answers.timeline === 'quarter') score += 2
  else if (answers.timeline === 'year') score += 1

  // Budget (max 3)
  if (answers.budget_range === '500k_plus') score += 3
  else if (answers.budget_range === '150k_500k') score += 2
  else if (answers.budget_range === '50k_150k') score += 1

  // Intent (max 3)
  if (answers.intent === 'specific_project') score += 3
  else if (answers.intent === 'existing_system') score += 2
  else if (answers.intent === 'upskill') score += 1

  // AI Maturity (max 2)
  if (answers.ai_maturity === 'committed') score += 2
  else if (answers.ai_maturity === 'going_steady') score += 1

  // Company Size (max 2)
  if (answers.company_size === 'enterprise') score += 2
  else if (answers.company_size === 'midmarket') score += 1

  return score
}

export function getLeadTier(score: number): LeadTierValue {
  if (score >= 12) return 'hot'
  if (score >= 8) return 'warm'
  if (score >= 4) return 'cool'
  return 'cold'
}
```

**Step 4: Run test to verify it passes**

Run: `cd workers/chat-api && pnpm test src/scoring.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add workers/chat-api/src/scoring.ts workers/chat-api/src/scoring.test.ts
git commit -m "feat(scoring): implement lead scoring algorithm"
```

---

## Phase 2: Interview Questions Config

### Task 4: Create Interview Questions Config

**Files:**
- Create: `src/features/chat/config/questions.ts`
- Test: `src/features/chat/config/questions.test.ts`

**Step 1: Write the failing test**

Create `src/features/chat/config/questions.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import {
  INTERVIEW_QUESTIONS,
  getQuestionById,
  getStructuredQuestions,
  getResponseStarters,
} from './questions'

describe('INTERVIEW_QUESTIONS', () => {
  it('has 8 questions total', () => {
    expect(INTERVIEW_QUESTIONS).toHaveLength(8)
  })

  it('has correct question IDs', () => {
    const ids = INTERVIEW_QUESTIONS.map((q) => q.id)
    expect(ids).toEqual([
      'intent',
      'role',
      'ai_maturity',
      'working_style',
      'timeline',
      'company_size',
      'industry',
      'budget_range',
    ])
  })

  it('each question has required fields', () => {
    for (const q of INTERVIEW_QUESTIONS) {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('options')
      expect(q.options.length).toBeGreaterThanOrEqual(3)
      for (const opt of q.options) {
        expect(opt).toHaveProperty('value')
        expect(opt).toHaveProperty('label')
        expect(opt).toHaveProperty('icon')
      }
    }
  })
})

describe('getQuestionById', () => {
  it('returns question for valid ID', () => {
    const q = getQuestionById('intent')
    expect(q?.question).toContain('brings you')
  })

  it('returns undefined for invalid ID', () => {
    expect(getQuestionById('invalid')).toBeUndefined()
  })
})

describe('getStructuredQuestions', () => {
  it('returns first 7 questions (excludes budget)', () => {
    const structured = getStructuredQuestions()
    expect(structured).toHaveLength(7)
    expect(structured.map((q) => q.id)).not.toContain('budget_range')
  })
})

describe('getResponseStarters', () => {
  it('returns starters for problem prompt', () => {
    const starters = getResponseStarters('problem')
    expect(starters.length).toBeGreaterThan(0)
    expect(starters[0]).toContain('...')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/config/questions.test.ts`
Expected: FAIL with "Cannot find module './questions'"

**Step 3: Write implementation**

Create `src/features/chat/config/questions.ts`:

```typescript
export interface QuestionOption {
  value: string
  label: string
  icon: string
}

export interface InterviewQuestion {
  id: string
  question: string
  subtitle?: string
  options: QuestionOption[]
  phase: 'opener' | 'personality' | 'qualification' | 'post_contact'
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Opener
  {
    id: 'intent',
    question: 'What brings you to Vibes today?',
    subtitle: "We'll tailor the conversation to your needs",
    phase: 'opener',
    options: [
      { value: 'specific_project', label: 'I have a specific AI project in mind', icon: '🎯' },
      { value: 'exploring', label: "I'm exploring what's possible with AI", icon: '🔍' },
      { value: 'existing_system', label: 'I need help with an existing AI system', icon: '🔧' },
      { value: 'upskill', label: 'I want to upskill my team', icon: '🎓' },
    ],
  },
  {
    id: 'role',
    question: "What's your perspective on this?",
    phase: 'opener',
    options: [
      { value: 'technical', label: 'Technical (CTO, VP Eng, Developer)', icon: '⚙️' },
      { value: 'business', label: 'Business (CEO, COO, Strategy)', icon: '📊' },
      { value: 'ai_lead', label: 'AI/Innovation Lead', icon: '🚀' },
      { value: 'founder', label: 'Founder building something new', icon: '💡' },
    ],
  },
  // Personality
  {
    id: 'ai_maturity',
    question: "Your team's relationship with AI is best described as...",
    phase: 'personality',
    options: [
      { value: 'first_date', label: 'First date — curious but cautious', icon: '🌱' },
      { value: 'going_steady', label: 'Going steady — some experiments working', icon: '🔥' },
      { value: 'committed', label: 'Committed — AI is core to our strategy', icon: '💍' },
    ],
  },
  {
    id: 'working_style',
    question: 'When you work with partners, you prefer...',
    phase: 'personality',
    options: [
      { value: 'full_ownership', label: 'Give us the keys — full ownership', icon: '🎯' },
      { value: 'embedded', label: 'Collaborate closely — embedded partnership', icon: '🤝' },
      { value: 'knowledge_transfer', label: 'Teach us to fish — knowledge transfer focus', icon: '🎓' },
    ],
  },
  // Qualification
  {
    id: 'timeline',
    question: 'When are you looking to move?',
    phase: 'qualification',
    options: [
      { value: 'asap', label: 'ASAP (within weeks)', icon: '🔥' },
      { value: 'quarter', label: 'This quarter', icon: '📅' },
      { value: 'year', label: 'This year', icon: '🗓️' },
      { value: 'exploring', label: 'Just exploring', icon: '🔭' },
    ],
  },
  {
    id: 'company_size',
    question: 'How big is your organization?',
    phase: 'qualification',
    options: [
      { value: 'startup', label: 'Startup (1-20)', icon: '🚀' },
      { value: 'growth', label: 'Growth (21-100)', icon: '📈' },
      { value: 'midmarket', label: 'Mid-market (101-1000)', icon: '🏢' },
      { value: 'enterprise', label: 'Enterprise (1000+)', icon: '🏛️' },
    ],
  },
  {
    id: 'industry',
    question: 'What space are you in?',
    phase: 'qualification',
    options: [
      { value: 'fintech', label: 'Fintech', icon: '💳' },
      { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
      { value: 'saas', label: 'SaaS', icon: '💻' },
      { value: 'professional_services', label: 'Professional Services', icon: '👔' },
      { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'other', label: 'Other', icon: '🎯' },
    ],
  },
  // Post-contact
  {
    id: 'budget_range',
    question: 'What\'s your budget range for this initiative?',
    phase: 'post_contact',
    options: [
      { value: 'under_50k', label: 'Under $50k', icon: '💰' },
      { value: '50k_150k', label: '$50k – $150k', icon: '💰💰' },
      { value: '150k_500k', label: '$150k – $500k', icon: '💰💰💰' },
      { value: '500k_plus', label: '$500k+', icon: '💰💰💰💰' },
      { value: 'unsure', label: 'Not sure yet', icon: '🤷' },
    ],
  },
]

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id)
}

export function getStructuredQuestions(): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.phase !== 'post_contact')
}

export function getPostContactQuestions(): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.phase === 'post_contact')
}

const RESPONSE_STARTERS: Record<string, string[]> = {
  problem: [
    'Our biggest challenge is...',
    "We've been struggling with...",
    'Our customers keep asking for...',
  ],
  vision: [
    'If this worked, we could...',
    'The dream scenario is...',
    "We'd measure success by...",
  ],
  users: [
    'Our internal team needs...',
    'Our customers want...',
    'Both internal and external...',
  ],
}

export function getResponseStarters(promptType: string): string[] {
  return RESPONSE_STARTERS[promptType] ?? []
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/config/questions.test.ts`
Expected: PASS

**Step 5: Create index export**

Create `src/features/chat/config/index.ts`:

```typescript
export * from './questions'
```

**Step 6: Commit**

```bash
git add src/features/chat/config/
git commit -m "feat(interview): add interview questions config"
```

---

## Phase 3: UI Components

### Task 5: Create AnswerCard Component

**Files:**
- Create: `src/features/chat/components/AnswerCard.tsx`
- Create: `src/features/chat/components/AnswerCard.test.tsx`
- Create: `src/features/chat/components/AnswerCard.stories.tsx`

**Step 1: Write the failing test**

Create `src/features/chat/components/AnswerCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AnswerCard } from './AnswerCard'

describe('AnswerCard', () => {
  it('renders icon and label', () => {
    render(<AnswerCard icon="🎯" label="Test Label" value="test" onSelect={vi.fn()} />)
    expect(screen.getByText('🎯')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('calls onSelect with value when clicked', async () => {
    const onSelect = vi.fn()
    render(<AnswerCard icon="🎯" label="Test" value="test_value" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('test_value')
  })

  it('shows selected state', () => {
    render(<AnswerCard icon="🎯" label="Test" value="test" selected onSelect={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('is disabled when disabled prop is true', () => {
    render(<AnswerCard icon="🎯" label="Test" value="test" disabled onSelect={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/components/AnswerCard.test.tsx`
Expected: FAIL with "Cannot find module './AnswerCard'"

**Step 3: Write implementation**

Create `src/features/chat/components/AnswerCard.tsx`:

```tsx
import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface AnswerCardProps extends Omit<ComponentProps<'button'>, 'onSelect'> {
  icon: string
  label: string
  value: string
  selected?: boolean
  onSelect: (value: string) => void
}

export function AnswerCard({
  icon,
  label,
  value,
  selected = false,
  disabled = false,
  onSelect,
  className,
  ...props
}: AnswerCardProps) {
  return (
    <button
      type="button"
      role="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
        'hover:shadow-md hover:-translate-y-0.5',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        selected
          ? 'border-accent bg-accent/10 shadow-md'
          : 'border-border bg-card hover:border-accent/50',
        disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
        className,
      )}
      {...props}
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/components/AnswerCard.test.tsx`
Expected: PASS

**Step 5: Create Ladle story**

Create `src/features/chat/components/AnswerCard.stories.tsx`:

```tsx
import type { Story } from '@ladle/react'
import { AnswerCard } from './AnswerCard'

export const Default: Story = () => (
  <div className="grid grid-cols-2 gap-4 max-w-md">
    <AnswerCard icon="🎯" label="Specific project in mind" value="specific" onSelect={console.log} />
    <AnswerCard icon="🔍" label="Exploring possibilities" value="exploring" onSelect={console.log} />
  </div>
)

export const Selected: Story = () => (
  <AnswerCard icon="🎯" label="Selected option" value="selected" selected onSelect={console.log} />
)

export const Disabled: Story = () => (
  <AnswerCard icon="🎯" label="Disabled option" value="disabled" disabled onSelect={console.log} />
)

export const LongLabel: Story = () => (
  <div className="max-w-[150px]">
    <AnswerCard
      icon="🎓"
      label="Teach us to fish — knowledge transfer focus"
      value="long"
      onSelect={console.log}
    />
  </div>
)
```

**Step 6: Commit**

```bash
git add src/features/chat/components/AnswerCard.*
git commit -m "feat(ui): add AnswerCard component for interview options"
```

---

### Task 6: Create InterviewQuestion Component

**Files:**
- Create: `src/features/chat/components/InterviewQuestion.tsx`
- Create: `src/features/chat/components/InterviewQuestion.test.tsx`

**Step 1: Write the failing test**

Create `src/features/chat/components/InterviewQuestion.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InterviewQuestion } from './InterviewQuestion'

const mockQuestion = {
  id: 'intent',
  question: 'What brings you to Vibes?',
  subtitle: 'Choose one',
  phase: 'opener' as const,
  options: [
    { value: 'a', label: 'Option A', icon: '🅰️' },
    { value: 'b', label: 'Option B', icon: '🅱️' },
  ],
}

describe('InterviewQuestion', () => {
  it('renders question text', () => {
    render(<InterviewQuestion question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText('What brings you to Vibes?')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<InterviewQuestion question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText('Choose one')).toBeInTheDocument()
  })

  it('renders all options as AnswerCards', () => {
    render(<InterviewQuestion question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('calls onAnswer with question id and value when option selected', async () => {
    const onAnswer = vi.fn()
    render(<InterviewQuestion question={mockQuestion} onAnswer={onAnswer} />)
    await userEvent.click(screen.getByText('Option A'))
    expect(onAnswer).toHaveBeenCalledWith('intent', 'a')
  })

  it('shows selected state for current value', () => {
    render(<InterviewQuestion question={mockQuestion} currentValue="a" onAnswer={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false')
  })

  it('disables all options when disabled', () => {
    render(<InterviewQuestion question={mockQuestion} disabled onAnswer={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/components/InterviewQuestion.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

Create `src/features/chat/components/InterviewQuestion.tsx`:

```tsx
import { cn } from '@/lib/cn'
import type { InterviewQuestion as QuestionType } from '../config/questions'
import { AnswerCard } from './AnswerCard'

interface InterviewQuestionProps {
  question: QuestionType
  currentValue?: string
  disabled?: boolean
  onAnswer: (questionId: string, value: string) => void
  className?: string
}

export function InterviewQuestion({
  question,
  currentValue,
  disabled = false,
  onAnswer,
  className,
}: InterviewQuestionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{question.question}</h2>
        {question.subtitle && (
          <p className="text-muted-foreground text-sm">{question.subtitle}</p>
        )}
      </div>
      <div
        className={cn(
          'grid gap-4',
          question.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2',
        )}
      >
        {question.options.map((option) => (
          <AnswerCard
            key={option.value}
            icon={option.icon}
            label={option.label}
            value={option.value}
            selected={currentValue === option.value}
            disabled={disabled}
            onSelect={(value) => onAnswer(question.id, value)}
          />
        ))}
      </div>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/components/InterviewQuestion.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/chat/components/InterviewQuestion.*
git commit -m "feat(ui): add InterviewQuestion component"
```

---

### Task 7: Create ProgressIndicator Component

**Files:**
- Create: `src/features/chat/components/ProgressIndicator.tsx`
- Create: `src/features/chat/components/ProgressIndicator.test.tsx`

**Step 1: Write the failing test**

Create `src/features/chat/components/ProgressIndicator.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  it('renders correct number of dots', () => {
    render(<ProgressIndicator current={0} total={7} />)
    const dots = screen.getAllByRole('listitem')
    expect(dots).toHaveLength(7)
  })

  it('marks completed dots correctly', () => {
    render(<ProgressIndicator current={3} total={7} />)
    const dots = screen.getAllByRole('listitem')
    // First 3 should be completed (0, 1, 2)
    expect(dots[0]).toHaveAttribute('data-state', 'completed')
    expect(dots[1]).toHaveAttribute('data-state', 'completed')
    expect(dots[2]).toHaveAttribute('data-state', 'completed')
    // Current (3) should be current
    expect(dots[3]).toHaveAttribute('data-state', 'current')
    // Rest should be upcoming
    expect(dots[4]).toHaveAttribute('data-state', 'upcoming')
  })

  it('shows text label when showLabel is true', () => {
    render(<ProgressIndicator current={2} total={7} showLabel />)
    expect(screen.getByText('Question 3 of 7')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/components/ProgressIndicator.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

Create `src/features/chat/components/ProgressIndicator.tsx`:

```tsx
import { cn } from '@/lib/cn'

interface ProgressIndicatorProps {
  current: number
  total: number
  showLabel?: boolean
  className?: string
}

export function ProgressIndicator({
  current,
  total,
  showLabel = false,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <ol className="flex items-center gap-2" aria-label="Interview progress">
        {Array.from({ length: total }, (_, i) => {
          const state = i < current ? 'completed' : i === current ? 'current' : 'upcoming'
          return (
            <li
              key={i}
              data-state={state}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                state === 'completed' && 'bg-accent',
                state === 'current' && 'bg-accent w-3 h-3',
                state === 'upcoming' && 'bg-muted',
              )}
              aria-label={`Question ${i + 1}: ${state}`}
            />
          )
        })}
      </ol>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          Question {current + 1} of {total}
        </span>
      )}
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/components/ProgressIndicator.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/chat/components/ProgressIndicator.*
git commit -m "feat(ui): add ProgressIndicator component"
```

---

### Task 8: Create ResponseStarter Component

**Files:**
- Create: `src/features/chat/components/ResponseStarter.tsx`
- Create: `src/features/chat/components/ResponseStarter.test.tsx`

**Step 1: Write the failing test**

Create `src/features/chat/components/ResponseStarter.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResponseStarter } from './ResponseStarter'

describe('ResponseStarter', () => {
  const starters = ['Our biggest challenge is...', "We've been struggling with..."]

  it('renders all starter options', () => {
    render(<ResponseStarter starters={starters} onSelect={vi.fn()} />)
    expect(screen.getByText('Our biggest challenge is...')).toBeInTheDocument()
    expect(screen.getByText("We've been struggling with...")).toBeInTheDocument()
  })

  it('calls onSelect with starter text when clicked', async () => {
    const onSelect = vi.fn()
    render(<ResponseStarter starters={starters} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Our biggest challenge is...'))
    expect(onSelect).toHaveBeenCalledWith('Our biggest challenge is...')
  })

  it('renders nothing when starters array is empty', () => {
    const { container } = render(<ResponseStarter starters={[]} onSelect={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/components/ResponseStarter.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

Create `src/features/chat/components/ResponseStarter.tsx`:

```tsx
import { cn } from '@/lib/cn'

interface ResponseStarterProps {
  starters: string[]
  onSelect: (starter: string) => void
  className?: string
}

export function ResponseStarter({ starters, onSelect, className }: ResponseStarterProps) {
  if (starters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {starters.map((starter) => (
        <button
          key={starter}
          type="button"
          onClick={() => onSelect(starter)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full',
            'bg-muted hover:bg-muted/80 text-muted-foreground',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
          )}
        >
          {starter}
        </button>
      ))}
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/components/ResponseStarter.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/chat/components/ResponseStarter.*
git commit -m "feat(ui): add ResponseStarter component for chat prompts"
```

---

### Task 9: Update Component Exports

**Files:**
- Modify: `src/features/chat/components/index.ts`

**Step 1: Add new exports**

Update `src/features/chat/components/index.ts`:

```typescript
export * from './AnswerCard'
export * from './ChatBubble'
export * from './ChatContainer'
export * from './ChatInput'
export * from './InterviewQuestion'
export * from './ProgressIndicator'
export * from './ResponseStarter'
```

**Step 2: Commit**

```bash
git add src/features/chat/components/index.ts
git commit -m "chore: export new interview components"
```

---

## Phase 4: Interview State Machine

### Task 10: Create useInterview Hook

**Files:**
- Create: `src/features/chat/hooks/useInterview.ts`
- Create: `src/features/chat/hooks/useInterview.test.ts`

**Step 1: Write the failing test**

Create `src/features/chat/hooks/useInterview.test.ts`:

```typescript
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useInterview } from './useInterview'

describe('useInterview', () => {
  it('starts at question 0 in structured phase', () => {
    const { result } = renderHook(() => useInterview())
    expect(result.current.phase).toBe('structured')
    expect(result.current.currentQuestionIndex).toBe(0)
  })

  it('advances to next question on answer', () => {
    const { result } = renderHook(() => useInterview())
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    expect(result.current.currentQuestionIndex).toBe(1)
    expect(result.current.answers.intent).toBe('specific_project')
  })

  it('transitions to chat phase after all structured questions', () => {
    const { result } = renderHook(() => useInterview())
    // Answer all 7 structured questions
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
      result.current.answerQuestion('role', 'technical')
      result.current.answerQuestion('ai_maturity', 'going_steady')
      result.current.answerQuestion('working_style', 'embedded')
      result.current.answerQuestion('timeline', 'quarter')
      result.current.answerQuestion('company_size', 'startup')
      result.current.answerQuestion('industry', 'saas')
    })
    expect(result.current.phase).toBe('chat')
  })

  it('transitions to post_contact when contact collected', () => {
    const { result } = renderHook(() => useInterview())
    // Fast-forward to chat phase
    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.answerQuestion(`q${i}`, 'val')
      }
    })
    act(() => {
      result.current.setContactCollected(true)
    })
    expect(result.current.phase).toBe('post_contact')
  })

  it('transitions to complete after budget answered', () => {
    const { result } = renderHook(() => useInterview())
    // Fast-forward through all phases
    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.answerQuestion(`q${i}`, 'val')
      }
      result.current.setContactCollected(true)
      result.current.answerQuestion('budget_range', '50k_150k')
    })
    expect(result.current.phase).toBe('complete')
    expect(result.current.answers.budget_range).toBe('50k_150k')
  })

  it('returns current question', () => {
    const { result } = renderHook(() => useInterview())
    expect(result.current.currentQuestion?.id).toBe('intent')
  })

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useInterview())
    expect(result.current.progress).toEqual({ current: 0, total: 7 })
    act(() => {
      result.current.answerQuestion('intent', 'specific_project')
    })
    expect(result.current.progress).toEqual({ current: 1, total: 7 })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/hooks/useInterview.test.ts`
Expected: FAIL

**Step 3: Write implementation**

Create `src/features/chat/hooks/useInterview.ts`:

```typescript
import { useCallback, useMemo, useState } from 'react'
import {
  getPostContactQuestions,
  getQuestionById,
  getStructuredQuestions,
  type InterviewQuestion,
} from '../config/questions'

export interface InterviewAnswers {
  [key: string]: string
}

export type InterviewPhase = 'structured' | 'chat' | 'post_contact' | 'complete'

interface UseInterviewReturn {
  phase: InterviewPhase
  currentQuestionIndex: number
  currentQuestion: InterviewQuestion | undefined
  answers: InterviewAnswers
  progress: { current: number; total: number }
  contactCollected: boolean
  answerQuestion: (questionId: string, value: string) => void
  setContactCollected: (collected: boolean) => void
}

export function useInterview(): UseInterviewReturn {
  const [phase, setPhase] = useState<InterviewPhase>('structured')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<InterviewAnswers>({})
  const [contactCollected, setContactCollectedState] = useState(false)

  const structuredQuestions = useMemo(() => getStructuredQuestions(), [])
  const postContactQuestions = useMemo(() => getPostContactQuestions(), [])

  const currentQuestion = useMemo(() => {
    if (phase === 'structured') {
      return structuredQuestions[currentQuestionIndex]
    }
    if (phase === 'post_contact') {
      return postContactQuestions[0] // Budget question
    }
    return undefined
  }, [phase, currentQuestionIndex, structuredQuestions, postContactQuestions])

  const progress = useMemo(
    () => ({
      current: currentQuestionIndex,
      total: structuredQuestions.length,
    }),
    [currentQuestionIndex, structuredQuestions.length],
  )

  const answerQuestion = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }))

      if (phase === 'structured') {
        const nextIndex = currentQuestionIndex + 1
        if (nextIndex >= structuredQuestions.length) {
          setPhase('chat')
        } else {
          setCurrentQuestionIndex(nextIndex)
        }
      } else if (phase === 'post_contact' && questionId === 'budget_range') {
        setPhase('complete')
      }
    },
    [phase, currentQuestionIndex, structuredQuestions.length],
  )

  const setContactCollected = useCallback((collected: boolean) => {
    setContactCollectedState(collected)
    if (collected) {
      setPhase('post_contact')
    }
  }, [])

  return {
    phase,
    currentQuestionIndex,
    currentQuestion,
    answers,
    progress,
    contactCollected,
    answerQuestion,
    setContactCollected,
  }
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/hooks/useInterview.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/chat/hooks/useInterview.*
git commit -m "feat(interview): add useInterview state machine hook"
```

---

## Phase 5: Backend Updates

### Task 11: Update Claude System Prompt

**Files:**
- Modify: `workers/chat-api/src/claude.ts`

**Step 1: Update system prompt to be context-aware**

Update `workers/chat-api/src/claude.ts`:

```typescript
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

// ... rest of the file with updated callClaude function
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

  const messages = conversationHistory
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

  const data = (await response.json()) as { content: Array<{ type: 'text'; text: string }> }
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
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/claude.ts
git commit -m "feat(claude): add context-aware system prompt with interview answers"
```

---

### Task 12: Update Leads Module

**Files:**
- Modify: `workers/chat-api/src/leads.ts`

**Step 1: Update saveLead to include interview data**

Update `workers/chat-api/src/leads.ts` to include new fields:

```typescript
import { calculateLeadScore, getLeadTier } from './scoring'
import type { InterviewAnswers, Message } from './types'

// ... existing ExtractedLead interface ...

export async function saveLead(
  db: D1Database,
  sessionId: string,
  lead: ExtractedLead,
  prdDraft: string,
  interviewAnswers?: InterviewAnswers,
): Promise<{ score: number; tier: string }> {
  const score = interviewAnswers ? calculateLeadScore(interviewAnswers) : 0
  const tier = getLeadTier(score)

  await db
    .prepare(
      `INSERT INTO leads (
        session_id, name, email, company, project_summary, problem, vision,
        users, capabilities, constraints, prd_draft,
        intent, role, ai_maturity, working_style, timeline, company_size,
        industry, budget_range, lead_score, lead_tier, interview_answers
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        prd_draft = excluded.prd_draft,
        intent = excluded.intent,
        role = excluded.role,
        ai_maturity = excluded.ai_maturity,
        working_style = excluded.working_style,
        timeline = excluded.timeline,
        company_size = excluded.company_size,
        industry = excluded.industry,
        budget_range = excluded.budget_range,
        lead_score = excluded.lead_score,
        lead_tier = excluded.lead_tier,
        interview_answers = excluded.interview_answers`,
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
      prdDraft,
      interviewAnswers?.intent ?? null,
      interviewAnswers?.role ?? null,
      interviewAnswers?.ai_maturity ?? null,
      interviewAnswers?.working_style ?? null,
      interviewAnswers?.timeline ?? null,
      interviewAnswers?.company_size ?? null,
      interviewAnswers?.industry ?? null,
      interviewAnswers?.budget_range ?? null,
      score,
      tier,
      interviewAnswers ? JSON.stringify(interviewAnswers) : null,
    )
    .run()

  return { score, tier }
}
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/leads.ts
git commit -m "feat(leads): add interview answers and scoring to lead storage"
```

---

### Task 13: Update Email Template

**Files:**
- Modify: `workers/chat-api/src/email.ts`

**Step 1: Update email format to include structured data**

Update `workers/chat-api/src/email.ts`:

```typescript
import type { InterviewAnswers, LeadTierValue } from './types'

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

  if (answers.intent) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Intent</td><td style="padding:4px 8px;">${INTENT_LABELS[answers.intent] ?? answers.intent}</td></tr>`)
  if (answers.role) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Role</td><td style="padding:4px 8px;">${ROLE_LABELS[answers.role] ?? answers.role}</td></tr>`)
  if (answers.ai_maturity) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">AI Maturity</td><td style="padding:4px 8px;">${AI_MATURITY_LABELS[answers.ai_maturity] ?? answers.ai_maturity}</td></tr>`)
  if (answers.working_style) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Working Style</td><td style="padding:4px 8px;">${WORKING_STYLE_LABELS[answers.working_style] ?? answers.working_style}</td></tr>`)
  if (answers.timeline) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Timeline</td><td style="padding:4px 8px;">${TIMELINE_LABELS[answers.timeline] ?? answers.timeline}</td></tr>`)
  if (answers.company_size) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Company Size</td><td style="padding:4px 8px;">${COMPANY_SIZE_LABELS[answers.company_size] ?? answers.company_size}</td></tr>`)
  if (answers.industry) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Industry</td><td style="padding:4px 8px;">${INDUSTRY_LABELS[answers.industry] ?? answers.industry}</td></tr>`)
  if (answers.budget_range) rows.push(`<tr><td style="color:#64748b;padding:4px 8px;">Budget</td><td style="padding:4px 8px;">${BUDGET_LABELS[answers.budget_range] ?? answers.budget_range}</td></tr>`)

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
  const tierLabel = options?.leadTier ? options.leadTier.charAt(0).toUpperCase() + options.leadTier.slice(1) : ''
  const scoreSection = options?.leadScore !== undefined
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

// Update notifyTeam to accept new options
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
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/email.ts
git commit -m "feat(email): add interview data and lead scoring to notification emails"
```

---

### Task 14: Update Worker API Handler

**Files:**
- Modify: `workers/chat-api/src/index.ts`

**Step 1: Update API to handle interview phases**

Update `workers/chat-api/src/index.ts` to handle the new request format and store interview answers in the session:

```typescript
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
import type { ChatRequest, ChatResponse, Env, InterviewAnswers } from './types'

// In-memory store for interview answers per session (could move to D1)
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
          answers[body.structuredAnswer.questionId] = body.structuredAnswer.answer
          sessionInterviewAnswers.set(session.id, answers)

          const response: ChatResponse = {
            sessionId: session.id,
          }
          return jsonResponse(response, 200, origin)
        }

        // Handle post_contact phase (budget question)
        if (body.phase === 'post_contact' && body.structuredAnswer) {
          const answers = sessionInterviewAnswers.get(session.id) ?? {}
          answers[body.structuredAnswer.questionId] = body.structuredAnswer.answer
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
        const response = await callClaude(env.ANTHROPIC_API_KEY, history, body.message, interviewAnswers)

        await saveMessage(env.DB, session.id, 'assistant', response)

        let leadExtracted = false
        let leadScore: number | undefined
        let leadTier: string | undefined

        if (isLeadComplete(response)) {
          try {
            const lead = await extractLeadFromConversation(
              env.ANTHROPIC_API_KEY,
              await getConversationHistory(env.DB, session.id),
            )

            const prdDraft = generatePRDDraft(lead)
            const result = await saveLead(env.DB, session.id, lead, prdDraft, interviewAnswers)
            leadScore = result.score
            leadTier = result.tier

            if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
              await notifyTeam(env.RESEND_API_KEY, env.NOTIFICATION_EMAIL, lead, prdDraft, {
                interviewAnswers,
                leadScore,
                leadTier: leadTier as any,
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
          leadTier: leadTier as any,
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
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/index.ts
git commit -m "feat(api): handle interview phases and structured answers"
```

---

## Phase 6: Frontend Integration

### Task 15: Create InterviewContainer Component

**Files:**
- Create: `src/features/chat/components/InterviewContainer.tsx`
- Create: `src/features/chat/components/InterviewContainer.test.tsx`

**Step 1: Write the failing test**

Create `src/features/chat/components/InterviewContainer.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InterviewContainer } from './InterviewContainer'

describe('InterviewContainer', () => {
  it('shows first question on initial render', () => {
    render(<InterviewContainer />)
    expect(screen.getByText('What brings you to Vibes today?')).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    render(<InterviewContainer />)
    expect(screen.getByText('Question 1 of 7')).toBeInTheDocument()
  })

  it('advances to next question on answer', async () => {
    render(<InterviewContainer />)
    await userEvent.click(screen.getByText('I have a specific AI project in mind'))
    expect(screen.getByText("What's your perspective on this?")).toBeInTheDocument()
    expect(screen.getByText('Question 2 of 7')).toBeInTheDocument()
  })

  it('transitions to chat after all questions', async () => {
    render(<InterviewContainer />)
    // Answer all 7 questions
    await userEvent.click(screen.getByText('I have a specific AI project in mind'))
    await userEvent.click(screen.getByText('Technical (CTO, VP Eng, Developer)'))
    await userEvent.click(screen.getByText('Going steady — some experiments working'))
    await userEvent.click(screen.getByText('Collaborate closely — embedded partnership'))
    await userEvent.click(screen.getByText('This quarter'))
    await userEvent.click(screen.getByText('Startup (1-20)'))
    await userEvent.click(screen.getByText('SaaS'))

    // Should now show chat interface
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/components/InterviewContainer.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

Create `src/features/chat/components/InterviewContainer.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getResponseStarters } from '../config/questions'
import { useChat } from '../hooks/useChat'
import { useInterview } from '../hooks/useInterview'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { InterviewQuestion } from './InterviewQuestion'
import { ProgressIndicator } from './ProgressIndicator'
import { ResponseStarter } from './ResponseStarter'

interface InterviewContainerProps {
  className?: string
  apiEndpoint?: string
  onInputFocus?: () => void
}

export function InterviewContainer({
  className,
  apiEndpoint,
  onInputFocus,
}: InterviewContainerProps) {
  const {
    phase,
    currentQuestion,
    currentQuestionIndex,
    answers,
    progress,
    answerQuestion,
    setContactCollected,
  } = useInterview()

  const { messages, isLoading, error, sendMessage } = useChat({
    apiEndpoint,
    interviewAnswers: answers,
  })

  const messagesAreaRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const initialMessageCount = useRef(messages.length)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > initialMessageCount.current && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight
    }
  }, [messages.length])

  // Check if lead is complete (contact collected)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant') {
      // Check if Claude has collected contact info
      const hasContact = messages.some(
        (m) =>
          m.role === 'user' &&
          (m.content.includes('@') || m.content.toLowerCase().includes('email')),
      )
      if (hasContact && lastMessage.content.toLowerCase().includes('thank')) {
        setContactCollected(true)
      }
    }
  }, [messages, setContactCollected])

  const handleInputFocus = useCallback(() => {
    setIsExpanded(true)
    onInputFocus?.()
  }, [onInputFocus])

  const handleSend = useCallback(
    async (content: string) => {
      setInputValue('')
      await sendMessage(content)
    },
    [sendMessage],
  )

  const handleStarterSelect = useCallback((starter: string) => {
    setInputValue(starter)
  }, [])

  // Determine current response starters based on conversation
  const currentStarters = phase === 'chat' ? getResponseStarters('problem') : []

  // Render structured question phase
  if (phase === 'structured' && currentQuestion) {
    return (
      <div
        className={cn(
          'flex flex-col border rounded-xl bg-background p-6',
          'min-h-[350px] sm:min-h-[400px]',
          className,
        )}
      >
        <ProgressIndicator
          current={progress.current}
          total={progress.total}
          showLabel
          className="mb-8"
        />
        <div className="flex-1 flex items-center justify-center">
          <InterviewQuestion
            question={currentQuestion}
            currentValue={answers[currentQuestion.id]}
            onAnswer={answerQuestion}
            className="w-full max-w-lg"
          />
        </div>
      </div>
    )
  }

  // Render post-contact budget question
  if (phase === 'post_contact' && currentQuestion) {
    return (
      <div
        className={cn(
          'flex flex-col border rounded-xl bg-background p-6',
          'min-h-[350px] sm:min-h-[400px]',
          className,
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <InterviewQuestion
            question={currentQuestion}
            currentValue={answers[currentQuestion.id]}
            onAnswer={answerQuestion}
            className="w-full max-w-lg"
          />
        </div>
      </div>
    )
  }

  // Render complete phase
  if (phase === 'complete') {
    return (
      <div
        className={cn(
          'flex flex-col border rounded-xl bg-background p-6',
          'min-h-[350px] sm:min-h-[400px]',
          className,
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-4xl">✨</div>
            <h2 className="text-xl font-bold">Thanks for sharing your vision!</h2>
            <p className="text-muted-foreground">
              A member of the Vibes team will reach out within 24 hours to discuss next steps.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Render chat phase
  return (
    <div
      className={cn(
        'flex flex-col border rounded-xl bg-background transition-all duration-300',
        isExpanded
          ? 'h-[320px] sm:h-[500px] max-h-[50vh] sm:max-h-[70vh]'
          : 'h-[280px] sm:h-[350px]',
        className,
      )}
    >
      {/* Messages Area */}
      <div ref={messagesAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <ChatBubble key={message.id} sender={message.role === 'user' ? 'user' : 'assistant'}>
            {message.content}
          </ChatBubble>
        ))}
        {isLoading && (
          <ChatBubble sender="assistant">
            <span className="animate-pulse">Thinking...</span>
          </ChatBubble>
        )}
        {error && (
          <div className="text-center text-sm text-destructive p-2">
            Gremlins in the system prevented us from sending your message. Please try again.
          </div>
        )}
      </div>

      {/* Response Starters */}
      {currentStarters.length > 0 && !isLoading && (
        <div className="px-4 pb-2">
          <ResponseStarter starters={currentStarters} onSelect={handleStarterSelect} />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 shrink-0">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          loading={isLoading}
          onFocus={handleInputFocus}
        />
      </div>
    </div>
  )
}
```

**Step 4: Update ChatInput to support controlled value**

Update `src/features/chat/components/ChatInput.tsx` to accept `value` and `onChange` props:

```tsx
interface ChatInputProps {
  onSend: (message: string) => void
  loading?: boolean
  onFocus?: () => void
  value?: string
  onChange?: (value: string) => void
}

export function ChatInput({
  onSend,
  loading = false,
  onFocus,
  value: controlledValue,
  onChange: controlledOnChange,
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue ?? internalValue
  const setValue = controlledOnChange ?? setInternalValue

  // ... rest of component uses value/setValue
}
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/features/chat/components/InterviewContainer.test.tsx`
Expected: PASS (may need adjustments based on actual implementation)

**Step 6: Commit**

```bash
git add src/features/chat/components/InterviewContainer.* src/features/chat/components/ChatInput.tsx
git commit -m "feat(interview): add InterviewContainer orchestrating full interview flow"
```

---

### Task 16: Update useChat Hook for Interview Context

**Files:**
- Modify: `src/features/chat/hooks/useChat.ts`

**Step 1: Add interview answers to API calls**

Update `src/features/chat/hooks/useChat.ts`:

```typescript
interface UseChatOptions {
  apiEndpoint?: string
  interviewAnswers?: Record<string, string>
}

export function useChat(options: UseChatOptions = {}) {
  const { apiEndpoint = '/api/chat', interviewAnswers } = options

  // ... existing state ...

  const sendMessage = useCallback(
    async (content: string) => {
      // ... existing message setup ...

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            sessionId,
            phase: 'chat',
            interviewAnswers,
          }),
        })
        // ... rest of handler ...
      }
    },
    [apiEndpoint, sessionId, interviewAnswers],
  )

  // ... rest of hook ...
}
```

**Step 2: Commit**

```bash
git add src/features/chat/hooks/useChat.ts
git commit -m "feat(chat): pass interview answers to API in chat phase"
```

---

### Task 17: Update Contact Page

**Files:**
- Modify: `src/routes/contact.tsx`

**Step 1: Replace ChatContainer with InterviewContainer**

Update the contact page to use the new InterviewContainer.

**Step 2: Commit**

```bash
git add src/routes/contact.tsx
git commit -m "feat(contact): use InterviewContainer for structured interview flow"
```

---

## Phase 7: Testing & Polish

### Task 18: Run Full Test Suite

**Step 1: Run all tests**

Run: `pnpm test`
Expected: All tests pass

**Step 2: Run type checking**

Run: `pnpm typecheck`
Expected: No type errors

**Step 3: Run linting**

Run: `pnpm lint`
Expected: No lint errors

**Step 4: Fix any issues and commit**

```bash
git add -A
git commit -m "fix: address test and lint issues"
```

---

### Task 19: Manual Testing

**Step 1: Start dev server**

Run: `pnpm dev`

**Step 2: Test interview flow**

- Navigate to /contact
- Answer all 7 structured questions
- Verify progress indicator updates
- Verify transition to chat phase
- Have conversation with Claude
- Provide contact info
- Verify budget question appears
- Complete flow and verify thank you screen

**Step 3: Test worker locally**

Run: `just worker-dev`

**Step 4: Verify email notification**

Check that email includes:
- Lead score and tier
- Interview profile table
- PRD draft

---

### Task 20: Deploy and Migrate

**Step 1: Run staging migration**

Run: `just worker-migrate staging`

**Step 2: Deploy worker to staging**

Run: `just worker-deploy staging`

**Step 3: Deploy frontend preview**

Run: `just pages-preview`

**Step 4: Test on staging**

Verify full flow works on staging environment.

**Step 5: Deploy to production**

Run: `just worker-migrate production`
Run: `just worker-deploy production`
Run: `just pages-deploy`

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: complete interview contact chat implementation"
```

---

## Summary

This plan implements the interview-style contact chat in 20 tasks across 7 phases:

1. **Data Layer** (Tasks 1-3): Database schema, types, lead scoring
2. **Interview Config** (Task 4): Question definitions and response starters
3. **UI Components** (Tasks 5-9): AnswerCard, InterviewQuestion, ProgressIndicator, ResponseStarter
4. **State Machine** (Task 10): useInterview hook
5. **Backend Updates** (Tasks 11-14): Claude prompt, leads, email, API
6. **Frontend Integration** (Tasks 15-17): InterviewContainer, useChat updates, contact page
7. **Testing & Deploy** (Tasks 18-20): Test suite, manual testing, deployment

Each task follows TDD with explicit file paths, code snippets, and commit points.
