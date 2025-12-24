# Phase 1 Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the Foundation (MVP) phase with functional pages and a full chat-based lead capture system that extracts PRD-worthy information.

**Architecture:** Chat-first contact experience with Claude-powered conversational lead capture, D1 storage, hybrid rate limiting (Cloudflare + session-based), and Resend email notifications.

**Tech Stack:** TanStack Start, Cloudflare Workers, D1, Claude API, Resend, TypeScript

---

## Phase 1A: Pages

### Task 1: Create Services Page

**Files:**
- Create: `src/routes/services.tsx`

**Step 1: Create the services page with four detailed sections**

```typescript
// src/routes/services.tsx
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

const services = [
  {
    id: 'agent-development',
    title: 'Agent Development',
    tagline: 'Intelligent agents. Coordinated swarms. Real-world impact.',
    description:
      'We design and build AI agents that work autonomously to achieve your business goals. From single-purpose assistants to complex multi-agent orchestrations, we handle the full lifecycle from concept through production deployment.',
    benefits: [
      'End-to-end design and development of AI agents',
      'Single agents to multi-agent orchestration',
      'Production-ready deployment and monitoring',
      'Ongoing support and iteration',
    ],
    useCases: [
      'Customer support agents that resolve issues autonomously',
      'Research agents that synthesize information across sources',
      'Operations agents that coordinate complex workflows',
    ],
  },
  {
    id: 'ai-strategy',
    title: 'AI Strategy & Consulting',
    tagline: 'Navigate the AI landscape with a clear plan.',
    description:
      'Cut through the hype and build a practical AI roadmap. We assess your readiness, identify high-impact opportunities, and create actionable plans that align with your business objectives.',
    benefits: [
      'AI readiness assessments',
      'Architecture reviews and recommendations',
      'Transformation roadmaps with clear milestones',
      'Vendor and tool evaluation',
    ],
    useCases: [
      'Evaluating where AI can have the biggest impact',
      'Building internal AI capabilities vs. buying solutions',
      'Preparing your data and infrastructure for AI',
    ],
  },
  {
    id: 'product-development',
    title: 'Product Development',
    tagline: 'Ship AI products that users love.',
    description:
      'Building AI-native products requires a different approach. We help you ideate, prototype, and ship products that leverage AI as a core differentiator—not just a feature.',
    benefits: [
      'New product ideation and validation',
      'AI feature integration into existing products',
      'Rapid prototyping and user testing',
      'Scale from MVP to production',
    ],
    useCases: [
      'Launching a new AI-powered SaaS product',
      'Adding intelligent features to your existing platform',
      'Rebuilding legacy products with AI capabilities',
    ],
  },
  {
    id: 'workshops',
    title: 'Workshops & Training',
    tagline: 'Empower your team to think in agents.',
    description:
      'Your team is your most valuable asset. We run hands-on workshops that give your engineers and leaders the skills to build and deploy AI agents independently.',
    benefits: [
      'Hands-on agent-building workshops',
      'Executive AI literacy sessions',
      'Team enablement programs',
      'Custom curriculum for your stack',
    ],
    useCases: [
      'Upskilling engineering teams on agent architectures',
      'Helping leadership understand AI capabilities and limits',
      'Building internal centers of excellence',
    ],
  },
]

function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <Section size="lg" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="2xl" className="mb-6">
            What We Do
          </Heading>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
            From strategy to deployment, we help you build AI systems that deliver measurable
            business impact.
          </Text>
        </Container>
      </Section>

      {/* Service Sections */}
      {services.map((service, index) => (
        <Section
          key={service.id}
          id={service.id}
          className={index % 2 === 1 ? 'bg-muted/30' : ''}
        >
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <Heading level={2} size="xl" className="mb-2">
                  {service.title}
                </Heading>
                <Text variant="muted" className="text-lg mb-6 italic">
                  {service.tagline}
                </Text>
                <Text className="mb-6">{service.description}</Text>
                <Button asChild>
                  <Link to="/contact">Discuss Your Project</Link>
                </Button>
              </div>
              <div className="space-y-8">
                <div>
                  <Heading level={3} size="sm" className="mb-3">
                    Key Benefits
                  </Heading>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <Text>{benefit}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={3} size="sm" className="mb-3">
                    Example Use Cases
                  </Heading>
                  <ul className="space-y-2">
                    {service.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-start gap-2">
                        <span className="text-muted-foreground">→</span>
                        <Text variant="muted">{useCase}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* CTA */}
      <Section size="lg" className="bg-primary text-primary-foreground">
        <Container size="sm" className="text-center">
          <Heading level={2} size="xl" className="mb-4">
            Ready to get started?
          </Heading>
          <Text size="lg" className="mb-8 opacity-90">
            Tell us about your project and we'll help you figure out the best path forward.
          </Text>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/contact">Start a Conversation</Link>
          </Button>
        </Container>
      </Section>
    </>
  )
}
```

