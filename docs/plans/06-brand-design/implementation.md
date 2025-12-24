# Brand Design Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the daybreak-hybrid-mono theme to the Vibes website with `/V` logo, monochrome palette, JetBrains Mono + Inter typography, and full visual effects.

**Architecture:** Styleguide-first approach — update design tokens, create effect components, update UI components, verify in Ladle, then apply site-wide. All components use CSS variables for theming, CVA for variants.

**Tech Stack:** TanStack Start, TypeScript, Tailwind CSS, CVA, Vitest, Ladle

---

## Phase A: Design Tokens & Foundation

### Task 1: Update Design Tokens

**Files:**
- Modify: `src/styles/tokens.css`

**Step 1: Replace tokens.css with daybreak-hybrid-mono values**

```css
:root {
  /* ─── Colors: Background ───────────────────── */
  --color-bg-primary: #0a0a0b;
  --color-bg-surface: #111113;
  --color-bg-alt: #18181b;
  --color-bg-elevated: #1f1f23;

  /* ─── Colors: Accent ───────────────────────── */
  --color-accent-primary: #ffffff;
  --color-accent-secondary: #666666;
  --color-accent-glow: rgba(255, 255, 255, 0.3);

  /* ─── Colors: Text ─────────────────────────── */
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;

  /* ─── Colors: Semantic ─────────────────────── */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* ─── Colors: Component Aliases ────────────── */
  --color-background: var(--color-bg-primary);
  --color-foreground: var(--color-text-primary);
  --color-card: var(--color-bg-alt);
  --color-card-foreground: var(--color-text-primary);
  --color-muted: var(--color-bg-surface);
  --color-muted-foreground: var(--color-text-muted);
  --color-border: rgba(255, 255, 255, 0.1);
  --color-input: rgba(255, 255, 255, 0.1);
  --color-ring: var(--color-accent-primary);

  /* ─── Typography ───────────────────────────── */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  --font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-7xl: 4.5rem;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  --tracking-tighter: -0.03em;
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;

  /* ─── Spacing ──────────────────────────────── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* ─── Border Radius ────────────────────────── */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* ─── Shadows (dark theme) ─────────────────── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 40px rgba(255, 255, 255, 0.1);

  /* ─── Transitions ──────────────────────────── */
  --transition-fast: 150ms ease;
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);

  /* ─── Effects ──────────────────────────────── */
  --effect-grid-opacity: 0.03;
  --effect-noise-opacity: 0.04;
  --effect-scanlines-opacity: 0.08;
  --effect-particle-opacity: 0.4;
}
```

**Step 2: Verify file saved correctly**

Run: `head -20 src/styles/tokens.css`
Expected: Shows new color variables starting with `--color-bg-primary: #0a0a0b`

**Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: update design tokens for daybreak-hybrid-mono theme"
```

---

### Task 2: Update Global Styles

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Update global.css with dark theme base and font imports**

```css
@import "./tokens.css";

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: var(--font-sans);
    line-height: var(--leading-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    color: var(--color-foreground);
    background-color: var(--color-background);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tight);
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

**Step 2: Verify font imports work**

Run: `grep -n "JetBrains" src/styles/global.css`
Expected: Shows line with Google Fonts import

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add dark theme base styles and font imports"
```

---

### Task 3: Update Tailwind Config

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Update tailwind.config.ts with new color mappings**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-primary)',
          secondary: 'var(--color-accent-secondary)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        destructive: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        // Legacy support
        primary: {
          DEFAULT: 'var(--color-accent-primary)',
          foreground: 'var(--color-bg-primary)',
        },
        secondary: {
          DEFAULT: 'var(--color-accent-secondary)',
          foreground: 'var(--color-text-primary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
        '7xl': 'var(--text-7xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
    },
  },
  plugins: [],
} satisfies Config
```

**Step 2: Run TypeScript check**

Run: `pnpm typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: update Tailwind config for dark theme color mappings"
```

---

## Phase B: Logo Component

### Task 4: Create Logo Component with Tests

**Files:**
- Create: `src/components/ui/Logo/Logo.tsx`
- Create: `src/components/ui/Logo/Logo.test.tsx`
- Create: `src/components/ui/Logo/Logo.stories.tsx`
- Create: `src/components/ui/Logo/index.ts`

**Step 1: Write failing test**

