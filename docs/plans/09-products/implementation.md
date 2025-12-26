# Products Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add product showcase pages for Vibes and Volt with waitlist email capture.

**Architecture:** Three new routes (`/products`, `/products/vibes`, `/products/volt`) with shared product components. Waitlist API endpoint stores emails in D1. Placeholder assets for screenshots that can be swapped later.

**Tech Stack:** TanStack Start, Tailwind CSS, class-variance-authority, Cloudflare Workers/D1

---

## Task 1: Waitlist Database Migration

**Files:**
- Create: `workers/chat-api/migrations/0003_waitlist.sql`

**Step 1: Write the migration**

```sql
-- 0003_waitlist.sql
CREATE TABLE waitlist (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  referrer TEXT,
  user_agent TEXT,
  UNIQUE(email, product)
);

CREATE INDEX idx_waitlist_product ON waitlist(product);
CREATE INDEX idx_waitlist_created ON waitlist(created_at);
```

**Step 2: Run migration locally**

```bash
just worker-migrate local
```

Expected: Migration applies successfully

**Step 3: Commit**

```bash
git add workers/chat-api/migrations/0003_waitlist.sql
git commit -m "feat: add waitlist table migration"
```

---

## Task 2: Waitlist API Endpoint

**Files:**
- Modify: `workers/chat-api/src/index.ts`
- Create: `workers/chat-api/src/waitlist.ts`

**Step 1: Create waitlist module**

Create `workers/chat-api/src/waitlist.ts`:

```typescript
import type { D1Database } from '@cloudflare/workers-types'

export interface WaitlistEntry {
  email: string
  product: string
  referrer?: string
  userAgent?: string
}

const VALID_PRODUCTS = new Set(['volt', 'vibes'])

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidProduct(product: string): boolean {
  return VALID_PRODUCTS.has(product)
}

export async function addToWaitlist(
  db: D1Database,
  entry: WaitlistEntry,
): Promise<{ success: boolean; error?: string }> {
  if (!isValidEmail(entry.email)) {
    return { success: false, error: 'Invalid email format' }
  }

  if (!isValidProduct(entry.product)) {
    return { success: false, error: 'Invalid product' }
  }

  try {
    await db
      .prepare(
        `INSERT INTO waitlist (email, product, referrer, user_agent)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (email, product) DO NOTHING`,
      )
      .bind(entry.email.toLowerCase(), entry.product, entry.referrer ?? null, entry.userAgent ?? null)
      .run()

    return { success: true }
  } catch (err) {
    console.error('Waitlist insert error:', err)
    return { success: false, error: 'Failed to join waitlist' }
  }
}
```

**Step 2: Add route to worker**

In `workers/chat-api/src/index.ts`, add after the `/chat` route (around line 228):

```typescript
import { addToWaitlist } from './waitlist'

// ... existing code ...

    if (url.pathname === '/waitlist' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { email: string; product: string }
        const referrer = request.headers.get('Referer') ?? undefined
        const userAgent = request.headers.get('User-Agent') ?? undefined

        const result = await addToWaitlist(env.DB, {
          email: body.email,
          product: body.product,
          referrer,
          userAgent,
        })

        if (!result.success) {
          return jsonResponse({ error: result.error }, 400, origin)
        }

        return jsonResponse({ success: true }, 200, origin)
      } catch (err) {
        console.error('Waitlist error:', err)
        return jsonResponse({ error: 'Invalid request' }, 400, origin)
      }
    }
```

**Step 3: Test locally**

```bash
just worker-dev
# In another terminal:
curl -X POST http://localhost:8787/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","product":"volt"}'
```

Expected: `{"success":true}`

**Step 4: Commit**

```bash
git add workers/chat-api/src/waitlist.ts workers/chat-api/src/index.ts
git commit -m "feat: add waitlist API endpoint"
```

---

## Task 3: StatusBadge Component

