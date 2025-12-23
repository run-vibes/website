# Project Scaffolding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the complete development environment and component library foundation for the Vibes marketing website.

**Architecture:** Component Library First approach with CSS variables for design tokens, CVA for component variants, and feature-based folder structure separating reusable UI from domain-specific components.

**Tech Stack:** TanStack Start, React 19, TypeScript (strict), Tailwind CSS, CVA, Ladle, Vitest, Playwright, Cloudflare Pages/Workers/D1, Nix flake, Biome

---

## Phase 1: Development Environment

### Task 1: Create Nix Flake

**Files:**
- Create: `flake.nix`

**Step 1: Create the flake file**

```nix
{
  description = "Vibes marketing website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            nodePackages.wrangler
            just
          ];

          shellHook = ''
            echo "Vibes dev environment loaded"
            echo "Run 'just' to see available commands"
          '';
        };
      }
    );
}
```

**Step 2: Commit**

```bash
git add flake.nix
git commit -m "Add Nix flake for dev environment"
```

---

### Task 2: Create direnv Configuration

**Files:**
- Create: `.envrc`

**Step 1: Create the envrc file**

```bash
use flake
```

**Step 2: Commit**

```bash
git add .envrc
git commit -m "Add direnv configuration"
```

---

### Task 3: Create Justfile

**Files:**
- Create: `justfile`

**Step 1: Create the justfile**

```just
# Show available commands
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Start dev server
dev:
    pnpm dev

# Start Ladle component preview
ladle:
    pnpm ladle

# Run type checking
typecheck:
    pnpm typecheck

# Run linting
lint:
    pnpm lint

# Format code
format:
    pnpm format

# Run all checks (CI equivalent)
check: typecheck lint test

# Run unit tests
test:
    pnpm test

# Run E2E tests
e2e:
    pnpm e2e

# Build for production
build:
    pnpm build

# Deploy to Cloudflare Pages
deploy:
    pnpm deploy

# Deploy chat worker
deploy-worker:
    cd workers/chat-api && wrangler deploy
```

**Step 2: Commit**

```bash
git add justfile
git commit -m "Add justfile task runner"
```

---

## Phase 2: Project Initialization

### Task 4: Initialize package.json

**Files:**
- Create: `package.json`

**Step 1: Create package.json**

```json
{
  "name": "vibes-website",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "typecheck": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "ladle": "ladle serve",
    "ladle:build": "ladle build",
    "deploy": "wrangler pages deploy ./dist",
    "deploy:worker": "cd workers/chat-api && wrangler deploy"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.93.0",
    "@tanstack/react-start": "^1.93.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "vinxi": "^0.5.3"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@ladle/react": "^4.1.1",
    "@playwright/test": "^1.49.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^2.1.8",
    "wrangler": "^3.99.0"
  }
}
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "Add package.json with dependencies"
```

---

### Task 5: Create TypeScript Configuration

**Files:**
- Create: `tsconfig.json`

**Step 1: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "e2e", "*.config.ts"],
  "exclude": ["node_modules", "dist", ".vinxi"]
}
```

**Step 2: Commit**

```bash
git add tsconfig.json
git commit -m "Add TypeScript configuration"
```

---

### Task 6: Create Biome Configuration

**Files:**
- Create: `biome.json`

**Step 1: Create biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "files": {
    "ignore": ["dist", "node_modules", ".vinxi", "*.gen.ts"]
  }
}
```

**Step 2: Commit**

```bash
git add biome.json
git commit -m "Add Biome linting configuration"
```

---

### Task 7: Create Tailwind Configuration

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`

**Step 1: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
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
      },
    },
  },
  plugins: [],
} satisfies Config
```

**Step 2: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 3: Commit**

```bash
git add tailwind.config.ts postcss.config.js
git commit -m "Add Tailwind CSS configuration"
```

---

### Task 8: Create Testing Configuration

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`

**Step 1: Create vitest.config.ts**

```typescript
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**', 'src/lib/**'],
    },
  },
})
```

**Step 2: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 3: Commit**

```bash
git add vitest.config.ts playwright.config.ts
git commit -m "Add testing configuration"
```

---

## Phase 3: Styles and Design Tokens

### Task 9: Create Design Tokens

**Files:**
- Create: `src/styles/tokens.css`

**Step 1: Create directory and tokens file**

```css
:root {
  /* ─── Colors: Primary ─────────────────────────── */
  --color-primary-50: #fef2f2;
  --color-primary-100: #fee2e2;
  --color-primary-200: #fecaca;
  --color-primary-300: #fca5a5;
  --color-primary-400: #f87171;
  --color-primary-500: #ef4444;
  --color-primary-600: #dc2626;
  --color-primary-700: #b91c1c;
  --color-primary-800: #991b1b;
  --color-primary-900: #7f1d1d;

  /* ─── Colors: Neutral ─────────────────────────── */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* ─── Colors: Semantic ────────────────────────── */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* ─── Typography ──────────────────────────────── */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* ─── Spacing ─────────────────────────────────── */
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

  /* ─── Border Radius ───────────────────────────── */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* ─── Shadows ─────────────────────────────────── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