**Step 2: Commit**

```bash
git add src/routes/services.tsx
git commit -m "feat: add services page with four detailed sections"
```

---

### Task 2: Create Contact Page with Chat Interface

**Files:**
- Create: `src/routes/contact.tsx`
- Create: `src/features/chat/components/ChatContainer.tsx`
- Create: `src/features/chat/hooks/useChat.ts`

**Step 1: Create the useChat hook**

```typescript
// src/features/chat/hooks/useChat.ts
import { useCallback, useState } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UseChatOptions {
  apiEndpoint?: string
}

export function useChat(options: UseChatOptions = {}) {
  const { apiEndpoint = '/api/chat' } = options
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm here to learn about your project. What are you looking to build with AI?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            sessionId,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const data = await response.json()

        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId)
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [apiEndpoint, sessionId]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
```

**Step 2: Create the ChatContainer component**

```typescript
// src/features/chat/components/ChatContainer.tsx
import { useRef, useEffect } from 'react'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { useChat, type Message } from '../hooks/useChat'
import { cn } from '@/lib/cn'

interface ChatContainerProps {
  className?: string
  apiEndpoint?: string
}

export function ChatContainer({ className, apiEndpoint }: ChatContainerProps) {
  const { messages, isLoading, error, sendMessage } = useChat({ apiEndpoint })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className={cn(
        'flex flex-col h-[600px] max-h-[80vh] border rounded-xl bg-background',
        className
      )}
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            sender={message.role === 'user' ? 'user' : 'assistant'}
          >
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
            {error}. Please try again.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <ChatInput onSend={sendMessage} loading={isLoading} />
      </div>
    </div>
  )
}
```

**Step 3: Create the contact page**

```typescript
// src/routes/contact.tsx
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { ChatContainer } from '@/features/chat/components/ChatContainer'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Section size="lg">
        <Container size="md">
          <div className="text-center mb-12">
            <Heading size="2xl" className="mb-4">
              Let's Talk
            </Heading>
            <Text size="lg" variant="muted" className="max-w-xl mx-auto">
              Tell us about your project. Our AI assistant will help us understand your needs
              and connect you with the right team.
            </Text>
          </div>

          {/* Chat Interface */}
          <div className="max-w-2xl mx-auto">
            <ChatContainer apiEndpoint={import.meta.env.VITE_CHAT_API_URL || '/api/chat'} />

            {/* Fallback Form Toggle */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                {showForm ? 'Use chat instead' : 'Prefer a traditional form?'}
              </button>
            </div>

            {/* Fallback Form */}
            {showForm && (
              <form
                className="mt-8 space-y-4 p-6 border rounded-xl bg-muted/30"
                onSubmit={(e) => {
                  e.preventDefault()
                  // TODO: Handle form submission
                }}
              >
                <Heading level={3} size="md" className="mb-4">
                  Contact Form
                </Heading>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <Input id="company" name="company" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            )}
          </div>
        </Container>
      </Section>

      {/* Contact Info */}
      <Section className="bg-muted/30">
        <Container size="sm" className="text-center">
          <Heading level={2} size="lg" className="mb-4">
            Other Ways to Reach Us
          </Heading>
          <Text variant="muted" className="mb-4">
            Email us directly at{' '}
            <a href="mailto:hello@vibes.run" className="text-primary hover:underline">
              hello@vibes.run
            </a>
          </Text>
        </Container>
      </Section>
    </>
  )
}
```

