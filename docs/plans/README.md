# Plans Index

This directory contains design and implementation plans for the Vibes website project.

## Plan Structure

Each plan lives in its own numbered directory following the pattern `NN-short-name/`:

```
docs/plans/
├── README.md                    # This index file
├── 01-scaffolding/              # First plan
│   ├── design.md                # Architectural decisions and design
│   └── implementation.md        # Step-by-step implementation tasks
└── 02-feature-name/             # Next plan
    ├── design.md
    └── implementation.md
```

## Current Plans

| # | Name | Status | Description |
|---|------|--------|-------------|
| 01 | [scaffolding](./01-scaffolding/) | Complete | Initial project setup: dev environment, component library, deployment pipeline |

## Plan Lifecycle

1. **Draft** — Plan is being written, not yet reviewed
2. **Ready** — Plan is complete and ready for implementation
3. **In Progress** — Implementation has started
4. **Complete** — All tasks finished, verified working → [Update PROGRESS.md](../PROGRESS.md)

## How to Use Plans

### Executing a Plan

When you're ready to implement a plan, use the Claude Code skill:

```
/superpowers:execute-plans
```

This skill reads the implementation plan and guides you through each task with proper verification.

### Creating New Plans

See [docs/PLAN.md](../PLAN.md) for conventions on creating design and implementation plans.

## Plan Contents

### Design Document (`design.md`)

Captures the **what** and **why**:
- Overview and goals
- Key decisions with rationale
- Architecture and structure
- Component specifications
- Trade-off analysis

### Implementation Plan (`implementation.md`)

Captures the **how**:
- Phased task breakdown
- Specific file changes
- Code examples
- Test-first approach
- Commit instructions
- Verification steps