**Files:**
- Create: `src/components/products/StatusBadge/StatusBadge.tsx`
- Create: `src/components/products/StatusBadge/StatusBadge.test.tsx`
- Create: `src/components/products/StatusBadge/index.ts`

**Step 1: Write the failing test**

Create `src/components/products/StatusBadge/StatusBadge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders available status with green styling', () => {
    render(<StatusBadge status="available" />)
    const badge = screen.getByText('Available')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-500/10')
  })

  it('renders coming-soon status with amber styling', () => {
    render(<StatusBadge status="coming-soon" />)
    const badge = screen.getByText('Coming Soon')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-amber-500/10')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test src/components/products/StatusBadge/StatusBadge.test.tsx
```

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/products/StatusBadge/StatusBadge.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-heading uppercase tracking-wide',
  {
    variants: {
      status: {
        available: 'bg-green-500/10 text-green-400 border border-green-500/20',
        'coming-soon': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      },
    },
    defaultVariants: {
      status: 'available',
    },
  },
)

export type ProductStatus = 'available' | 'coming-soon'

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  status: ProductStatus
  className?: string
}

const statusLabels: Record<ProductStatus, string> = {
  available: 'Available',
  'coming-soon': 'Coming Soon',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ status }), className)}>{statusLabels[status]}</span>
}
```

Create `src/components/products/StatusBadge/index.ts`:

```typescript
export { StatusBadge, type ProductStatus } from './StatusBadge'
```

**Step 4: Run test to verify it passes**

```bash
pnpm test src/components/products/StatusBadge/StatusBadge.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products/StatusBadge/
git commit -m "feat: add StatusBadge component"
```

---

## Task 4: CodeBlock Component

**Files:**
- Create: `src/components/products/CodeBlock/CodeBlock.tsx`
- Create: `src/components/products/CodeBlock/CodeBlock.test.tsx`
- Create: `src/components/products/CodeBlock/index.ts`

**Step 1: Write the failing test**

Create `src/components/products/CodeBlock/CodeBlock.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CodeBlock } from './CodeBlock'

// Mock clipboard API
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText },
})