**Step 2: Commit**

```bash
mkdir -p src/styles
git add src/styles/tokens.css
git commit -m "Add design tokens"
```

---

### Task 10: Create Global Styles

**Files:**
- Create: `src/styles/global.css`

**Step 1: Create global.css**

```css
@import './tokens.css';

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
    color: var(--color-neutral-900);
    background-color: white;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
  }
}
```

**Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "Add global styles"
```

---

## Phase 4: Library Utilities

### Task 11: Create cn Helper

**Files:**
- Create: `src/lib/cn.ts`
- Create: `src/lib/cn.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/cn.test.ts
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles objects', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/cn.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write the implementation**

```typescript
// src/lib/cn.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/cn.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
mkdir -p src/lib
git add src/lib/cn.ts src/lib/cn.test.ts
git commit -m "Add cn utility for class merging"
```

---

### Task 12: Create Test Setup

**Files:**
- Create: `src/test/setup.ts`

**Step 1: Create test setup file**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

**Step 2: Commit**

```bash
mkdir -p src/test
git add src/test/setup.ts
git commit -m "Add Vitest setup file"
```

---

## Phase 5: UI Components

### Task 13: Create Button Component

**Files:**
- Create: `src/components/ui/Button/Button.tsx`
- Create: `src/components/ui/Button/Button.test.tsx`
- Create: `src/components/ui/Button/Button.stories.tsx`
- Create: `src/components/ui/Button/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies primary variant by default', () => {
    render(<Button>Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-neutral-100')
  })

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-neutral-100')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-12')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('passes through HTML attributes', () => {
    render(<Button disabled>Button</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Button/Button.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        ghost: 'text-neutral-900 hover:bg-neutral-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Button/index.ts
export { Button, type ButtonProps } from './Button'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Button/Button.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Button/Button.stories.tsx
import type { Story } from '@ladle/react'
import { Button } from './Button'

export const Primary: Story = () => <Button>Primary Button</Button>

export const Secondary: Story = () => <Button variant="secondary">Secondary Button</Button>

export const Ghost: Story = () => <Button variant="ghost">Ghost Button</Button>

export const Sizes: Story = () => (
  <div className="flex items-center gap-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const Disabled: Story = () => <Button disabled>Disabled</Button>
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Button
git add src/components/ui/Button/
git commit -m "Add Button component"
```

---

### Task 14: Create Typography Component

**Files:**
- Create: `src/components/ui/Typography/Typography.tsx`
- Create: `src/components/ui/Typography/Typography.test.tsx`
- Create: `src/components/ui/Typography/Typography.stories.tsx`
- Create: `src/components/ui/Typography/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Typography/Typography.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Typography } from './Typography'

describe('Typography', () => {
  it('renders h1 variant', () => {
    render(<Typography variant="h1">Heading 1</Typography>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1')
  })

  it('renders h2 variant', () => {
    render(<Typography variant="h2">Heading 2</Typography>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2')
  })

  it('renders body variant as paragraph', () => {
    render(<Typography variant="body">Body text</Typography>)
    expect(screen.getByText('Body text').tagName).toBe('P')
  })

  it('renders lead variant', () => {
    render(<Typography variant="lead">Lead text</Typography>)
    expect(screen.getByText('Lead text')).toHaveClass('text-xl')
  })

  it('allows custom element via as prop', () => {
    render(
      <Typography variant="body" as="span">
        Span text
      </Typography>
    )
    expect(screen.getByText('Span text').tagName).toBe('SPAN')
  })

  it('merges custom className', () => {
    render(
      <Typography variant="body" className="custom-class">
        Text
      </Typography>
    )
    expect(screen.getByText('Text')).toHaveClass('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Typography/Typography.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Typography/Typography.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-5xl font-bold tracking-tight',
      h2: 'text-4xl font-bold tracking-tight',
      h3: 'text-3xl font-semibold',
      h4: 'text-2xl font-semibold',
      lead: 'text-xl text-neutral-600',
      body: 'text-base',
      small: 'text-sm text-neutral-500',
      caption: 'text-xs text-neutral-500',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

const variantElements: Record<string, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  small: 'p',
  caption: 'span',
}

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: ElementType
}

export function Typography({ className, variant = 'body', as, children, ...props }: TypographyProps) {
  const Component = as || variantElements[variant || 'body']
  return (
    <Component className={cn(typographyVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Typography/index.ts
export { Typography, type TypographyProps } from './Typography'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Typography/Typography.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Typography/Typography.stories.tsx
import type { Story } from '@ladle/react'
import { Typography } from './Typography'

export const Headings: Story = () => (
  <div className="space-y-4">
    <Typography variant="h1">Heading 1</Typography>
    <Typography variant="h2">Heading 2</Typography>
    <Typography variant="h3">Heading 3</Typography>
    <Typography variant="h4">Heading 4</Typography>
  </div>
)

export const Body: Story = () => (
  <div className="space-y-4">
    <Typography variant="lead">
      Lead text for introductions and important callouts.
    </Typography>
    <Typography variant="body">
      Body text for regular paragraphs and content.
    </Typography>
    <Typography variant="small">Small text for less important content.</Typography>
    <Typography variant="caption">Caption text for labels and metadata.</Typography>
  </div>
)
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Typography
git add src/components/ui/Typography/
git commit -m "Add Typography component"
```

