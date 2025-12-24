# Planning Conventions

This document describes how to create design and implementation plans for the Vibes website project when working with Claude Code.

## When to Create a Plan

Create a plan when:

- Adding a new feature or major functionality
- Making architectural changes
- Refactoring significant code areas
- Setting up new infrastructure or tooling

Skip planning for:

- Bug fixes with obvious solutions
- Small styling tweaks
- Documentation updates
- Single-file changes

## Plan Directory Structure

Plans live in `docs/plans/` with numbered directories. See [Plans Index](plans/README.md) for the current structure and list of plans.

**Naming:**
- Prefix with zero-padded number (01, 02, 03...)
- Use kebab-case for the name
- Keep names short but descriptive

## Phase 1: Design Document

Before implementation, create a `design.md` that captures architectural decisions.

### Design Document Template

```markdown
# [Feature Name] Design

## Overview

[1-2 paragraphs describing what this feature does and why we're building it]

**Approach:** [Brief summary of the chosen approach]

## Decisions Summary

| Area | Choice |
|------|--------|
| [Decision Area] | [Choice Made] |
| ... | ... |

---

## 1. [First Major Section]

[Detailed explanation with code examples, diagrams, or specifications]

---

## 2. [Second Major Section]

...

---

## Implementation Notes

[Any important context for the implementation phase]

## Next Steps

[What needs to happen after design is approved]
```

### Key Elements

1. **Decisions Table** — Quick reference for all major choices
2. **Rationale** — Explain *why* not just *what*
3. **Code Examples** — Show patterns, not just describe them
4. **Trade-offs** — Document what was considered and rejected

### Example: Decision Documentation

```markdown
### Styling Approach

**Choice:** CSS Variables + CVA (hybrid)

**Considered:**
- Pure Tailwind (fast but no design tokens)
- CSS-in-JS (powerful but runtime cost)
- CSS Variables + CVA (tokens + type-safe variants)

**Rationale:** CSS variables provide a single source of truth for design tokens while CVA gives type-safe component variants. This balances maintainability with performance.
```

## Phase 2: Implementation Plan

After design approval, create an `implementation.md` with step-by-step tasks.

### Implementation Plan Template

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing the outcome]

**Architecture:** [Brief recap of key design decisions]

**Tech Stack:** [Relevant technologies]

---

## Phase 1: [Phase Name]

### Task 1: [Task Name]

**Files:**
- Create: `path/to/file.ts`
- Modify: `path/to/existing.ts`

**Step 1: [Action]**

[Description or code]

**Step 2: [Action]**

...

**Step N: Commit**

```bash
git add [files]
git commit -m "[type]: [description]"
```

---

### Task 2: [Next Task]

...

---

## Summary

[What was accomplished, total tasks/commits, next steps]
```

### Key Principles

#### 1. Test-Driven Development

For components and utilities, follow TDD:

```markdown
**Step 1: Write the failing test**

\`\`\`typescript
// src/lib/cn.test.ts
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
})
\`\`\`

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/cn.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write the implementation**

\`\`\`typescript
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
\`\`\`

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/cn.test.ts`
Expected: PASS
```

#### 2. Small, Focused Tasks

Each task should:
- Have a single clear purpose
- Be completable in one sitting
- End with a commit
- Be independently verifiable

#### 3. Explicit Verification

Include expected outcomes:

```markdown
**Step 5: Run test to verify it passes**

Run: `pnpm test`
Expected: All tests pass (64 total)
```

#### 4. Commit After Each Task

```markdown
**Step 6: Commit**