**Step 4: Update chat feature exports**

```typescript
// src/features/chat/index.ts
export { ChatBubble } from './components/ChatBubble'
export { ChatInput } from './components/ChatInput'
export { ChatContainer } from './components/ChatContainer'
export { useChat, type Message } from './hooks/useChat'
```

**Step 5: Commit**

```bash
git add src/routes/contact.tsx src/features/chat/
git commit -m "feat: add contact page with chat interface"
```

---

### Task 3: Expand Home Page

**Files:**
- Modify: `src/routes/index.tsx`

**Step 1: Expand home page with full content**

```typescript
// src/routes/index.tsx
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Grid } from '@/components/ui/Grid'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const services = [
  {
    title: 'Agent Development',
    description: 'End-to-end design and development of AI agents, from single-purpose assistants to multi-agent orchestrations.',
    href: '/services#agent-development',
  },
  {
    title: 'AI Strategy',
    description: 'Navigate the AI landscape with practical roadmaps that align with your business objectives.',
    href: '/services#ai-strategy',
  },
  {
    title: 'Product Development',
    description: 'Build AI-native products that leverage intelligence as a core differentiator.',
    href: '/services#product-development',
  },
  {
    title: 'Workshops',
    description: 'Empower your team with hands-on training to build and deploy AI agents independently.',
    href: '/services#workshops',
  },
]

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="xl" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="3xl" className="mb-6">
            The studio where AI agents come to life
          </Heading>
          <Text size="xl" variant="muted" className="mb-8 max-w-2xl mx-auto">
            Delivering impact you can measure. We build intelligent agents that understand your
            business and drive real results.
          </Text>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/contact">Let's Talk</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">See Our Services</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Social Proof Bar */}
      <Section size="sm" className="border-y bg-muted/30">
        <Container>
          <Text variant="muted" className="text-center text-sm">
            Trusted by innovative teams building the future with AI
          </Text>
        </Container>
      </Section>

      {/* Services Overview */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              What We Do
            </Heading>
            <Text variant="muted" size="lg" className="max-w-2xl mx-auto">
              From strategy to deployment, we help you build AI systems that work
            </Text>
          </div>
          <Grid cols={2} gap="lg">
            {services.map((service) => (
              <Card key={service.title} variant="interactive" asChild>
                <Link to={service.href}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="muted">{service.description}</Text>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </Grid>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/services">Learn More About Our Services</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* How We Work */}
      <Section className="bg-muted/30">
        <Container size="md">
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              How We Work
            </Heading>
            <Text variant="muted" size="lg">
              A collaborative approach focused on delivering real value
            </Text>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'We start by understanding your business, challenges, and goals through in-depth conversations.',
              },
              {
                step: '02',
                title: 'Design',
                description: 'We architect solutions that fit your specific needs, not one-size-fits-all templates.',
              },
              {
                step: '03',
                title: 'Deliver',
                description: 'We build iteratively, shipping value early and often with continuous feedback loops.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-primary mb-4">{item.step}</div>
                <Heading level={3} size="md" className="mb-2">
                  {item.title}
                </Heading>
                <Text variant="muted">{item.description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section size="lg" className="bg-primary text-primary-foreground">
        <Container size="sm" className="text-center">
          <Heading level={2} size="xl" className="mb-4">
            Ready to bring your AI vision to life?
          </Heading>
          <Text size="lg" className="mb-8 opacity-90">
            Tell us about your project and let's explore what's possible together.
          </Text>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/contact">Start a Conversation</Link>
          </Button>
        </Container>
      </Section>
    </>
  )
}
```

**Step 2: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: expand home page with full content and CTAs"
```

---

## Phase 1B: Backend

### Task 4: Set Up D1 Database Schema

**Files:**
- Create: `workers/chat-api/schema.sql`
- Modify: `workers/chat-api/wrangler.toml`

**Step 1: Create D1 schema**

```sql
-- workers/chat-api/schema.sql