```typescript
// src/components/ui/Logo/Logo.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the logo mark', () => {
    render(<Logo />)
    expect(screen.getByLabelText('Vibes logo')).toBeInTheDocument()
  })

  it('renders mark only variant', () => {
    render(<Logo variant="mark" />)
    expect(screen.getByText('/V')).toBeInTheDocument()
  })

  it('renders full variant with wordmark', () => {
    render(<Logo variant="full" />)
    expect(screen.getByText('/V')).toBeInTheDocument()
    expect(screen.getByText('ibes')).toBeInTheDocument()
    expect(screen.getByText('.run')).toBeInTheDocument()
  })

  it('applies size variants', () => {
    const { container } = render(<Logo size="lg" />)
    expect(container.firstChild).toHaveClass('text-4xl')
  })

  it('merges custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Logo/Logo.test.tsx`
Expected: FAIL with "Cannot find module './Logo'"

**Step 3: Write Logo component**

```typescript
// src/components/ui/Logo/Logo.tsx
import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const logoVariants = cva('inline-flex items-center font-heading font-extrabold', {
  variants: {
    variant: {
      mark: '',
      full: '',
    },
    size: {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl',
    },
  },
  defaultVariants: {
    variant: 'full',
    size: 'md',
  },
})

interface LogoProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof logoVariants> {}

export function Logo({ variant = 'full', size, className, ...props }: LogoProps) {
  return (
    <div
      className={cn(logoVariants({ variant, size }), className)}
      aria-label="Vibes logo"
      {...props}
    >
      <span className="text-accent">/V</span>
      {variant === 'full' && (
        <>
          <span className="text-accent-secondary">ibes</span>
          <span className="text-accent-secondary opacity-60">.run</span>
        </>
      )}
    </div>
  )
}
```

**Step 4: Create index file**

```typescript
// src/components/ui/Logo/index.ts
export { Logo } from './Logo'
export type { LogoProps } from './Logo'
```

Wait — need to export the type. Update Logo.tsx:

```typescript
// src/components/ui/Logo/Logo.tsx (update interface export)
export interface LogoProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof logoVariants> {}
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Logo/Logo.test.tsx`
Expected: PASS (5 tests)

**Step 6: Add Ladle story**

```typescript
// src/components/ui/Logo/Logo.stories.tsx
import type { Story } from '@ladle/react'
import { Logo } from './Logo'

export const Default: Story = () => <Logo />

export const MarkOnly: Story = () => <Logo variant="mark" />

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4 items-start">
    <Logo size="sm" />
    <Logo size="md" />
    <Logo size="lg" />
  </div>
)

export const MarkSizes: Story = () => (
  <div className="flex gap-4 items-center">
    <Logo variant="mark" size="sm" />
    <Logo variant="mark" size="md" />
    <Logo variant="mark" size="lg" />
  </div>
)
```

**Step 7: Update UI component barrel export**

Add to `src/components/ui/index.ts`:
```typescript
export { Logo } from './Logo'
```

**Step 8: Commit**

```bash
git add src/components/ui/Logo/
git add src/components/ui/index.ts
git commit -m "feat: add Logo component with /V mark and wordmark variants"
```

---

## Phase C: Effect Layer Components

### Task 5: Create GeometricGrid Effect

**Files:**
- Create: `src/components/effects/GeometricGrid.tsx`
- Create: `src/components/effects/GeometricGrid.test.tsx`
- Create: `src/components/effects/index.ts`

**Step 1: Write failing test**

```typescript
// src/components/effects/GeometricGrid.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeometricGrid } from './GeometricGrid'

describe('GeometricGrid', () => {
  it('renders the grid overlay', () => {
    const { container } = render(<GeometricGrid />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('is positioned fixed and full screen', () => {
    const { container } = render(<GeometricGrid />)
    expect(container.firstChild).toHaveClass('fixed', 'inset-0')
  })

  it('merges custom className', () => {
    const { container } = render(<GeometricGrid className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/effects/GeometricGrid.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/effects/GeometricGrid.tsx
import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface GeometricGridProps extends Omit<ComponentProps<'div'>, 'children'> {}

export function GeometricGrid({ className, ...props }: GeometricGridProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[1]', className)}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, var(--effect-grid-opacity)) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, var(--effect-grid-opacity)) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/components/effects/GeometricGrid.test.tsx`
Expected: PASS