```bash
git add src/components/ui/Button/
git commit -m "feat: add Button component"
```
```

## Using Plans with Claude Code

### Creating a Plan

1. Use the brainstorming skill first:
   ```
   /superpowers:brainstorm
   ```

2. Write the design document discussing options

3. Create the implementation plan with specific tasks

### Executing a Plan

Reference the skill at the top of the implementation plan:

```markdown
> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
```

Then invoke:
```
/superpowers:execute-plan
```

### Verification Workflow

Follow the verification steps in [CLAUDE.md](../CLAUDE.md#verification-before-completing-work), then update [PROGRESS.md](PROGRESS.md) with completed tasks and PR numbers.

## Best Practices

### Do

- Break large features into multiple plans
- Include code snippets for complex patterns
- Document the "why" alongside the "what"
- Specify exact file paths
- Include verification steps
- Follow TDD for testable code

### Don't

- Skip the design phase for significant work
- Create tasks that are too large
- Leave decisions implicit
- Forget commit instructions
- Skip verification steps

## Plan Review Checklist

Before implementing, verify:

- [ ] Design document captures all major decisions
- [ ] Trade-offs are documented
- [ ] Implementation tasks are small and focused
- [ ] Each task ends with a commit
- [ ] TDD pattern used for testable code
- [ ] Verification steps are explicit
- [ ] File paths are complete and accurate

---

## Brand Design & Visual Design

This section describes how to collaborate with Claude Code on brand identity, visual design systems, and theme development.

### When to Use This Process

Use the brand design process when:

- Creating or updating logo/identity systems
- Defining or revising color palettes
- Establishing typography hierarchies
- Building visual effect systems (particles, gradients, textures)
- Theming an application (light/dark mode, brand variants)
- Creating design prototypes for stakeholder review

### The Iterative Question Approach

Brand design is subjective and benefits from an **iterative, question-driven** approach rather than presenting a complete solution upfront.

**Process flow:**

1. **Gather context** — Read existing brand docs, prototypes, PRD, design tokens
2. **Ask one question at a time** — Don't overwhelm with multiple decisions
3. **Prefer multiple choice** — Easier to respond than open-ended questions
4. **Create visual explorations** — Build HTML/CSS prototypes to show options
5. **Present design in sections** — 200-300 words per section, validate each
6. **Document decisions** — Write up the final design with rationale

### Example Questions & Prompts

#### Color Direction

```
The current palette is [X]. Would you like to:

1. **Keep it as-is** — [Description of current approach]
2. **Add an accent color** — Keep the base but introduce [examples]
3. **Warm/cool shift** — Adjust the temperature of neutrals
4. **Complete revision** — Explore entirely new directions

Which resonates?
```

#### Logo Direction

```
For "[Brand Name]" as a brand, I see a few approaches:

1. **Pure wordmark** — The name styled typographically, no symbol
2. **Lettermark + wordmark** — A stylized initial that works alone at small sizes
3. **Abstract mark + wordmark** — A conceptual symbol paired with the name

Which direction feels right?
```

#### Typography Pairing

```
The prototype uses:
- **Display:** [Font A] (monospace/serif/sans)
- **Body:** [Font B] (sans-serif)

Do you want to:

1. **Keep [Font A] + [Font B]** — [Rationale for why it works]
2. **Explore alternatives for display** — [Alternative options]
3. **Add a third font** — For special use cases like [example]
```

#### Visual Effects

```
The prototype has several effect layers. Which should carry over?

| Layer | Description | Performance Impact |
|-------|-------------|-------------------|
| **Effect A** | [Description] | [Low/Medium/High] |
| **Effect B** | [Description] | [Low/Medium/High] |

Options:
1. **Full effects** — All layers, complete experience
2. **Subtle only** — CSS-only effects, no JavaScript
3. **Hero only** — Full effects on hero, minimal elsewhere
4. **Start minimal** — Add effects incrementally
```

### Key Terminology

| Term | Definition |
|------|------------|
| **Wordmark** | Logo that is purely typographic (the brand name styled) |
| **Lettermark** | Logo using initials or a single letter |
| **Logomark** | Abstract symbol or icon representing the brand |
| **Design tokens** | Named values for colors, spacing, typography (CSS variables) |
| **Color palette** | The defined set of colors for a brand |
| **Typography hierarchy** | The system of font sizes, weights, and styles |
| **Primary/Secondary accent** | Main brand color vs. supporting color |
| **Neutral palette** | Grays and near-whites/blacks for backgrounds and text |
| **Effect layers** | Visual overlays like noise, gradients, particles |
| **Monospace** | Fixed-width font where all characters have equal width |
| **Sans-serif** | Font without decorative strokes (clean, modern) |
| **Display font** | Font used for headlines and large text |
| **Body font** | Font used for paragraphs and readable content |

### Prototype-Based Exploration

For visual decisions, **show don't tell**. Create HTML/CSS prototypes that stakeholders can view in the browser.

**Prototype location:** `prototypes/[exploration-name]/`

**Prototype structure:**
```
prototypes/
├── logo-explorations/
│   └── index.html        # Multiple logo concepts in one page
├── color-variants/
│   ├── warm/index.html
│   ├── cool/index.html
│   └── mono/index.html
└── theme-name/
    ├── index.html        # Full page prototype
    ├── styles.css        # Theme CSS with custom properties
    └── README.md         # Variant documentation