---

### Task 15: Create Card Component

**Files:**
- Create: `src/components/ui/Card/Card.tsx`
- Create: `src/components/ui/Card/Card.test.tsx`
- Create: `src/components/ui/Card/Card.stories.tsx`
- Create: `src/components/ui/Card/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Card/Card.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default styles', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content').parentElement).toHaveClass('rounded-lg')
  })

  it('applies interactive variant', () => {
    render(<Card variant="interactive">Content</Card>)
    expect(screen.getByText('Content').parentElement).toHaveClass('hover:shadow-lg')
  })

  it('merges custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    expect(screen.getByText('Content').parentElement).toHaveClass('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Card/Card.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Card/Card.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const cardVariants = cva('rounded-lg border border-neutral-200 bg-white p-6', {
  variants: {
    variant: {
      default: 'shadow-sm',
      interactive: 'shadow-sm transition-shadow hover:shadow-lg cursor-pointer',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Card/index.ts
export { Card, type CardProps } from './Card'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Card/Card.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Card/Card.stories.tsx
import type { Story } from '@ladle/react'
import { Card } from './Card'

export const Default: Story = () => (
  <Card>
    <h3 className="font-semibold">Card Title</h3>
    <p className="text-neutral-600">Card content goes here.</p>
  </Card>
)

export const Interactive: Story = () => (
  <Card variant="interactive">
    <h3 className="font-semibold">Interactive Card</h3>
    <p className="text-neutral-600">Hover to see the shadow effect.</p>
  </Card>
)
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Card
git add src/components/ui/Card/
git commit -m "Add Card component"
```

---

### Task 16: Create Input Component

**Files:**
- Create: `src/components/ui/Input/Input.tsx`
- Create: `src/components/ui/Input/Input.test.tsx`
- Create: `src/components/ui/Input/Input.stories.tsx`
- Create: `src/components/ui/Input/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Input/Input.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies default styles', () => {
    render(<Input placeholder="Test" />)
    expect(screen.getByPlaceholderText('Test')).toHaveClass('rounded-md')
  })

  it('applies error styles when error prop is true', () => {
    render(<Input placeholder="Test" error />)
    expect(screen.getByPlaceholderText('Test')).toHaveClass('border-red-500')
  })

  it('merges custom className', () => {
    render(<Input placeholder="Test" className="custom-class" />)
    expect(screen.getByPlaceholderText('Test')).toHaveClass('custom-class')
  })

  it('passes through HTML attributes', () => {
    render(<Input placeholder="Test" disabled />)
    expect(screen.getByPlaceholderText('Test')).toBeDisabled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Input/Input.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Input/Input.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-red-500 focus-visible:ring-red-500',
        false: 'border-neutral-300',
      },
    },
    defaultVariants: {
      error: false,
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export function Input({ className, error, ...props }: InputProps) {
  return <input className={cn(inputVariants({ error }), className)} {...props} />
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Input/index.ts
export { Input, type InputProps } from './Input'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Input/Input.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Input/Input.stories.tsx
import type { Story } from '@ladle/react'
import { Input } from './Input'

export const Default: Story = () => <Input placeholder="Enter your email" />

export const WithError: Story = () => <Input placeholder="Invalid input" error />

export const Disabled: Story = () => <Input placeholder="Disabled input" disabled />
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Input
git add src/components/ui/Input/
git commit -m "Add Input component"
```

---

### Task 17: Create Container Component