-- Sessions for rate limiting and conversation tracking
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Conversation messages
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Extracted lead data
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  company TEXT,
  project_summary TEXT,
  problem TEXT,
  vision TEXT,
  users TEXT,
  capabilities TEXT,
  constraints TEXT,
  prd_draft TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_ip_hash ON sessions(ip_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
```

**Step 2: Update wrangler.toml with D1 binding**

```toml
# workers/chat-api/wrangler.toml
name = "vibes-chat-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGIN = "https://www.vibes.run"
MAX_MESSAGES_PER_SESSION = "20"

[[d1_databases]]
binding = "DB"
database_name = "vibes-chat"
database_id = "placeholder" # Replace after running: wrangler d1 create vibes-chat
```

**Step 3: Commit**

```bash
git add workers/chat-api/schema.sql workers/chat-api/wrangler.toml
git commit -m "feat: add D1 database schema for chat sessions and leads"
```

---

### Task 5: Implement Session Management

**Files:**
- Create: `workers/chat-api/src/session.ts`
- Create: `workers/chat-api/src/types.ts`

**Step 1: Create types**

```typescript
// workers/chat-api/src/types.ts
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
```

**Step 2: Create session management**

```typescript
// workers/chat-api/src/session.ts
import type { Env, Session, Message } from './types'

export function generateSessionId(): string {
  return crypto.randomUUID()
}

export function hashIP(ip: string): string {
  // Simple hash for privacy - in production, use a proper hashing algorithm
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + 'vibes-salt')
  return Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

export async function getOrCreateSession(
  db: D1Database,
  sessionId: string | undefined,
  ipHash: string
): Promise<Session> {
  if (sessionId) {
    const existing = await db
      .prepare('SELECT * FROM sessions WHERE id = ?')
      .bind(sessionId)
      .first<Session>()

    if (existing) {
      return existing
    }
  }

  // Create new session
  const newId = generateSessionId()
  await db
    .prepare(
      'INSERT INTO sessions (id, ip_hash, message_count) VALUES (?, ?, 0)'
    )
    .bind(newId, ipHash)
    .run()

  return {
    id: newId,
    ip_hash: ipHash,
    message_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function incrementMessageCount(
  db: D1Database,
  sessionId: string
): Promise<number> {
  await db
    .prepare(
      "UPDATE sessions SET message_count = message_count + 1, updated_at = datetime('now') WHERE id = ?"
    )
    .bind(sessionId)
    .run()

  const session = await db
    .prepare('SELECT message_count FROM sessions WHERE id = ?')
    .bind(sessionId)
    .first<{ message_count: number }>()

  return session?.message_count ?? 0
}

export async function saveMessage(
  db: D1Database,
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)'
    )
    .bind(sessionId, role, content)
    .run()
}

export async function getConversationHistory(
  db: D1Database,
  sessionId: string
): Promise<Message[]> {
  const result = await db
    .prepare(
      'SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC'
    )
    .bind(sessionId)
    .all<Message>()

  return result.results ?? []
}

export async function checkRateLimit(
  db: D1Database,
  sessionId: string,
  maxMessages: number
): Promise<{ allowed: boolean; remaining: number }> {
  const session = await db
    .prepare('SELECT message_count FROM sessions WHERE id = ?')
    .bind(sessionId)
    .first<{ message_count: number }>()

  const count = session?.message_count ?? 0
  return {
    allowed: count < maxMessages,
    remaining: Math.max(0, maxMessages - count),
  }
}
```

**Step 3: Commit**

```bash
git add workers/chat-api/src/
git commit -m "feat: implement session management for chat"
```

---

### Task 6: Implement Claude API Integration

**Files:**
- Create: `workers/chat-api/src/claude.ts`

**Step 1: Create Claude integration with PRD extraction**

```typescript
// workers/chat-api/src/claude.ts
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
  return data.content[0]?.text ?? 'I apologize, but I had trouble generating a response. Could you try again?'
}

