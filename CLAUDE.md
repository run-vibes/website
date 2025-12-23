# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for Vibes, an agentic consulting & development studio. Positioned as "The studio where AI agents come to life — delivering impact you can measure."

## Tech Stack

- **Framework:** TanStack Start (static site generation)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages
- **Dev Environment:** Nix flake
- **Chat Backend:** Cloudflare Workers + D1 + Claude API

## Development Commands

**Important:** All `pnpm` commands must run inside the Nix dev shell. Either:
1. Enter the shell first: `nix develop`
2. Or prefix commands: `nix develop --command pnpm <command>`

If using direnv, the shell activates automatically when entering the project directory.

```bash
# Enter dev environment
nix develop

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test              # unit tests (Vitest)
pnpm e2e               # E2E tests (Playwright)

# Code quality
pnpm typecheck         # TypeScript
pnpm lint              # Biome linter
pnpm format            # Biome formatter

# Build for production
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```

**Using Just (task runner):**
```bash
just                   # List available commands
just dev               # Start dev server
just check             # Run all checks (typecheck, lint, test)
```

## Architecture

- Hand-coded JSX pages (no CMS)
- Chat interface for lead capture (rate-limited via Cloudflare Workers)
- Static site generation for performance

## Brand Direction

- Bold and energetic visual style
- Abstract/generative visuals (avoid generic AI imagery)
- Confident typography, strong colors

See `docs/PRD.md` for full product requirements.

## Testing Philosophy (TDD)

**REQUIRED:** Use the `superpowers:test-driven-development` skill when implementing any feature or fix. Invoke it with the Skill tool before writing implementation code.

We follow Test-Driven Development for component and utility code:

1. **Write the failing test first** — Define expected behavior before implementation
2. **Run the test to verify it fails** — Confirms the test is actually testing something
3. **Write minimal code to pass** — Only implement what's needed to make the test green
4. **Run tests to verify they pass** — Confirm implementation is correct
5. **Commit** — Small, frequent commits after each passing test

**Test structure:**
- Unit tests live next to components: `Button.test.tsx` beside `Button.tsx`
- E2E tests in `e2e/` folder for user journey testing
- Use `@testing-library/react` for component tests (test behavior, not implementation)
- Use Playwright for E2E tests

**What to test:**
- Component rendering and variants
- User interactions (clicks, input)
- Conditional rendering
- Props pass-through and className merging

**What NOT to test:**
- Implementation details (internal state, private methods)
- Styling (covered by visual review in Ladle)
- Third-party library behavior

## Verification Before Completing Work

**REQUIRED:** Always run these verification steps before marking work complete:

1. **`just check`** — Run all code quality checks:
   - `pnpm typecheck` — TypeScript type checking
   - `pnpm lint` — Biome linting
   - `pnpm test` — Unit tests

2. **`just ladle`** — Visual component review:
   - Verify components render correctly in isolation
   - Check variants and edge cases visually
   - Confirm no visual regressions

All checks must pass before work is considered done.

## Git Conventions

- Do not add "Generated with Claude Code" to commit messages
- Do not add "Co-Authored-By" trailers to commits