**Files:**
- Create: `src/components/ui/Container/Container.tsx`
- Create: `src/components/ui/Container/Container.test.tsx`
- Create: `src/components/ui/Container/Container.stories.tsx`
- Create: `src/components/ui/Container/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Container/Container.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies default max-width', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content').parentElement).toHaveClass('max-w-7xl')
  })

  it('applies narrow variant', () => {
    render(<Container size="narrow">Content</Container>)
    expect(screen.getByText('Content').parentElement).toHaveClass('max-w-3xl')
  })

  it('applies wide variant', () => {
    render(<Container size="wide">Content</Container>)
    expect(screen.getByText('Content').parentElement).toHaveClass('max-w-screen-2xl')
  })

  it('merges custom className', () => {
    render(<Container className="custom-class">Content</Container>)
    expect(screen.getByText('Content').parentElement).toHaveClass('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Container/Container.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Container/Container.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      default: 'max-w-7xl',
      narrow: 'max-w-3xl',
      wide: 'max-w-screen-2xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, children, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size }), className)} {...props}>
      {children}
    </div>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Container/index.ts
export { Container, type ContainerProps } from './Container'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Container/Container.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Container/Container.stories.tsx
import type { Story } from '@ladle/react'
import { Container } from './Container'

export const Default: Story = () => (
  <Container className="bg-neutral-100 py-8">
    <div className="bg-white p-4">Default container (max-w-7xl)</div>
  </Container>
)

export const Narrow: Story = () => (
  <Container size="narrow" className="bg-neutral-100 py-8">
    <div className="bg-white p-4">Narrow container (max-w-3xl)</div>
  </Container>
)

export const Wide: Story = () => (
  <Container size="wide" className="bg-neutral-100 py-8">
    <div className="bg-white p-4">Wide container (max-w-screen-2xl)</div>
  </Container>
)
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Container
git add src/components/ui/Container/
git commit -m "Add Container component"
```

---

### Task 18: Create Section Component

**Files:**
- Create: `src/components/ui/Section/Section.tsx`
- Create: `src/components/ui/Section/Section.test.tsx`
- Create: `src/components/ui/Section/Section.stories.tsx`
- Create: `src/components/ui/Section/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Section/Section.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('renders children', () => {
    render(<Section>Content</Section>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders as section element', () => {
    render(<Section>Content</Section>)
    expect(screen.getByText('Content').closest('section')).toBeInTheDocument()
  })

  it('applies default padding', () => {
    render(<Section>Content</Section>)
    expect(screen.getByText('Content').closest('section')).toHaveClass('py-16')
  })

  it('applies large padding variant', () => {
    render(<Section padding="lg">Content</Section>)
    expect(screen.getByText('Content').closest('section')).toHaveClass('py-24')
  })

  it('merges custom className', () => {
    render(<Section className="custom-class">Content</Section>)
    expect(screen.getByText('Content').closest('section')).toHaveClass('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Section/Section.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Section/Section.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const sectionVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'py-8 md:py-12',
      default: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
})

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export function Section({ className, padding, children, ...props }: SectionProps) {
  return (
    <section className={cn(sectionVariants({ padding }), className)} {...props}>
      {children}
    </section>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Section/index.ts
export { Section, type SectionProps } from './Section'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Section/Section.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Section/Section.stories.tsx
import type { Story } from '@ladle/react'
import { Section } from './Section'

export const Default: Story = () => (
  <Section className="bg-neutral-100">
    <div className="text-center">Default section padding</div>
  </Section>
)

export const Large: Story = () => (
  <Section padding="lg" className="bg-neutral-100">
    <div className="text-center">Large section padding</div>
  </Section>
)

export const Small: Story = () => (
  <Section padding="sm" className="bg-neutral-100">
    <div className="text-center">Small section padding</div>
  </Section>
)
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Section
git add src/components/ui/Section/
git commit -m "Add Section component"
```

---

### Task 19: Create Grid Component

**Files:**
- Create: `src/components/ui/Grid/Grid.tsx`
- Create: `src/components/ui/Grid/Grid.test.tsx`
- Create: `src/components/ui/Grid/Grid.stories.tsx`
- Create: `src/components/ui/Grid/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Grid/Grid.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Grid } from './Grid'

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('applies grid display', () => {
    render(
      <Grid>
        <div>Item</div>
      </Grid>
    )
    expect(screen.getByText('Item').parentElement).toHaveClass('grid')
  })

  it('applies 2-column variant', () => {
    render(
      <Grid cols={2}>
        <div>Item</div>
      </Grid>
    )
    expect(screen.getByText('Item').parentElement).toHaveClass('md:grid-cols-2')
  })

  it('applies 4-column variant', () => {
    render(
      <Grid cols={4}>
        <div>Item</div>
      </Grid>
    )
    expect(screen.getByText('Item').parentElement).toHaveClass('md:grid-cols-4')
  })

  it('merges custom className', () => {
    render(
      <Grid className="custom-class">
        <div>Item</div>
      </Grid>
    )
    expect(screen.getByText('Item').parentElement).toHaveClass('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Grid/Grid.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Grid/Grid.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const gridVariants = cva('grid gap-6', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
  },
  defaultVariants: {
    cols: 3,
  },
})

export interface GridProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {}

export function Grid({ className, cols, children, ...props }: GridProps) {
  return (
    <div className={cn(gridVariants({ cols }), className)} {...props}>
      {children}
    </div>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Grid/index.ts
export { Grid, type GridProps } from './Grid'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Grid/Grid.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Grid/Grid.stories.tsx
import type { Story } from '@ladle/react'
import { Grid } from './Grid'

const GridItem = ({ n }: { n: number }) => (
  <div className="bg-neutral-100 p-4 rounded text-center">Item {n}</div>
)

export const TwoColumns: Story = () => (
  <Grid cols={2}>
    <GridItem n={1} />
    <GridItem n={2} />
    <GridItem n={3} />
    <GridItem n={4} />
  </Grid>
)

export const ThreeColumns: Story = () => (
  <Grid cols={3}>
    <GridItem n={1} />
    <GridItem n={2} />
    <GridItem n={3} />
    <GridItem n={4} />
    <GridItem n={5} />
    <GridItem n={6} />
  </Grid>
)

export const FourColumns: Story = () => (
  <Grid cols={4}>
    <GridItem n={1} />
    <GridItem n={2} />
    <GridItem n={3} />
    <GridItem n={4} />
  </Grid>
)
```