export function isLeadComplete(response: string): boolean {
  return response.includes('LEAD_COMPLETE')
}

export function cleanResponse(response: string): string {
  // Remove the LEAD_COMPLETE marker from the visible response
  return response.replace(/LEAD_COMPLETE/g, '').trim()
}
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/claude.ts
git commit -m "feat: add Claude API integration with PRD extraction prompt"
```

---

### Task 7: Implement Lead Extraction

**Files:**
- Create: `workers/chat-api/src/leads.ts`

**Step 1: Create lead extraction logic**

```typescript
// workers/chat-api/src/leads.ts
import type { Message, Lead } from './types'

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

  const data = await response.json() as { content: Array<{ text: string }> }
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
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/leads.ts
git commit -m "feat: add lead extraction and PRD generation"
```

---

### Task 8: Implement Resend Email Notifications

**Files:**
- Create: `workers/chat-api/src/email.ts`

**Step 1: Create email notification**

```typescript
// workers/chat-api/src/email.ts
interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(
  apiKey: string,
  options: EmailOptions
): Promise<void> {
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
  conversationUrl?: string
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

      ${conversationUrl ? `
      <div class="section">
        <a href="${conversationUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Full Conversation</a>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      This lead was captured via the Vibes website chat.
    </div>
  </div>
</body>
</html>
`
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
  prdDraft: string
): Promise<void> {
  const subject = `New Lead: ${lead.company ?? lead.name ?? 'Unknown'} — ${lead.projectSummary?.slice(0, 50) ?? 'New inquiry'}${(lead.projectSummary?.length ?? 0) > 50 ? '...' : ''}`

  await sendEmail(resendApiKey, {
    to: notificationEmail,
    subject,
    html: formatLeadEmail(lead, prdDraft),
  })
}
```

**Step 2: Commit**

```bash
git add workers/chat-api/src/email.ts
git commit -m "feat: add Resend email notifications for leads"
```

---

### Task 9: Wire Up Main Worker Handler

**Files:**
- Modify: `workers/chat-api/src/index.ts`

**Step 1: Update the main worker with full implementation**

```typescript
// workers/chat-api/src/index.ts
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
import {
  extractLeadFromConversation,
  generatePRDDraft,
  saveLead,
} from './leads'
import { notifyTeam } from './email'

function getCorsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function jsonResponse(
  data: unknown,
  status: number,
  origin: string
): Response {
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
        const { allowed, remaining } = await checkRateLimit(env.DB, session.id, maxMessages)

        if (!allowed) {
          return jsonResponse(
            {
              error: 'Message limit reached for this session',
              message: "Thanks for your interest! You've reached the message limit. Please email us at hello@vibes.run to continue the conversation.",
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
            // Don't fail the response if lead extraction fails
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
```

**Step 2: Update wrangler.toml with additional secrets**

```toml
# workers/chat-api/wrangler.toml
name = "vibes-chat-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGIN = "https://www.vibes.run"
MAX_MESSAGES_PER_SESSION = "20"
NOTIFICATION_EMAIL = "team@vibes.run"

[[d1_databases]]
binding = "DB"
database_name = "vibes-chat"
database_id = "placeholder" # Replace after: wrangler d1 create vibes-chat

# Secrets (set via wrangler secret put):
# - ANTHROPIC_API_KEY
# - RESEND_API_KEY
```

**Step 3: Commit**

```bash
git add workers/chat-api/src/index.ts workers/chat-api/wrangler.toml
git commit -m "feat: wire up complete chat worker with Claude, D1, and Resend"
```

---

### Task 10: Add Cloudflare Rate Limiting Configuration

**Files:**
- Create: `workers/chat-api/README.md`

**Step 1: Create README with setup instructions**

```markdown
# Vibes Chat API Worker

Cloudflare Worker for the Vibes website chat interface.

## Setup

### 1. Create D1 Database

\`\`\`bash
wrangler d1 create vibes-chat
\`\`\`

Copy the database_id from the output and update `wrangler.toml`.

### 2. Run Migrations

\`\`\`bash
wrangler d1 execute vibes-chat --file=./schema.sql
\`\`\`

### 3. Set Secrets

\`\`\`bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put RESEND_API_KEY
\`\`\`

### 4. Configure Cloudflare Rate Limiting

In the Cloudflare dashboard:

1. Go to Security → WAF → Rate limiting rules
2. Create a new rule:
   - **Rule name:** Chat API Rate Limit
   - **If incoming requests match:** URI Path equals `/chat`
   - **Rate limit:** 10 requests per minute
   - **Action:** Block
   - **Duration:** 1 minute

This provides infrastructure-level protection against abuse. Session-based limits are handled in the worker code.

### 5. Deploy

\`\`\`bash
wrangler deploy
\`\`\`

## Local Development

\`\`\`bash
# Create a local D1 database
wrangler d1 execute vibes-chat --local --file=./schema.sql

# Run the worker locally
wrangler dev
\`\`\`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ALLOWED_ORIGIN` | CORS origin (e.g., `https://www.vibes.run`) |
| `MAX_MESSAGES_PER_SESSION` | Max messages per chat session (default: 20) |
| `NOTIFICATION_EMAIL` | Email address for lead notifications |
| `ANTHROPIC_API_KEY` | Anthropic API key (secret) |
| `RESEND_API_KEY` | Resend API key (secret) |
```

**Step 2: Commit**

```bash
git add workers/chat-api/README.md
git commit -m "docs: add chat worker setup instructions"
```

---

## Phase 1C: Integration

### Task 11: Update Environment Configuration

**Files:**
- Create: `.env.example`
- Modify: `src/routes/contact.tsx` (already done in Task 2)

**Step 1: Create environment example**

```bash
# .env.example
# Chat API endpoint (local dev or production worker URL)
VITE_CHAT_API_URL=http://localhost:8787
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add environment configuration example"
```

---

### Task 12: Add E2E Tests for Chat Flow

**Files:**
- Create: `e2e/contact.spec.ts`

**Step 1: Create E2E test for contact page**

```typescript
// e2e/contact.spec.ts
import { expect, test } from '@playwright/test'

test.describe('Contact Page', () => {
  test('displays chat interface', async ({ page }) => {
    await page.goto('/contact')

    // Check heading
    await expect(page.getByRole('heading', { name: /let's talk/i })).toBeVisible()

    // Check chat container exists
    await expect(page.locator('[class*="ChatContainer"]')).toBeVisible()

    // Check welcome message
    await expect(page.getByText(/what are you looking to build/i)).toBeVisible()

    // Check input and send button
    await expect(page.getByPlaceholder(/type a message/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
  })

  test('can toggle to fallback form', async ({ page }) => {
    await page.goto('/contact')

    // Click to show form
    await page.getByText(/prefer a traditional form/i).click()

    // Check form fields appear
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/company/i)).toBeVisible()
  })

  test('send button is disabled when input is empty', async ({ page }) => {
    await page.goto('/contact')

    const sendButton = page.getByRole('button', { name: /send/i })
    await expect(sendButton).toBeDisabled()
  })
})
```

**Step 2: Commit**

```bash
git add e2e/contact.spec.ts
git commit -m "test: add E2E tests for contact page"
```

---

### Task 13: Add E2E Tests for Services Page

**Files:**
- Create: `e2e/services.spec.ts`

**Step 1: Create E2E test for services page**

```typescript
// e2e/services.spec.ts
import { expect, test } from '@playwright/test'

test.describe('Services Page', () => {
  test('displays all four services', async ({ page }) => {
    await page.goto('/services')

    // Check main heading
    await expect(page.getByRole('heading', { name: /what we do/i })).toBeVisible()

    // Check all service sections
    await expect(page.getByRole('heading', { name: /agent development/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /ai strategy/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /product development/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /workshops/i })).toBeVisible()
  })

  test('service sections have CTAs', async ({ page }) => {
    await page.goto('/services')

    // Check CTA buttons exist
    const ctaButtons = page.getByRole('link', { name: /discuss your project/i })
    await expect(ctaButtons.first()).toBeVisible()
  })

  test('can navigate to contact from CTA', async ({ page }) => {
    await page.goto('/services')

    // Click first CTA
    await page.getByRole('link', { name: /discuss your project/i }).first().click()

    // Should navigate to contact
    await expect(page).toHaveURL('/contact')
  })

  test('final CTA section is visible', async ({ page }) => {
    await page.goto('/services')

    // Scroll to bottom
    await page.getByRole('heading', { name: /ready to get started/i }).scrollIntoViewIfNeeded()

    await expect(page.getByRole('heading', { name: /ready to get started/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /start a conversation/i })).toBeVisible()
  })
})
```

**Step 2: Commit**

```bash
git add e2e/services.spec.ts
git commit -m "test: add E2E tests for services page"
```

---

### Task 14: Update Home Page E2E Tests

**Files:**
- Modify: `e2e/home.spec.ts`

**Step 1: Update home page tests**

```typescript
// e2e/home.spec.ts
import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('displays hero section with main CTA', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /the studio where ai agents come to life/i })
    ).toBeVisible()

    await expect(page.getByRole('link', { name: /let's talk/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /see our services/i })).toBeVisible()
  })

  test('displays services overview section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /what we do/i })).toBeVisible()

    // Check service cards
    await expect(page.getByText(/agent development/i).first()).toBeVisible()
    await expect(page.getByText(/ai strategy/i).first()).toBeVisible()
  })

  test('displays how we work section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /how we work/i })).toBeVisible()
    await expect(page.getByText(/discover/i)).toBeVisible()
    await expect(page.getByText(/design/i)).toBeVisible()
    await expect(page.getByText(/deliver/i)).toBeVisible()
  })

  test('CTA navigates to contact page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /let's talk/i }).first().click()

    await expect(page).toHaveURL('/contact')
  })

  test('services CTA navigates to services page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /see our services/i }).click()

    await expect(page).toHaveURL('/services')
  })
})
```

**Step 2: Commit**

```bash
git add e2e/home.spec.ts
git commit -m "test: update home page E2E tests"
```

---

### Task 15: Update PROGRESS.md with New Phase Structure

**Files:**
- Modify: `docs/PROGRESS.md`

**Step 1: Update progress with restructured phases**

Update the Phase Overview table and add Phase 2 (Brand Identity). Mark Phase 1 tasks as appropriate based on what's been implemented.

**Step 2: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: update PROGRESS.md with restructured phases"
```

