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

Plans live in `docs/plans/` with numbered directories:

```
docs/plans/
├── 01-scaffolding/
│   ├── design.md
│   └── implementation.md
├── 02-chat-backend/
│   ├── design.md
│   └── implementation.md
└── ...
```

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

After completing all tasks:

1. Run all checks:
   ```bash
   just check
   ```

2. Verify dev server:
   ```bash
   just dev
   ```

3. Visual review (if UI changes):
   ```bash
   just ladle
   ```

4. Run E2E tests:
   ```bash
   just e2e
   ```

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