**Step 7: Commit**

```bash
mkdir -p src/components/ui/Grid
git add src/components/ui/Grid/
git commit -m "Add Grid component"
```

---

### Task 20: Create Modal Component

**Files:**
- Create: `src/components/ui/Modal/Modal.tsx`
- Create: `src/components/ui/Modal/Modal.test.tsx`
- Create: `src/components/ui/Modal/Modal.stories.tsx`
- Create: `src/components/ui/Modal/index.ts`

**Step 1: Write the failing test**

```typescript
// src/components/ui/Modal/Modal.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        Content
      </Modal>
    )
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders children when open', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders as dialog', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        Content
      </Modal>
    )
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('renders title when provided', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    )
    expect(screen.getByText('Modal Title')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/components/ui/Modal/Modal.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/components/ui/Modal/Modal.tsx
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean
  onClose: () => void
  title?: ReactNode
}

export function Modal({ open, onClose, title, className, children, ...props }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl',
          className
        )}
        {...props}
      >
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/components/ui/Modal/index.ts
export { Modal, type ModalProps } from './Modal'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/components/ui/Modal/Modal.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/components/ui/Modal/Modal.stories.tsx
import type { Story } from '@ladle/react'
import { useState } from 'react'
import { Button } from '../Button'
import { Modal } from './Modal'

export const Default: Story = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Modal Title">
        <p className="text-neutral-600">This is the modal content.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  )
}
```

**Step 7: Add @testing-library/user-event dependency and commit**

Add to package.json devDependencies: `"@testing-library/user-event": "^14.5.2"`

```bash
mkdir -p src/components/ui/Modal
git add src/components/ui/Modal/ package.json
git commit -m "Add Modal component"
```

---

### Task 21: Create UI Components Index

**Files:**
- Create: `src/components/ui/index.ts`

**Step 1: Create the barrel export**

```typescript
// src/components/ui/index.ts
export { Button, type ButtonProps } from './Button'
export { Card, type CardProps } from './Card'
export { Container, type ContainerProps } from './Container'
export { Grid, type GridProps } from './Grid'
export { Input, type InputProps } from './Input'
export { Modal, type ModalProps } from './Modal'
export { Section, type SectionProps } from './Section'
export { Typography, type TypographyProps } from './Typography'
```

**Step 2: Commit**

```bash
git add src/components/ui/index.ts
git commit -m "Add UI components barrel export"
```

---

## Phase 6: Feature Components

### Task 22: Create ChatBubble Component

**Files:**
- Create: `src/features/chat/ChatBubble.tsx`
- Create: `src/features/chat/ChatBubble.test.tsx`
- Create: `src/features/chat/ChatBubble.stories.tsx`

**Step 1: Write the failing test**

```typescript
// src/features/chat/ChatBubble.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatBubble } from './ChatBubble'

describe('ChatBubble', () => {
  it('renders message content', () => {
    render(<ChatBubble role="user" content="Hello!" />)
    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })

  it('applies user styles', () => {
    render(<ChatBubble role="user" content="Hello!" />)
    expect(screen.getByText('Hello!')).toHaveClass('bg-primary-500')
  })

  it('applies assistant styles', () => {
    render(<ChatBubble role="assistant" content="Hi there!" />)
    expect(screen.getByText('Hi there!')).toHaveClass('bg-neutral-100')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/ChatBubble.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/features/chat/ChatBubble.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const chatBubbleVariants = cva('max-w-[80%] rounded-2xl px-4 py-2', {
  variants: {
    role: {
      user: 'bg-primary-500 text-white ml-auto rounded-br-sm',
      assistant: 'bg-neutral-100 text-neutral-900 mr-auto rounded-bl-sm',
    },
  },
})

export interface ChatBubbleProps extends VariantProps<typeof chatBubbleVariants> {
  content: string
  className?: string
}

export function ChatBubble({ role, content, className }: ChatBubbleProps) {
  return <div className={cn(chatBubbleVariants({ role }), className)}>{content}</div>
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/features/chat/ChatBubble.test.tsx`
Expected: PASS

**Step 5: Create Ladle stories**