---

### Task 16: Final Verification

**Step 1: Install dependencies**

```bash
pnpm install
```

**Step 2: Run all checks**

```bash
just check
```

Expected: All checks pass

**Step 3: Start dev server and verify pages**

```bash
just dev
```

Verify:
- http://localhost:3000 — Home page loads with full content
- http://localhost:3000/services — Services page shows all four services
- http://localhost:3000/contact — Contact page shows chat interface

**Step 4: Visual component review**

```bash
just ladle
```

Verify chat components render correctly.

**Step 5: Run E2E tests**

```bash
just e2e
```

Expected: All E2E tests pass

**Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any remaining issues"
```

---

## Summary

This implementation plan completes Phase 1 (Foundation/MVP) with:

**Pages:**
- ✅ Home page with full content, CTAs, and "How We Work" section
- ✅ Services page with four detailed service sections
- ✅ Contact page with chat interface and fallback form

**Backend:**
- ✅ D1 database schema for sessions, messages, and leads
- ✅ Session management with rate limiting
- ✅ Claude API integration with PRD extraction prompt
- ✅ Lead extraction and PRD draft generation
- ✅ Resend email notifications
- ✅ Cloudflare rate limiting configuration

**Testing:**
- ✅ E2E tests for all pages
- ✅ Chat flow testing

**Total Tasks:** 16
**Estimated Commits:** ~16

**Next Steps:**
1. Deploy worker: `cd workers/chat-api && wrangler deploy`
2. Set secrets: `wrangler secret put ANTHROPIC_API_KEY`, etc.
3. Configure Cloudflare rate limiting in dashboard
4. Update VITE_CHAT_API_URL in production environment