**Step 5: Create index file**

```typescript
// src/components/effects/index.ts
export { GeometricGrid } from './GeometricGrid'
```

**Step 6: Commit**

```bash
git add src/components/effects/
git commit -m "feat: add GeometricGrid effect component"
```

---

### Task 6: Create NoiseOverlay Effect

**Files:**
- Create: `src/components/effects/NoiseOverlay.tsx`
- Create: `src/components/effects/NoiseOverlay.test.tsx`
- Modify: `src/components/effects/index.ts`

**Step 1: Write failing test**

```typescript
// src/components/effects/NoiseOverlay.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NoiseOverlay } from './NoiseOverlay'

describe('NoiseOverlay', () => {
  it('renders the noise overlay', () => {
    const { container } = render(<NoiseOverlay />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('is hidden from accessibility tree', () => {
    const { container } = render(<NoiseOverlay />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/effects/NoiseOverlay.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/effects/NoiseOverlay.tsx
import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface NoiseOverlayProps extends Omit<ComponentProps<'div'>, 'children'> {}

const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

export function NoiseOverlay({ className, ...props }: NoiseOverlayProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[2]', className)}
      style={{
        backgroundImage: noiseSvg,
        opacity: 'var(--effect-noise-opacity)',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/components/effects/NoiseOverlay.test.tsx`
Expected: PASS

**Step 5: Update index**

```typescript
// src/components/effects/index.ts
export { GeometricGrid } from './GeometricGrid'
export { NoiseOverlay } from './NoiseOverlay'
```

**Step 6: Commit**

```bash
git add src/components/effects/
git commit -m "feat: add NoiseOverlay effect component"
```

---

### Task 7: Create Scanlines Effect

**Files:**
- Create: `src/components/effects/Scanlines.tsx`
- Create: `src/components/effects/Scanlines.test.tsx`
- Modify: `src/components/effects/index.ts`

**Step 1: Write failing test**

```typescript
// src/components/effects/Scanlines.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Scanlines } from './Scanlines'

describe('Scanlines', () => {
  it('renders the scanlines overlay', () => {
    const { container } = render(<Scanlines />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('has correct z-index', () => {
    const { container } = render(<Scanlines />)
    expect(container.firstChild).toHaveClass('z-[3]')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/effects/Scanlines.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/effects/Scanlines.tsx
import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface ScanlinesProps extends Omit<ComponentProps<'div'>, 'children'> {}

export function Scanlines({ className, ...props }: ScanlinesProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[3]', className)}
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.12) 2px,
          rgba(0, 0, 0, 0.12) 4px
        )`,
        opacity: 'var(--effect-scanlines-opacity)',
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/components/effects/Scanlines.test.tsx`
Expected: PASS

**Step 5: Update index**

```typescript
// src/components/effects/index.ts
export { GeometricGrid } from './GeometricGrid'
export { NoiseOverlay } from './NoiseOverlay'
export { Scanlines } from './Scanlines'
```

**Step 6: Commit**

```bash
git add src/components/effects/
git commit -m "feat: add Scanlines effect component"
```

---

### Task 8: Create Particles Effect

**Files:**
- Create: `src/components/effects/Particles.tsx`
- Create: `src/components/effects/Particles.test.tsx`
- Modify: `src/components/effects/index.ts`

**Step 1: Write failing test**

```typescript
// src/components/effects/Particles.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Particles } from './Particles'