describe('CodeBlock', () => {
  it('renders the code content', () => {
    render(<CodeBlock code="npm install vibes" />)
    expect(screen.getByText('npm install vibes')).toBeInTheDocument()
  })

  it('copies code to clipboard when copy button is clicked', async () => {
    mockWriteText.mockResolvedValueOnce(undefined)
    render(<CodeBlock code="curl example.com" />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)

    expect(mockWriteText).toHaveBeenCalledWith('curl example.com')
  })

  it('shows copied feedback after clicking', async () => {
    mockWriteText.mockResolvedValueOnce(undefined)
    render(<CodeBlock code="test" />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)

    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test src/components/products/CodeBlock/CodeBlock.test.tsx
```

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/products/CodeBlock/CodeBlock.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  className?: string
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-lg bg-muted/50 border border-border px-4 py-3 font-mono text-sm',
        className,
      )}
    >
      <code className="flex-1 text-foreground">{code}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
```

Create `src/components/products/CodeBlock/index.ts`:

```typescript
export { CodeBlock } from './CodeBlock'
```

**Step 4: Run test to verify it passes**

```bash
pnpm test src/components/products/CodeBlock/CodeBlock.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products/CodeBlock/
git commit -m "feat: add CodeBlock component with copy functionality"
```

---

## Task 5: FeatureGrid Component

**Files:**
- Create: `src/components/products/FeatureGrid/FeatureGrid.tsx`
- Create: `src/components/products/FeatureGrid/FeatureGrid.test.tsx`
- Create: `src/components/products/FeatureGrid/index.ts`

**Step 1: Write the failing test**

Create `src/components/products/FeatureGrid/FeatureGrid.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeatureGrid } from './FeatureGrid'

const features = [
  { title: 'Remote Access', description: 'Control from anywhere' },
  { title: 'Plugin System', description: 'Extend with plugins' },
]

describe('FeatureGrid', () => {
  it('renders all feature titles', () => {
    render(<FeatureGrid features={features} />)
    expect(screen.getByText('Remote Access')).toBeInTheDocument()
    expect(screen.getByText('Plugin System')).toBeInTheDocument()
  })

  it('renders all feature descriptions', () => {
    render(<FeatureGrid features={features} />)
    expect(screen.getByText('Control from anywhere')).toBeInTheDocument()
    expect(screen.getByText('Extend with plugins')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test src/components/products/FeatureGrid/FeatureGrid.test.tsx
```

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/products/FeatureGrid/FeatureGrid.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { Heading, Text } from '@/components/ui'

export interface Feature {
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3
  className?: string
}

export function FeatureGrid({ features, columns = 2, className }: FeatureGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
        className,
      )}
    >
      {features.map((feature) => (
        <div key={feature.title} className="space-y-2">
          <Heading level={3} size="sm">
            {feature.title}
          </Heading>
          <Text variant="muted">{feature.description}</Text>
        </div>
      ))}
    </div>
  )
}
```

Create `src/components/products/FeatureGrid/index.ts`:

```typescript
export { FeatureGrid, type Feature } from './FeatureGrid'
```

**Step 4: Run test to verify it passes**

```bash
pnpm test src/components/products/FeatureGrid/FeatureGrid.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products/FeatureGrid/
git commit -m "feat: add FeatureGrid component"
```

---

## Task 6: BuiltByVibes Component

**Files:**
- Create: `src/components/products/BuiltByVibes/BuiltByVibes.tsx`
- Create: `src/components/products/BuiltByVibes/BuiltByVibes.test.tsx`
- Create: `src/components/products/BuiltByVibes/index.ts`

**Step 1: Write the failing test**

Create `src/components/products/BuiltByVibes/BuiltByVibes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { BuiltByVibes } from './BuiltByVibes'

function renderWithRouter(component: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => component })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(<RouterProvider router={router} />)
}