```typescript
// src/features/chat/ChatBubble.stories.tsx
import type { Story } from '@ladle/react'
import { ChatBubble } from './ChatBubble'

export const Conversation: Story = () => (
  <div className="space-y-4 p-4 max-w-md">
    <ChatBubble role="assistant" content="Hi! How can I help you today?" />
    <ChatBubble role="user" content="I'd like to discuss a project" />
    <ChatBubble
      role="assistant"
      content="Great! Tell me more about what you're looking to build."
    />
  </div>
)
```

**Step 6: Commit**

```bash
mkdir -p src/features/chat
git add src/features/chat/ChatBubble.tsx src/features/chat/ChatBubble.test.tsx src/features/chat/ChatBubble.stories.tsx
git commit -m "Add ChatBubble component"
```

---

### Task 23: Create ChatInput Component

**Files:**
- Create: `src/features/chat/ChatInput.tsx`
- Create: `src/features/chat/ChatInput.test.tsx`
- Create: `src/features/chat/ChatInput.stories.tsx`
- Create: `src/features/chat/index.ts`

**Step 1: Write the failing test**

```typescript
// src/features/chat/ChatInput.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('renders input and button', () => {
    render(<ChatInput onSend={() => {}} />)
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSend with input value when submitted', async () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)

    await userEvent.type(screen.getByPlaceholderText(/type a message/i), 'Hello!')
    await userEvent.click(screen.getByRole('button'))

    expect(onSend).toHaveBeenCalledWith('Hello!')
  })

  it('clears input after sending', async () => {
    render(<ChatInput onSend={() => {}} />)
    const input = screen.getByPlaceholderText(/type a message/i)

    await userEvent.type(input, 'Hello!')
    await userEvent.click(screen.getByRole('button'))

    expect(input).toHaveValue('')
  })

  it('disables send button when input is empty', () => {
    render(<ChatInput onSend={() => {}} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables input when disabled prop is true', () => {
    render(<ChatInput onSend={() => {}} disabled />)
    expect(screen.getByPlaceholderText(/type a message/i)).toBeDisabled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/features/chat/ChatInput.test.tsx`
Expected: FAIL

**Step 3: Write the implementation**

```typescript
// src/features/chat/ChatInput.tsx
import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/cn'

export interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  className,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSend(value.trim())
      setValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || !value.trim()}>
        Send
      </Button>
    </form>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/features/chat/index.ts
export { ChatBubble, type ChatBubbleProps } from './ChatBubble'
export { ChatInput, type ChatInputProps } from './ChatInput'
```

**Step 5: Run test to verify it passes**

Run: `pnpm test src/features/chat/ChatInput.test.tsx`
Expected: PASS

**Step 6: Create Ladle stories**

```typescript
// src/features/chat/ChatInput.stories.tsx
import type { Story } from '@ladle/react'
import { ChatInput } from './ChatInput'

export const Default: Story = () => (
  <div className="max-w-md">
    <ChatInput onSend={(msg) => console.log('Sent:', msg)} />
  </div>
)

export const Disabled: Story = () => (
  <div className="max-w-md">
    <ChatInput onSend={() => {}} disabled />
  </div>
)
```

**Step 7: Commit**

```bash
git add src/features/chat/
git commit -m "Add ChatInput component"
```

---

### Task 24: Create Navigation Components

**Files:**
- Create: `src/features/navigation/NavLink.tsx`
- Create: `src/features/navigation/Navbar.tsx`
- Create: `src/features/navigation/Footer.tsx`
- Create: `src/features/navigation/index.ts`

**Step 1: Create NavLink**

```typescript
// src/features/navigation/NavLink.tsx
import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '@/lib/cn'

export interface NavLinkProps extends LinkProps {
  className?: string
}

export function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'text-neutral-600 transition-colors hover:text-neutral-900',
        '[&.active]:text-primary-500 [&.active]:font-medium',
        className
      )}
      {...props}
    />
  )
}
```

**Step 2: Create Navbar**

```typescript
// src/features/navigation/Navbar.tsx
import { Link } from '@tanstack/react-router'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { NavLink } from './NavLink'

export function Navbar() {
  return (
    <header className="border-b border-neutral-200">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Vibes
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/work">Work</NavLink>
            <NavLink to="/insights">Insights</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          <Button size="sm">Let's Talk</Button>
        </nav>
      </Container>
    </header>
  )
}
```

**Step 3: Create Footer**

```typescript
// src/features/navigation/Footer.tsx
import { Link } from '@tanstack/react-router'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link to="/" className="text-xl font-bold">
              Vibes
            </Link>
            <p className="mt-2 text-sm text-neutral-500">
              The studio where AI agents come to life.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200 text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Vibes. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
```

**Step 4: Create index.ts**

```typescript
// src/features/navigation/index.ts
export { NavLink, type NavLinkProps } from './NavLink'
export { Navbar } from './Navbar'
export { Footer } from './Footer'
```

**Step 5: Commit**

```bash
mkdir -p src/features/navigation
git add src/features/navigation/
git commit -m "Add navigation components"
```

---

## Phase 7: TanStack Start Setup