```

**Opening prototypes:**
```bash
# Open a specific prototype
xdg-open prototypes/logo-explorations/index.html

# Open all prototypes (if configured)
just prototypes
```

### Design Document Template (Brand)

```markdown
# Brand Design: [Theme/Direction Name]

**Date:** YYYY-MM-DD
**Status:** Draft | Approved
**Branch:** `branch-name`

---

## Summary

[1-2 sentences describing the brand direction]

---

## Identity

### Logo System

| Element | Description |
|---------|-------------|
| **Primary mark** | [Description] |
| **Wordmark** | [Description] |
| **Favicon** | [Description] |

### Color Palette

\`\`\`css
:root {
  --bg-primary: #value;
  --accent-primary: #value;
  /* ... */
}
\`\`\`

| Role | Value | Usage |
|------|-------|-------|
| Background | `#hex` | [Where used] |
| Primary | `#hex` | [Where used] |

---

## Typography

### Font Stack

\`\`\`css
--font-display: 'Font Name', fallback, generic;
--font-body: 'Font Name', fallback, generic;
\`\`\`

### Hierarchy

| Element | Font | Weight | Size | Style |
|---------|------|--------|------|-------|
| Hero headline | [Font] | [Weight] | [Size] | [Style notes] |

---

## Visual Effects

[Describe effect layers, implementation approach, performance notes]

---

## Implementation Approach

### Phase A: [First Phase]

1. [Step]
2. [Step]

### Phase B: [Second Phase]

1. [Step]
2. [Step]

---

## Design Decisions

### Why [Decision]?

[Rationale explaining the choice]
```

### Workflow Summary

1. **Start with brainstorming skill:**
   ```
   /superpowers:brainstorm
   ```

2. **Gather context:** Read PRD, existing tokens, prototypes

3. **Ask questions one at a time:** Color → Logo → Typography → Effects

4. **Create visual explorations:** Build prototypes stakeholders can see

5. **Present design in sections:** Validate each before moving on

6. **Document decisions:** Write the brand design document

7. **Commit to branch:** Keep design work in a dedicated branch

8. **Create implementation plan:** After approval, detail the tasks

### Example Session Flow

```
User: Create a brand design plan for the new theme

Claude: [Reads existing docs, prototypes, tokens]

Claude: "The current palette is X. Would you like to:
        1. Keep as-is
        2. Add accent color
        3. Warm up the grays"

User: "Keep as-is for now"

Claude: "Next: Logo direction. I see a few approaches:
        1. Pure wordmark
        2. Lettermark + wordmark
        3. Abstract mark + wordmark"

User: "Can you show me examples of 2 and 3?"

Claude: [Creates prototypes/logo-explorations/index.html]
        "I've created 10 concepts. Take a look and let me know
        which directions resonate."

User: "I like the Slash V concept"

Claude: "Great choice. Next: Typography..."

[Continue until all decisions made]

Claude: [Writes design document, commits to branch]
        "Design documented. Ready to set up for implementation?"
```

---

## Database Migrations

### Idempotent SQL Convention

All schema changes in `workers/chat-api/schema.sql` must be idempotent (safe to run repeatedly):

```sql
-- Tables: use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS my_table (...);

-- Indexes: use IF NOT EXISTS
CREATE INDEX IF NOT EXISTS idx_name ON table(column);

-- Columns: SQLite doesn't support IF NOT EXISTS for columns
-- Use a migration script that checks first, or accept the error
```

### Running Migrations

```bash
just worker-migrate local      # Local development
just worker-migrate staging    # Staging environment
just worker-migrate production # Production environment
```

Migrations run automatically after worker deploys via CI.
