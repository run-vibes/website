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
just install           # Install dependencies
just dev               # Start dev server
just ladle             # Start Ladle component preview
just typecheck         # Run TypeScript checking
just lint              # Run Biome linter
just format            # Format code with Biome
just check             # Run all checks (typecheck, lint, test)
just test              # Run unit tests
just e2e               # Run E2E tests
just build             # Build for production
just deploy            # Deploy to Cloudflare Pages
just deploy-worker     # Deploy chat worker
just prototypes        # Open all design prototypes in browser
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

2. **`just dev`** — Verify dev server starts:
   - Confirm no startup errors
   - Check that the page loads at http://localhost:3000

3. **`just ladle`** — Visual component review:
   - Verify components render correctly in isolation
   - Check variants and edge cases visually
   - Confirm no visual regressions

4. **`just e2e`** — End-to-end tests:
   - Run Playwright tests against the built app
   - Verify critical user journeys work

All checks must pass before work is considered done.

## Progress Tracking

**REQUIRED:** Before finishing a branch (creating PR or merging), update `docs/PROGRESS.md`:

1. Update task status in the relevant phase/milestone table
2. Add a **linked PR reference** to completed tasks using the format: `[#N](https://github.com/run-vibes/website/pull/N)`
3. Update the phase progress percentage if significant work was done
4. Add an entry to the "Recent Updates" section at the bottom with linked PRs

**Always use linked PR references**, not just `#N`. This makes the progress doc navigable.

This keeps the project progress visible and helps track what's been accomplished across branches.

## Plan Documentation

Plans live in `docs/plans/` using numbered directories:

```
docs/plans/
├── 01-scaffolding/
│   └── design.md
├── 02-homepage-prototypes/
│   ├── design.md
│   └── implementation.md
├── 03-prototype-refinements/
│   ├── design.md
│   └── implementation.md
├── 04-daybreak-hybrid/
│   └── design.md
├── 05-phase1-completion/
│   ├── design.md
│   └── implementation.md
└── 06-brand-design/
    ├── design.md
    └── implementation.md
```

**Conventions:**
- Use sequential numbering: `01-`, `02-`, `03-`, etc.
- Use kebab-case for directory names
- Each plan directory contains:
  - `design.md` — High-level design, decisions, and rationale
  - `implementation.md` — Detailed step-by-step tasks (when applicable)
- Reference plans by number in commits and discussions (e.g., "per plan 02")

## Git Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>

[optional body]
```

**Types:**
- `feat:` — New feature or functionality
- `fix:` — Bug fix
- `docs:` — Documentation changes only
- `style:` — Formatting, whitespace (no code change)
- `refactor:` — Code restructuring (no behavior change)
- `test:` — Adding or updating tests
- `chore:` — Build, tooling, dependencies

**Guidelines:**
- Use imperative mood: "add feature" not "added feature"
- Keep subject line under 72 characters
- No period at end of subject line
- Separate subject from body with blank line
- Body explains *what* and *why*, not *how*

**Do NOT include:**
- "Generated with Claude Code" footers
- "Co-Authored-By" trailers

**Examples:**
```
feat: add user authentication flow

fix: prevent form submission on empty input

refactor: extract validation logic to shared utility
```

## Pull Request Conventions

**Title format:** Same as commit message (`<type>: <description>`)

**Body structure:**
```markdown
## Summary
- Bullet points describing what changed (2-4 items)

## Test Plan
- [ ] Verification steps as checklist
```

**Guidelines:**
- Title should describe the overall change, not individual commits
- Summary bullets focus on *what* changed, not *how*
- Test plan includes both automated checks and manual verification
- Link related issues with "Fixes #123" or "Closes #123"

**Example:**
```markdown
## Summary
- Add login form with email/password validation
- Implement session persistence with secure cookies
- Add logout button to navigation

## Test Plan
- [x] All unit tests passing (`pnpm test`)
- [x] TypeScript and lint checks pass (`just check`)
- [ ] Manual test: login flow works end-to-end
- [ ] Manual test: session persists across page refresh
```