### Task 25: Create TanStack Start App Config

**Files:**
- Create: `app.config.ts`

**Step 1: Create app.config.ts**

```typescript
// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [viteTsConfigPaths()],
  },
  server: {
    preset: 'cloudflare-pages',
  },
})
```

**Step 2: Commit**

```bash
git add app.config.ts
git commit -m "Add TanStack Start configuration"
```

---

### Task 26: Create Router

**Files:**
- Create: `src/router.tsx`
- Create: `src/entry-client.tsx`

**Step 1: Create router.tsx**

```typescript
// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  return createTanStackRouter({
    routeTree,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

**Step 2: Create entry-client.tsx**

```typescript
// src/entry-client.tsx
import { StartClient } from '@tanstack/react-start/client'
import { hydrateRoot } from 'react-dom/client'
import { createRouter } from './router'

const router = createRouter()

hydrateRoot(document, <StartClient router={router} />)
```

**Step 3: Commit**

```bash
git add src/router.tsx src/entry-client.tsx
git commit -m "Add router and client entry point"
```

---

### Task 27: Create Routes

**Files:**
- Create: `src/routes/__root.tsx`
- Create: `src/routes/_layout.tsx`
- Create: `src/routes/index.tsx`
- Create: `src/routes/services.tsx`
- Create: `src/routes/contact.tsx`

**Step 1: Create __root.tsx**

```typescript
// src/routes/__root.tsx
import { Meta, Scripts } from '@tanstack/react-start'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import '../styles/global.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Vibes - AI Agent Studio</title>
        <Meta />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

**Step 2: Create _layout.tsx**

```typescript
// src/routes/_layout.tsx
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/features/navigation/Navbar'
import { Footer } from '@/features/navigation/Footer'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
```

**Step 3: Create index.tsx (home page)**

```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Typography } from '@/components/ui/Typography'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Section padding="lg">
        <Container size="narrow" className="text-center">
          <Typography variant="h1" className="mb-4">
            The studio where AI agents come to life
          </Typography>
          <Typography variant="lead" className="mb-8">
            Delivering impact you can measure
          </Typography>
          <div className="flex justify-center gap-4">
            <Button size="lg">Let's Talk</Button>
            <Button variant="secondary" size="lg">
              See Our Work
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
```

**Step 4: Create services.tsx**

```typescript
// src/routes/services.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Typography } from '@/components/ui/Typography'

export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

function ServicesPage() {
  return (
    <Section>
      <Container>
        <Typography variant="h1" className="mb-8">
          Services
        </Typography>
        <Typography variant="lead">
          Coming soon...
        </Typography>
      </Container>
    </Section>
  )
}
```

**Step 5: Create contact.tsx**

```typescript
// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Typography } from '@/components/ui/Typography'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <Section>
      <Container>
        <Typography variant="h1" className="mb-8">
          Contact
        </Typography>
        <Typography variant="lead">
          Coming soon...
        </Typography>
      </Container>
    </Section>
  )
}
```

**Step 6: Commit**

```bash
mkdir -p src/routes
git add src/routes/
git commit -m "Add route pages"
```

---

## Phase 8: Cloudflare Configuration

### Task 28: Create Cloudflare Pages Config

**Files:**
- Create: `wrangler.toml`

**Step 1: Create wrangler.toml**

```toml
name = "vibes-website"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./dist"
```

**Step 2: Commit**

```bash
git add wrangler.toml
git commit -m "Add Cloudflare Pages configuration"
```

---

### Task 29: Create Chat Worker Scaffold

**Files:**
- Create: `workers/chat-api/wrangler.toml`
- Create: `workers/chat-api/src/index.ts`
- Create: `workers/chat-api/schema.sql`

**Step 1: Create worker wrangler.toml**

```toml
name = "vibes-chat-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "vibes-chat"
database_id = "placeholder-create-with-wrangler"

[vars]
ALLOWED_ORIGIN = "https://www.vibes.run"
MAX_REQUESTS_PER_MINUTE = "5"
MAX_MESSAGES_PER_SESSION = "20"
```

**Step 2: Create worker src/index.ts**

```typescript
// workers/chat-api/src/index.ts
export interface Env {
  DB: D1Database
  ALLOWED_ORIGIN: string
  MAX_REQUESTS_PER_MINUTE: string
  MAX_MESSAGES_PER_SESSION: string
  ANTHROPIC_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // TODO: Implement chat endpoint
    return new Response(JSON.stringify({ message: 'Chat API scaffold' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      },
    })
  },
}
```

**Step 3: Create schema.sql**

```sql
-- workers/chat-api/schema.sql

-- Chat sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  message_count INTEGER DEFAULT 0
);

-- Chat messages
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Lead submissions
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  name TEXT,
  email TEXT,
  company TEXT,
  project_type TEXT,
  industry TEXT,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_hash TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  window_start TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_ip_hash ON sessions(ip_hash);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
```

**Step 4: Commit**

