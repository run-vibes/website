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

```bash
# Enter dev environment
nix develop

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
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

## Git Conventions

- Do not add "Generated with Claude Code" to commit messages
- Do not add "Co-Authored-By" trailers to commits