describe('BuiltByVibes', () => {
  it('renders the callout text', () => {
    renderWithRouter(<BuiltByVibes />)
    expect(screen.getByText(/Built by Vibes/i)).toBeInTheDocument()
  })

  it('renders link to contact page', () => {
    renderWithRouter(<BuiltByVibes />)
    const link = screen.getByRole('link', { name: /let's talk/i })
    expect(link).toHaveAttribute('href', '/contact')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test src/components/products/BuiltByVibes/BuiltByVibes.test.tsx
```

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/products/BuiltByVibes/BuiltByVibes.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { Text } from '@/components/ui'
import { Link } from '@tanstack/react-router'

interface BuiltByVibesProps {
  className?: string
}

export function BuiltByVibes({ className }: BuiltByVibesProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-muted/30 p-6 text-center',
        className,
      )}
    >
      <Text variant="muted">
        Built by{' '}
        <span className="font-semibold text-foreground">Vibes</span>, the
        agentic consulting studio.{' '}
        <Link
          to="/contact"
          className="text-accent hover:text-accent/80 transition-colors font-medium"
        >
          Let's talk →
        </Link>
      </Text>
    </div>
  )
}
```

Create `src/components/products/BuiltByVibes/index.ts`:

```typescript
export { BuiltByVibes } from './BuiltByVibes'
```

**Step 4: Run test to verify it passes**

```bash
pnpm test src/components/products/BuiltByVibes/BuiltByVibes.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products/BuiltByVibes/
git commit -m "feat: add BuiltByVibes lead-gen callout component"
```

---

## Task 7: WaitlistForm Component

**Files:**
- Create: `src/components/products/WaitlistForm/WaitlistForm.tsx`
- Create: `src/components/products/WaitlistForm/WaitlistForm.test.tsx`
- Create: `src/components/products/WaitlistForm/index.ts`

**Step 1: Write the failing test**

Create `src/components/products/WaitlistForm/WaitlistForm.test.tsx`:

```tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { WaitlistForm } from './WaitlistForm'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('WaitlistForm', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders email input and submit button', () => {
    render(<WaitlistForm product="volt" />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get early access/i })).toBeInTheDocument()
  })

  it('submits email to waitlist API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<WaitlistForm product="volt" />)

    const input = screen.getByPlaceholderText(/email/i)
    const button = screen.getByRole('button', { name: /get early access/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/waitlist'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', product: 'volt' }),
        }),
      )
    })
  })

  it('shows success message after submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<WaitlistForm product="volt" />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument()
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test src/components/products/WaitlistForm/WaitlistForm.test.tsx
```

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/products/WaitlistForm/WaitlistForm.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { Button, Input, Text } from '@/components/ui'
import { useState } from 'react'

interface WaitlistFormProps {
  product: string
  className?: string
}

export function WaitlistForm({ product, className }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const apiUrl = import.meta.env.VITE_CHAT_API_URL || ''
      const response = await fetch(`${apiUrl}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('text-center', className)}>
        <Text className="text-green-400">
          You're on the list! We'll notify you when {product === 'volt' ? 'Volt' : 'Vibes'} launches.
        </Text>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-3 max-w-md mx-auto', className)}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="flex-1"
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining...' : 'Get Early Access'}
      </Button>
      {status === 'error' && (
        <Text variant="muted" className="text-red-400 text-sm mt-2">
          {errorMessage}
        </Text>
      )}
    </form>
  )
}
```

Create `src/components/products/WaitlistForm/index.ts`:

```typescript
export { WaitlistForm } from './WaitlistForm'
```

**Step 4: Run test to verify it passes**

```bash
pnpm test src/components/products/WaitlistForm/WaitlistForm.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products/WaitlistForm/
git commit -m "feat: add WaitlistForm component for email capture"
```

---

## Task 8: ProductCard Component

**Files:**
- Create: `src/components/products/ProductCard/ProductCard.tsx`
- Create: `src/components/products/ProductCard/ProductCard.test.tsx`
- Create: `src/components/products/ProductCard/index.ts`

**Step 1: Write the failing test**

Create `src/components/products/ProductCard/ProductCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import { ProductCard } from './ProductCard'

function renderWithRouter(component: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => component })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(<RouterProvider router={router} />)
}

describe('ProductCard', () => {
  const props = {
    name: 'Vibes',
    tagline: 'Remote control for Claude Code',
    status: 'available' as const,
    features: ['Feature 1', 'Feature 2'],
    href: '/products/vibes',
  }

  it('renders product name and tagline', () => {
    renderWithRouter(<ProductCard {...props} />)
    expect(screen.getByText('Vibes')).toBeInTheDocument()
    expect(screen.getByText('Remote control for Claude Code')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    renderWithRouter(<ProductCard {...props} />)
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('renders feature list', () => {
    renderWithRouter(<ProductCard {...props} />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })

  it('renders link to product page', () => {
    renderWithRouter(<ProductCard {...props} />)
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute(
      'href',
      '/products/vibes',
    )
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test src/components/products/ProductCard/ProductCard.test.tsx
```

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/products/ProductCard/ProductCard.tsx`:

```tsx
import { cn } from '@/lib/cn'
import { Card, CardContent, Heading, Text } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { StatusBadge, type ProductStatus } from '../StatusBadge'

interface ProductCardProps {
  name: string
  tagline: string
  status: ProductStatus
  features: string[]
  href: string
  image?: string
  className?: string
}

export function ProductCard({
  name,
  tagline,
  status,
  features,
  href,
  image,
  className,
}: ProductCardProps) {
  return (
    <Card variant="interactive" className={cn('overflow-hidden', className)}>
      {image && (
        <div className="aspect-video bg-muted/50 border-b border-border">
          <img src={image} alt={`${name} screenshot`} className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
        </div>
        <div>
          <Heading level={3} size="lg" className="mb-1">
            {name}
          </Heading>
          <Text variant="muted">{tagline}</Text>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <Text size="sm">{feature}</Text>
            </li>
          ))}
        </ul>
        <Link
          to={href}
          className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors"
        >
          Learn More →
        </Link>
      </CardContent>
    </Card>
  )
}
```

Create `src/components/products/ProductCard/index.ts`:

```typescript
export { ProductCard } from './ProductCard'
```

**Step 4: Run test to verify it passes**

```bash
pnpm test src/components/products/ProductCard/ProductCard.test.tsx
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/products/ProductCard/
git commit -m "feat: add ProductCard component for products index"
```

---

## Task 9: Products Index Export

**Files:**
- Create: `src/components/products/index.ts`

**Step 1: Create barrel export**

Create `src/components/products/index.ts`:

```typescript
export { StatusBadge, type ProductStatus } from './StatusBadge'
export { CodeBlock } from './CodeBlock'
export { FeatureGrid, type Feature } from './FeatureGrid'
export { BuiltByVibes } from './BuiltByVibes'
export { WaitlistForm } from './WaitlistForm'
export { ProductCard } from './ProductCard'
```

**Step 2: Commit**

```bash
git add src/components/products/index.ts
git commit -m "feat: add products components barrel export"
```

---

## Task 10: Placeholder Assets

**Files:**
- Create: `public/images/products/vibes-terminal.svg`
- Create: `public/images/products/volt-dashboard.svg`
- Create: `public/images/products/volt-bg.svg`

**Step 1: Create placeholder directory**

```bash
mkdir -p public/images/products
```

**Step 2: Create Vibes terminal placeholder**

Create `public/images/products/vibes-terminal.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" fill="none">
  <rect width="800" height="450" fill="#1a1a1a"/>
  <rect x="20" y="20" width="760" height="410" rx="8" fill="#0d0d0d" stroke="#333" stroke-width="1"/>
  <circle cx="45" cy="40" r="6" fill="#ff5f56"/>
  <circle cx="65" cy="40" r="6" fill="#ffbd2e"/>
  <circle cx="85" cy="40" r="6" fill="#27c93f"/>
  <text x="40" y="90" fill="#888" font-family="monospace" font-size="14">$ vibes claude "refactor the auth module"</text>
  <text x="40" y="120" fill="#27c93f" font-family="monospace" font-size="14">✓ Session started</text>
  <text x="40" y="150" fill="#888" font-family="monospace" font-size="14">→ Web UI available at http://localhost:7432</text>
  <text x="40" y="200" fill="#666" font-family="monospace" font-size="12">[Placeholder - replace with real screenshot]</text>
</svg>
```

**Step 3: Create Volt dashboard placeholder**

Create `public/images/products/volt-dashboard.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" fill="none">
  <rect width="800" height="450" fill="#0a0a0a"/>
  <rect x="20" y="20" width="200" height="410" fill="#111" stroke="#222" stroke-width="1"/>
  <rect x="240" y="20" width="540" height="200" fill="#111" stroke="#222" stroke-width="1"/>
  <rect x="240" y="240" width="260" height="190" fill="#111" stroke="#222" stroke-width="1"/>
  <rect x="520" y="240" width="260" height="190" fill="#111" stroke="#222" stroke-width="1"/>
  <text x="40" y="50" fill="#888" font-family="sans-serif" font-size="12">IV Surface</text>
  <text x="260" y="50" fill="#888" font-family="sans-serif" font-size="12">Greeks Chart</text>
  <text x="260" y="270" fill="#888" font-family="sans-serif" font-size="12">P&amp;L Attribution</text>
  <text x="540" y="270" fill="#888" font-family="sans-serif" font-size="12">Risk Limits</text>
  <text x="400" y="130" fill="#444" font-family="sans-serif" font-size="14" text-anchor="middle">[Placeholder - replace with real screenshot]</text>
</svg>
```

**Step 4: Create Volt background placeholder**

Create `public/images/products/volt-bg.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" fill="none">
  <rect width="1920" height="1080" fill="#050505"/>
  <defs>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="60"/>
    </filter>
  </defs>
  <rect x="200" y="100" width="600" height="400" fill="#1a1a2e" filter="url(#blur)" opacity="0.5"/>
  <rect x="800" y="300" width="500" height="300" fill="#16213e" filter="url(#blur)" opacity="0.4"/>
  <rect x="400" y="500" width="700" height="350" fill="#0f3460" filter="url(#blur)" opacity="0.3"/>
</svg>
```

**Step 5: Commit**

```bash
git add public/images/products/
git commit -m "feat: add placeholder product images"
```

---

## Task 11: Products Index Route

**Files:**
- Create: `src/routes/products/index.tsx`

**Step 1: Create products index route**

Create `src/routes/products/index.tsx`:

```tsx
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { ProductCard } from '@/components/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
})

const products = [
  {
    name: 'Vibes',
    tagline: 'Remote control for your Claude Code sessions',
    status: 'available' as const,
    features: [
      'Control sessions from any device',
      'Native Rust plugin system',
      'Real-time session mirroring',
    ],
    href: '/products/vibes',
    image: '/images/products/vibes-terminal.svg',
  },
  {
    name: 'Volt',
    tagline: 'Volatility analysis & trade execution',
    status: 'coming-soon' as const,
    features: [
      'IV surfaces and Greeks analytics',
      '11 options strategies built-in',
      'Backtest with synthetic or real data',
    ],
    href: '/products/volt',
    image: '/images/products/volt-dashboard.svg',
  },
]

function ProductsPage() {
  return (
    <>
      <Section size="lg" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="2xl" className="mb-6">
            What We're Building
          </Heading>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
            Open source tools and platforms from the Vibes studio.
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
```

**Step 2: Test dev server**

```bash
pnpm dev
# Navigate to http://localhost:3000/products
```

Expected: Products index page renders with both product cards

**Step 3: Commit**

```bash
git add src/routes/products/index.tsx
git commit -m "feat: add products index page"
```

---

## Task 12: Vibes Product Route

**Files:**
- Create: `src/routes/products/vibes.tsx`

**Step 1: Create Vibes product route**

Create `src/routes/products/vibes.tsx`:

```tsx
import { Button, Container, Heading, Section, Text } from '@/components/ui'
import { BuiltByVibes, CodeBlock, FeatureGrid } from '@/components/products'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/products/vibes')({
  component: VibesPage,
})

const features = [
  {
    title: 'Remote Access',
    description: 'Control Claude Code sessions from your phone, tablet, or any device via web UI.',
  },
  {
    title: 'Session Mirroring',
    description: 'Real-time sync between your terminal and remote devices.',
  },
  {
    title: 'Plugin System',
    description: 'Extend vibes with native Rust plugins for custom commands and workflows.',
  },
  {
    title: 'Cross-Platform',
    description: 'Single binary for Linux, macOS, and Windows.',
  },
]

const steps = [
  { step: '1', title: 'Install', description: 'Run the install command' },
  { step: '2', title: 'Start', description: 'Run vibes claude with your prompt' },
  { step: '3', title: 'Access', description: 'Open the web UI from any device' },
]

function VibesPage() {
  return (
    <>
      {/* Hero */}
      <Section size="xl" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="3xl" className="mb-4">
            Vibes
          </Heading>
          <Text size="xl" className="mb-6 text-accent">
            Remote control for your Claude Code sessions
          </Text>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto mb-8">
            Wrap Claude Code with remote access, session management, and a plugin ecosystem —
            control your AI coding sessions from anywhere.
          </Text>

          <div className="max-w-lg mx-auto mb-6">
            <CodeBlock code="curl -sSf https://vibes.run/install | sh" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <a href="https://github.com/run-vibes/vibes" target="_blank" rel="noopener noreferrer">
                Star on GitHub
              </a>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a href="https://github.com/run-vibes/vibes#readme" target="_blank" rel="noopener noreferrer">
                Documentation
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Screenshot */}
      <Section className="bg-muted/30">
        <Container>
          <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
            <img
              src="/images/products/vibes-terminal.svg"
              alt="Vibes terminal interface"
              className="w-full"
            />
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <Heading level={2} size="xl" className="text-center mb-12">
            Features
          </Heading>
          <FeatureGrid features={features} columns={2} />
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="bg-muted/30">
        <Container>
          <Heading level={2} size="xl" className="text-center mb-12">
            How It Works
          </Heading>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <Heading level={3} size="md" className="mb-2">
                  {item.title}
                </Heading>
                <Text variant="muted">{item.description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container size="sm">
          <BuiltByVibes />
        </Container>
      </Section>
    </>
  )
}
```

**Step 2: Test dev server**

```bash
pnpm dev
# Navigate to http://localhost:3000/products/vibes
```

Expected: Vibes product page renders with hero, features, how it works, and callout

**Step 3: Commit**

```bash
git add src/routes/products/vibes.tsx
git commit -m "feat: add Vibes product page"
```

---

## Task 13: Volt Teaser Route

**Files:**
- Create: `src/routes/products/volt.tsx`

**Step 1: Create Volt teaser route**

Create `src/routes/products/volt.tsx`:

```tsx
import { Container, Heading, Section, Text } from '@/components/ui'
import { BuiltByVibes, StatusBadge, WaitlistForm } from '@/components/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/volt')({
  component: VoltPage,
})

const screenshots = [
  { src: '/images/products/volt-dashboard.svg', caption: 'IV Surface Visualization' },
]

function VoltPage() {
  return (
    <>
      {/* Hero with atmospheric background */}
      <Section
        size="xl"
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/products/volt-bg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <Container size="sm" className="relative text-center">
          <StatusBadge status="coming-soon" className="mb-6" />
          <Heading size="3xl" className="mb-4">
            Volt
          </Heading>
          <Text size="xl" className="mb-6 text-accent">
            Volatility analysis, simulation & trade execution
          </Text>
          <Text size="lg" variant="muted" className="max-w-xl mx-auto mb-10">
            A comprehensive platform for traders who want to analyze options volatility,
            backtest strategies, and execute with confidence.
          </Text>

          <WaitlistForm product="volt" />
        </Container>
      </Section>

      {/* Screenshot Gallery */}
      <Section>
        <Container>
          <Heading level={2} size="xl" className="text-center mb-12">
            Preview
          </Heading>
          <div className="grid gap-8">
            {screenshots.map((screenshot) => (
              <div key={screenshot.caption} className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
                  <img
                    src={screenshot.src}
                    alt={screenshot.caption}
                    className="w-full"
                  />
                </div>
                <Text variant="muted" className="text-center text-sm">
                  {screenshot.caption}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container size="sm">
          <BuiltByVibes />
        </Container>
      </Section>
    </>
  )
}
```

**Step 2: Test dev server**

```bash
pnpm dev
# Navigate to http://localhost:3000/products/volt
```

Expected: Volt teaser page renders with atmospheric hero, waitlist form, and screenshots

**Step 3: Commit**

```bash
git add src/routes/products/volt.tsx
git commit -m "feat: add Volt teaser page with waitlist"
```

---

## Task 14: Update Navbar

**Files:**
- Modify: `src/components/navigation/Navbar.tsx`

**Step 1: Add Products link to navbar**

In `src/components/navigation/Navbar.tsx`, add Products link after the logo and before Services:

```tsx
<div className="flex items-center gap-8">
  <Link
    to="/products"
    className="font-heading text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
  >
    Products
  </Link>
  <Link
    to="/services"
    className="font-heading text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
  >
    Services
  </Link>
  <Link
    to="/contact"
    className="font-heading text-sm font-semibold uppercase tracking-wide bg-accent text-background px-4 py-2 rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-glow"
  >
    Let's Talk
  </Link>
</div>
```

**Step 2: Test navigation**

```bash
pnpm dev
# Click Products in navbar, verify navigation works
```

Expected: Products link appears and navigates to /products

**Step 3: Commit**

```bash
git add src/components/navigation/Navbar.tsx
git commit -m "feat: add Products link to navbar"
```

---

## Task 15: E2E Tests

**Files:**
- Create: `e2e/products.spec.ts`

**Step 1: Write E2E tests**

Create `e2e/products.spec.ts`:

```typescript
import { expect, test } from '@playwright/test'

test.describe('Products Pages', () => {
  test('products index displays both products', async ({ page }) => {
    await page.goto('/products')

    await expect(page.getByRole('heading', { name: "What We're Building" })).toBeVisible()
    await expect(page.getByText('Vibes')).toBeVisible()
    await expect(page.getByText('Volt')).toBeVisible()
    await expect(page.getByText('Available')).toBeVisible()
    await expect(page.getByText('Coming Soon')).toBeVisible()
  })

  test('can navigate to Vibes product page', async ({ page }) => {
    await page.goto('/products')

    await page.getByRole('link', { name: /learn more/i }).first().click()
    await expect(page).toHaveURL('/products/vibes')
    await expect(page.getByRole('heading', { name: 'Vibes', level: 1 })).toBeVisible()
  })

  test('Vibes page shows install command', async ({ page }) => {
    await page.goto('/products/vibes')

    await expect(page.getByText('curl -sSf https://vibes.run/install | sh')).toBeVisible()
    await expect(page.getByRole('link', { name: /star on github/i })).toBeVisible()
  })

  test('can navigate to Volt teaser page', async ({ page }) => {
    await page.goto('/products')

    await page.getByRole('link', { name: /learn more/i }).last().click()
    await expect(page).toHaveURL('/products/volt')
    await expect(page.getByRole('heading', { name: 'Volt', level: 1 })).toBeVisible()
  })

  test('Volt page shows waitlist form', async ({ page }) => {
    await page.goto('/products/volt')

    await expect(page.getByText('Coming Soon')).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /get early access/i })).toBeVisible()
  })

  test('navbar has Products link', async ({ page }) => {
    await page.goto('/')

    const productsLink = page.getByRole('link', { name: 'Products' })
    await expect(productsLink).toBeVisible()
    await productsLink.click()
    await expect(page).toHaveURL('/products')
  })
})
```

**Step 2: Run E2E tests**

```bash
just e2e
```

Expected: All products tests pass

**Step 3: Commit**

```bash
git add e2e/products.spec.ts
git commit -m "test: add E2E tests for products pages"
```

---

## Task 16: Run All Checks

**Step 1: Run full check suite**

```bash
just check
```

Expected: All checks pass (typecheck, lint, test, e2e)

**Step 2: Verify dev server**

```bash
pnpm dev
# Navigate through all pages, verify everything works
```

**Step 3: Final commit if any fixes needed**

---

## Task 17: Update Progress Doc

**Files:**
- Modify: `docs/PROGRESS.md`

**Step 1: Update Products milestone status**

Update the Products section in Phase 3:

```markdown
#### Products
| Product | Status | Description |
|---------|--------|-------------|
| [Vibes](https://github.com/run-vibes/vibes) | ✅ Done | Remote control for your Claude Code sessions |
| Volt | ✅ Done | Volatility analysis, simulation & trade execution system |
```

**Step 2: Add Recent Updates entry**

Add to Recent Updates:

```markdown
### 2025-12-26 (Products Pages)
- Added products index page with product cards ([#XX](https://github.com/run-vibes/website/pull/XX))
- Added Vibes product page with features, how it works, install command
- Added Volt teaser page with atmospheric background and waitlist form
- Added waitlist API endpoint for email capture
- Added Products link to navigation
```

**Step 3: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: update progress with products milestone"
```