```bash
mkdir -p workers/chat-api/src
git add workers/
git commit -m "Add chat worker scaffold"
```

---

## Phase 9: CI/CD

### Task 30: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create ci.yml**

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Deploy to Cloudflare Pages (Preview)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: vibes-website
          directory: dist

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Deploy to Cloudflare Pages (Production)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: vibes-website
          directory: dist
          branch: main
```

**Step 2: Commit**

```bash
mkdir -p .github/workflows
git add .github/workflows/ci.yml
git commit -m "Add GitHub Actions CI/CD workflow"
```

---

## Phase 10: E2E Tests

### Task 31: Create E2E Test

**Files:**
- Create: `e2e/home.spec.ts`

**Step 1: Create e2e test**

```typescript
// e2e/home.spec.ts
import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('loads and displays hero section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'The studio where AI agents come to life'
    )
  })

  test('displays primary CTA button', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('button', { name: /let's talk/i })).toBeVisible()
  })

  test('navigation links are visible on desktop', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: /services/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
  })
})
```

**Step 2: Commit**

```bash
mkdir -p e2e
git add e2e/
git commit -m "Add E2E tests"
```

---

## Phase 11: Ladle Configuration

### Task 32: Create Ladle Config

**Files:**
- Create: `.ladle/config.mjs`
- Create: `.ladle/components.tsx`

**Step 1: Create config.mjs**

```javascript
// .ladle/config.mjs
export default {
  stories: 'src/**/*.stories.tsx',
  viteConfig: '.ladle/vite.config.ts',
}
```

**Step 2: Create vite.config.ts for Ladle**

```typescript
// .ladle/vite.config.ts
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
```

**Step 3: Create components.tsx for global decorators**

```typescript
// .ladle/components.tsx
import type { GlobalProvider } from '@ladle/react'
import '../src/styles/global.css'

export const Provider: GlobalProvider = ({ children }) => <>{children}</>
```

**Step 4: Commit**

```bash
mkdir -p .ladle
git add .ladle/
git commit -m "Add Ladle configuration"
```

---

## Phase 12: Finalization

### Task 33: Create .gitignore

**Files:**
- Create: `.gitignore`

**Step 1: Create .gitignore**

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.vinxi/
.output/

# Ladle
build/

# Testing
coverage/
playwright-report/
test-results/

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local
.wrangler/
.dev.vars

# Nix
result

# Generated
*.gen.ts
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "Add .gitignore"
```

---

### Task 34: Update README

**Files:**
- Modify: `README.md`

**Step 1: Update README.md**

```markdown
# Vibes Marketing Website

The studio where AI agents come to life — delivering impact you can measure.

## Quick Start

```bash
# Enter dev environment (requires Nix)
nix develop

# Or with direnv
direnv allow

# Install dependencies
just install

# Start dev server
just dev

# View component library
just ladle
```

## Available Commands

Run `just` to see all available commands:

- `just dev` - Start development server
- `just ladle` - Start component preview
- `just typecheck` - Run TypeScript checks
- `just lint` - Run linting
- `just test` - Run unit tests
- `just e2e` - Run E2E tests
- `just build` - Build for production
- `just deploy` - Deploy to Cloudflare Pages

## Tech Stack

- **Framework:** TanStack Start
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + CVA
- **Components:** Ladle
- **Testing:** Vitest + Playwright
- **Hosting:** Cloudflare Pages
- **Dev Environment:** Nix flake

## Project Structure

```
src/
├── components/ui/    # Reusable design system components
├── features/         # Domain-specific components
├── routes/           # TanStack Start routes
├── styles/           # CSS tokens and global styles
└── lib/              # Utilities
workers/
└── chat-api/         # Cloudflare Worker for chat
```

See `docs/PRD.md` for full product requirements.
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "Update README with quick start guide"
```

---

### Task 35: Final Verification

**Step 1: Install dependencies**

Run: `pnpm install`

**Step 2: Run type check**

Run: `pnpm typecheck`
Expected: No errors

**Step 3: Run linting**

Run: `pnpm lint`
Expected: No errors

**Step 4: Run tests**

Run: `pnpm test`
Expected: All tests pass

**Step 5: Start dev server**

Run: `pnpm dev`
Expected: Server starts at http://localhost:3000

**Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "Fix any scaffolding issues"
```

---

## Summary

This implementation plan creates:

- **Dev Environment:** Nix flake with Node 22, pnpm, Wrangler, Just, direnv
- **8 UI Components:** Button, Card, Typography, Input, Container, Section, Grid, Modal
- **3 Feature Components:** ChatBubble, ChatInput, Navigation (Navbar, Footer, NavLink)
- **3 Routes:** Home, Services, Contact (stubs)
- **Full Testing:** Vitest unit tests + Playwright E2E
- **CI/CD:** GitHub Actions with preview/production deploys
- **Chat Worker:** Scaffold with D1 schema ready for implementation

Total tasks: 35
Estimated commits: ~30
