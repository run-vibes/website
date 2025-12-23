# Project Scaffolding Design

## Overview

Design for the initial scaffolding of the Vibes marketing website. This establishes the development environment, component library foundation, and deployment pipeline before building out pages.

**Approach:** Component Library First — build the design system before pages to ensure visual consistency.

## Decisions Summary

| Area | Choice |
|------|--------|
| Approach | Component Library First |
| Styling | CSS Variables + CVA (hybrid) |
| Component Preview | Ladle |
| Components | Full foundation (core, interactive, layout, nav) |
| Folder Structure | Feature-based (`ui/` + `features/`) |
| Design Tokens | Full system (colors, typography, spacing, radius, shadows) |
| Dev Environment | Nix flake: Node 22, pnpm, Wrangler, Just, direnv |
| Linting/Formatting | Biome |
| Deployment | Full pipeline (Pages + Workers + D1 + GitHub Actions) |
| Testing | Vitest + Playwright |

---

## 1. Project Structure

```
vibes-website/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Lint, typecheck, test, deploy
├── src/
│   ├── components/
│   │   └── ui/                    # Reusable design system
│   │       ├── Button/
│   │       │   ├── Button.tsx
│   │       │   ├── Button.test.tsx
│   │       │   ├── Button.stories.tsx
│   │       │   └── index.ts
│   │       ├── Card/
│   │       ├── Typography/
│   │       ├── Input/
│   │       ├── Modal/
│   │       ├── Container/
│   │       ├── Section/
│   │       └── Grid/
│   ├── features/
│   │   ├── chat/                  # Chat interface components
│   │   │   ├── ChatBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   └── navigation/            # Nav components
│   │       ├── Navbar.tsx
│   │       ├── NavLink.tsx
│   │       └── Footer.tsx
│   ├── routes/                    # TanStack Start routes
│   │   ├── __root.tsx
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── services.tsx
│   │   ├── contact.tsx
│   │   └── dev.tsx
│   ├── styles/
│   │   ├── tokens.css             # CSS variable definitions
│   │   └── global.css             # Base styles, resets
│   ├── lib/
│   │   ├── cn.ts                  # clsx + tailwind-merge helper
│   │   └── variants.ts            # Shared CVA utilities
│   ├── test/
│   │   └── setup.ts               # Vitest setup
│   ├── router.tsx
│   └── entry-client.tsx
├── workers/
│   └── chat-api/                  # Cloudflare Worker for chat
│       ├── src/
│       │   └── index.ts
│       ├── schema.sql
│       └── wrangler.toml
├── e2e/                           # Playwright E2E tests
│   └── home.spec.ts
├── flake.nix                      # Nix dev environment
├── flake.lock
├── .envrc                         # direnv config
├── justfile                       # Task runner
├── biome.json                     # Linting/formatting
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── app.config.ts                  # TanStack Start config
├── package.json
└── wrangler.toml                  # Pages config (root)
```

**Key decisions:**
- `src/components/ui/` — Pure, reusable components with no app state
- `src/features/` — Domain-specific components that may use context
- `workers/` — Separate folder for Cloudflare Workers
- `src/styles/tokens.css` — Single source of truth for design tokens

---

## 2. Design Tokens

### Token Structure (`src/styles/tokens.css`)

```css
:root {
  /* ─── Colors ─────────────────────────────────── */
  /* Primary - bold, energetic brand color */
  --color-primary-50: #fef2f2;
  --color-primary-100: #fee2e2;
  --color-primary-500: #ef4444;
  --color-primary-600: #dc2626;
  --color-primary-900: #7f1d1d;

  /* Neutral - grays for text, borders, backgrounds */
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

  /* Semantic */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* ─── Typography ─────────────────────────────── */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;

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

  /* ─── Spacing ────────────────────────────────── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* ─── Border Radius ──────────────────────────── */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* ─── Shadows ────────────────────────────────── */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
}
```

### Tailwind Integration (`tailwind.config.ts`)

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
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          900: 'var(--color-primary-900)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          500: 'var(--color-neutral-500)',
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

---

## 3. Component Architecture

### CVA Pattern

Each component in `src/components/ui/` follows this structure:

```
Button/
├── Button.tsx          # Component implementation
├── Button.test.tsx     # Unit tests
├── Button.stories.tsx  # Ladle stories
└── index.ts            # Re-export
```

### Example: Button Component

```typescript
// src/components/ui/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        ghost: 'hover:bg-neutral-100 text-neutral-900',
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

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### cn Helper

```typescript
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Ladle Stories

```typescript
// src/components/ui/Button/Button.stories.tsx
import type { Story } from '@ladle/react'
import { Button } from './Button'

export const Primary: Story = () => <Button>Click me</Button>
export const Secondary: Story = () => <Button variant="secondary">Secondary</Button>
export const Ghost: Story = () => <Button variant="ghost">Ghost</Button>
export const Sizes: Story = () => (
  <div className="flex gap-4 items-center">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)
```

---

## 4. Dev Environment

### Nix Flake (`flake.nix`)

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

### direnv (`.envrc`)

```bash
use flake
```

### Task Runner (`justfile`)

```just
default:
    @just --list

install:
    pnpm install

dev:
    pnpm dev

ladle:
    pnpm ladle

typecheck:
    pnpm typecheck

lint:
    pnpm lint

format:
    pnpm format

check: typecheck lint test

test:
    pnpm test

e2e:
    pnpm e2e

build:
    pnpm build

deploy:
    pnpm deploy

deploy-worker:
    cd workers/chat-api && wrangler deploy
```

---

## 5. Cloudflare Deployment

### Pages Config (`wrangler.toml`)

```toml
name = "vibes-website"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./dist"
```

### Chat Worker (`workers/chat-api/wrangler.toml`)

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

### D1 Schema (`workers/chat-api/schema.sql`)

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  message_count INTEGER DEFAULT 0
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE leads (
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

CREATE TABLE rate_limits (
  ip_hash TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  window_start TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### GitHub Actions (`.github/workflows/ci.yml`)

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

      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test

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

      - run: pnpm install
      - run: pnpm build

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

      - run: pnpm install
      - run: pnpm build

      - name: Deploy to Cloudflare Pages (Production)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: vibes-website
          directory: dist
          branch: main
```

---

## 6. Testing Setup

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

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

### Playwright Config (`playwright.config.ts`)

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

---

## 7. TanStack Start Configuration

### App Config (`app.config.ts`)

```typescript
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

### Router (`src/router.tsx`)

```typescript
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

---

## 8. Package Configuration

### `package.json`

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
    "@tanstack/react-router": "^1.x",
    "@tanstack/react-start": "^1.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@ladle/react": "^4.x",
    "@playwright/test": "^1.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/react": "^16.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "@vitejs/plugin-react": "^4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x",
    "vite-tsconfig-paths": "^5.x",
    "vitest": "^2.x",
    "wrangler": "^3.x",
    "@biomejs/biome": "^1.x"
  }
}
```

### `biome.json`

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

---

## Components to Scaffold

### UI Components (`src/components/ui/`)

| Component | Variants | Purpose |
|-----------|----------|---------|
| Button | primary, secondary, ghost + sm, md, lg | CTAs, form actions |
| Card | default, interactive | Services, case studies |
| Typography | h1-h4, body, lead, caption | Text hierarchy |
| Input | default, error | Form fields |
| Modal | default | Dialogs, chat overlay |
| Container | default, narrow, wide | Max-width wrapper |
| Section | default | Page sections with spacing |
| Grid | 2-col, 3-col, 4-col | Layout grids |

### Feature Components (`src/features/`)

| Component | Location | Purpose |
|-----------|----------|---------|
| ChatBubble | features/chat/ | Chat message display |
| ChatInput | features/chat/ | Chat text input |
| Navbar | features/navigation/ | Site header |
| NavLink | features/navigation/ | Nav menu items |
| Footer | features/navigation/ | Site footer |

---

## Implementation Notes

1. **Token values are placeholders** — actual brand colors come during design phase
2. **Components are stubs** — implementations follow CVA pattern with minimal defaults
3. **Routes are empty** — just enough to verify routing works
4. **Worker is scaffold only** — needs API implementation in future phase

---

## Next Steps

After scaffolding is complete:
1. Define actual brand colors/typography
2. Implement component interiors
3. Build out page content (Phase 1: Home, Services, Contact)