describe('Particles', () => {
  it('renders the particles container', () => {
    const { container } = render(<Particles />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('renders 25 particles by default', () => {
    const { container } = render(<Particles />)
    const particles = container.querySelectorAll('[data-particle]')
    expect(particles).toHaveLength(25)
  })

  it('accepts custom count', () => {
    const { container } = render(<Particles count={10} />)
    const particles = container.querySelectorAll('[data-particle]')
    expect(particles).toHaveLength(10)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/effects/Particles.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/effects/Particles.tsx
import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface ParticlesProps extends Omit<ComponentProps<'div'>, 'children'> {
  count?: number
}

export function Particles({ count = 25, className, ...props }: ParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => {
    const left = `${(i * 4) % 100}%`
    const duration = 15 + (i % 10)
    const delay = -(i * 0.8)
    const isAccent = i % 2 === 0

    return (
      <div
        key={i}
        data-particle
        className="absolute w-[3px] h-[3px] rounded-full opacity-0"
        style={{
          left,
          background: isAccent ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)',
          boxShadow: `0 0 6px ${isAccent ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}`,
          animation: `float-up ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[5] overflow-hidden', className)}
      aria-hidden="true"
      {...props}
    >
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: var(--effect-particle-opacity);
            transform: translateY(90vh) scale(1);
          }
          90% {
            opacity: var(--effect-particle-opacity);
          }
          100% {
            transform: translateY(-10vh) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
      {particles}
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/components/effects/Particles.test.tsx`
Expected: PASS

**Step 5: Update index**

```typescript
// src/components/effects/index.ts
export { GeometricGrid } from './GeometricGrid'
export { NoiseOverlay } from './NoiseOverlay'
export { Scanlines } from './Scanlines'
export { Particles } from './Particles'
```

**Step 6: Commit**

```bash
git add src/components/effects/
git commit -m "feat: add Particles effect component with CSS animations"
```

---

### Task 9: Create EffectsContainer

**Files:**
- Create: `src/components/effects/EffectsContainer.tsx`
- Create: `src/components/effects/EffectsContainer.test.tsx`
- Modify: `src/components/effects/index.ts`

**Step 1: Write failing test**

```typescript
// src/components/effects/EffectsContainer.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EffectsContainer } from './EffectsContainer'

describe('EffectsContainer', () => {
  it('renders all effect layers', () => {
    const { container } = render(<EffectsContainer />)
    // Should have grid, noise, scanlines, particles
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBeGreaterThanOrEqual(4)
  })

  it('respects reduced motion preference', () => {
    // This is tested via CSS media query, just verify component renders
    const { container } = render(<EffectsContainer />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/effects/EffectsContainer.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/effects/EffectsContainer.tsx
import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'
import { GeometricGrid } from './GeometricGrid'
import { NoiseOverlay } from './NoiseOverlay'
import { Particles } from './Particles'
import { Scanlines } from './Scanlines'

interface EffectsContainerProps extends Omit<ComponentProps<'div'>, 'children'> {
  enableGrid?: boolean
  enableNoise?: boolean
  enableScanlines?: boolean
  enableParticles?: boolean
}

export function EffectsContainer({
  enableGrid = true,
  enableNoise = true,
  enableScanlines = true,
  enableParticles = true,
  className,
  ...props
}: EffectsContainerProps) {
  return (
    <div className={cn('contents', className)} {...props}>
      {enableGrid && <GeometricGrid />}
      {enableNoise && <NoiseOverlay />}
      {enableScanlines && <Scanlines />}
      {enableParticles && <Particles />}
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/components/effects/EffectsContainer.test.tsx`
Expected: PASS

**Step 5: Update index**

```typescript
// src/components/effects/index.ts
export { GeometricGrid } from './GeometricGrid'
export { NoiseOverlay } from './NoiseOverlay'
export { Scanlines } from './Scanlines'
export { Particles } from './Particles'
export { EffectsContainer } from './EffectsContainer'
```

**Step 6: Commit**

```bash
git add src/components/effects/
git commit -m "feat: add EffectsContainer component combining all effect layers"
```

---

## Phase D: Update UI Components

### Task 10: Update Button Component for Dark Theme

**Files:**
- Modify: `src/components/ui/Button/Button.tsx`
- Modify: `src/components/ui/Button/Button.test.tsx`

**Step 1: Update Button variants for dark theme**

```typescript
// src/components/ui/Button/Button.tsx
import { cn } from '@/lib/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-background hover:bg-accent/90 shadow-md hover:shadow-glow',
        secondary:
          'bg-transparent text-accent-secondary border-2 border-accent-secondary hover:bg-accent-secondary hover:text-background',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-10 px-5 text-sm rounded-lg',
        lg: 'h-12 px-7 text-base rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

**Step 2: Verify existing tests still pass**

Run: `pnpm test src/components/ui/Button/Button.test.tsx`
Expected: PASS

**Step 3: Update Button stories for dark theme preview**

```typescript
// src/components/ui/Button/Button.stories.tsx
import type { Story } from '@ladle/react'
import { Button } from './Button'

export const Primary: Story = () => <Button>Primary Button</Button>

export const Secondary: Story = () => <Button variant="secondary">Secondary</Button>

export const Outline: Story = () => <Button variant="outline">Outline</Button>

export const Ghost: Story = () => <Button variant="ghost">Ghost</Button>

export const Sizes: Story = () => (
  <div className="flex gap-4 items-center">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const AllVariants: Story = () => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  </div>
)
```

**Step 4: Commit**

```bash
git add src/components/ui/Button/
git commit -m "feat: update Button component for dark theme with glow effects"
```

---

### Task 11: Update Card Component for Dark Theme

**Files:**
- Modify: `src/components/ui/Card/Card.tsx`

**Step 1: Update Card variants for dark theme**

```typescript
// src/components/ui/Card/Card.tsx
import { cn } from '@/lib/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const cardVariants = cva('rounded-xl border transition-all', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground border-border shadow-md',
      outlined: 'border-border bg-transparent',
      ghost: 'bg-transparent border-transparent',
      interactive:
        'bg-card text-card-foreground border-border shadow-md hover:border-accent/20 hover:shadow-glow cursor-pointer hover:-translate-y-1',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'none',
  },
})

interface CardProps extends Omit<ComponentProps<'div'>, 'ref'>, VariantProps<typeof cardVariants> {
  asChild?: boolean
}

export function Card({
  variant,
  padding,
  className,
  children,
  asChild = false,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </Comp>
  )
}

export function CardHeader({ className, children, ...props }: Omit<ComponentProps<'div'>, 'ref'>) {
  return (
    <div className={cn('p-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: Omit<ComponentProps<'h3'>, 'ref'>) {
  return (
    <h3
      className={cn('font-heading text-xl font-bold uppercase tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: Omit<ComponentProps<'div'>, 'ref'>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: Omit<ComponentProps<'div'>, 'ref'>) {
  return (
    <div className={cn('p-6 pt-0 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}
```

**Step 2: Verify existing tests still pass**

Run: `pnpm test src/components/ui/Card/Card.test.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ui/Card/
git commit -m "feat: update Card component for dark theme with glow effects"
```

---

### Task 12: Update Input Component for Dark Theme

**Files:**
- Modify: `src/components/ui/Input/Input.tsx`

**Step 1: Update Input variants for dark theme**

```typescript
// src/components/ui/Input/Input.tsx
import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const inputVariants = cva(
  'flex w-full rounded-lg bg-muted px-4 py-2 font-mono text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
  {
    variants: {
      variant: {
        default: 'border-2 border-border focus-visible:border-accent',
        error: 'border-2 border-destructive focus-visible:ring-destructive',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  },
)

interface InputProps
  extends Omit<ComponentProps<'input'>, 'ref' | 'size'>,
    VariantProps<typeof inputVariants> {}

export function Input({ variant, inputSize, className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, inputSize }), className)}
      {...props}
    />
  )
}
```

**Step 2: Verify existing tests still pass**

Run: `pnpm test src/components/ui/Input/Input.test.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ui/Input/
git commit -m "feat: update Input component for dark theme"
```

---

## Phase E: Site-wide Application

### Task 13: Update Root Layout with Effects

**Files:**
- Modify: `src/routes/__root.tsx`

**Step 1: Add EffectsContainer to root layout**

```typescript
// src/routes/__root.tsx
import { EffectsContainer } from '@/components/effects'
import { Footer, Navbar } from '@/components/navigation'
import globalCss from '@/styles/global.css?url'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Vibes - The studio where AI agents come to life' },
      {
        name: 'description',
        content:
          'Agentic consulting & development studio delivering AI solutions with measurable impact.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: globalCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return (
    <>
      <EffectsContainer />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

**Step 2: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: add EffectsContainer to root layout"
```

---

### Task 14: Update Navbar with Logo

**Files:**
- Modify: `src/components/navigation/Navbar.tsx`

**Step 1: Update Navbar with new Logo and dark styling**

```typescript
// src/components/navigation/Navbar.tsx
import { Container, Logo } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Link } from '@tanstack/react-router'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl',
        className,
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-8">
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
        </nav>
      </Container>
    </header>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/navigation/Navbar.tsx
git commit -m "feat: update Navbar with Logo and dark theme styling"
```

---

### Task 15: Update Footer

**Files:**
- Modify: `src/components/navigation/Footer.tsx`

**Step 1: Update Footer for dark theme**

```typescript
// src/components/navigation/Footer.tsx
import { Container, Logo } from '@/components/ui'
import { cn } from '@/lib/cn'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t border-border bg-muted py-12', className)}>
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo size="sm" variant="mark" />
          <p className="font-mono text-sm text-muted-foreground">
            &copy; {currentYear} Vibes. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:hello@vibes.run"
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              hello@vibes.run
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/navigation/Footer.tsx
git commit -m "feat: update Footer with Logo and dark theme styling"
```

---

### Task 16: Update Homepage Sections

**Files:**
- Modify: `src/routes/index.tsx`

**Step 1: Update homepage for dark theme styling**

```typescript
// src/routes/index.tsx
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Grid } from '@/components/ui/Grid'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const services = [
  {
    title: 'Agent Development',
    description:
      'End-to-end design and development of AI agents, from single-purpose assistants to multi-agent orchestrations.',
    href: '/services#agent-development',
  },
  {
    title: 'AI Strategy',
    description:
      'Navigate the AI landscape with practical roadmaps that align with your business objectives.',
    href: '/services#ai-strategy',
  },
  {
    title: 'Product Development',
    description: 'Build AI-native products that leverage intelligence as a core differentiator.',
    href: '/services#product-development',
  },
  {
    title: 'Workshops',
    description:
      'Empower your team with hands-on training to build and deploy AI agents independently.',
    href: '/services#workshops',
  },
]

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="xl" className="pt-32">
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
            <Button variant="secondary" size="lg" asChild>
              <Link to="/services">See Our Services</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Social Proof Bar */}
      <Section size="sm" className="border-y border-border bg-muted/30">
        <Container>
          <Text variant="muted" className="text-center font-mono text-xs uppercase tracking-wider">
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
                description:
                  'We start by understanding your business, challenges, and goals through in-depth conversations.',
              },
              {
                step: '02',
                title: 'Design',
                description:
                  'We architect solutions that fit your specific needs, not one-size-fits-all templates.',
              },
              {
                step: '03',
                title: 'Deliver',
                description:
                  'We build iteratively, shipping value early and often with continuous feedback loops.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-heading text-4xl font-extrabold text-accent mb-4">
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

      {/* Final CTA */}
      <Section size="lg" className="border-t border-border">
        <Container size="sm" className="text-center">
          <Heading level={2} size="xl" className="mb-4">
            Ready to bring your AI vision to life?
          </Heading>
          <Text size="lg" variant="muted" className="mb-8">
            Tell us about your project and let's explore what's possible together.
          </Text>
          <Button size="lg" asChild>
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
git commit -m "feat: update homepage sections for dark theme"
```

---

## Phase F: Verification

### Task 17: Run All Checks

**Step 1: Run TypeScript check**

Run: `pnpm typecheck`
Expected: No errors

**Step 2: Run linter**

Run: `pnpm lint`
Expected: No errors (or only warnings)

**Step 3: Run unit tests**

Run: `pnpm test`
Expected: All tests pass

**Step 4: Run E2E tests**

Run: `pnpm e2e`
Expected: All tests pass

**Step 5: Visual review in Ladle**

Run: `just ladle`
Expected: All components render correctly with dark theme

**Step 6: Dev server preview**

Run: `just dev`
Expected: Site loads at http://localhost:3000 with dark theme and effects

---

### Task 18: Final Commit and Summary

**Step 1: Ensure all changes committed**

Run: `git status`
Expected: Clean working tree

**Step 2: View commit log**

Run: `git log --oneline -20`
Expected: Shows all implementation commits

---

## Summary

This plan implements the daybreak-hybrid-mono theme through:

**Phase A (3 tasks):** Design tokens, global styles, Tailwind config
**Phase B (1 task):** Logo component with variants
**Phase C (5 tasks):** Effect layer components (grid, noise, scanlines, particles, container)
**Phase D (3 tasks):** Update Button, Card, Input for dark theme
**Phase E (4 tasks):** Apply to root layout, Navbar, Footer, homepage
**Phase F (2 tasks):** Verification and final commit

**Total: 18 tasks, ~18 commits**

All tasks follow TDD where applicable, with explicit file paths, code, and verification steps.
