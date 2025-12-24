# Vibes Website

[![CI](https://github.com/run-vibes/website/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/run-vibes/website/actions/workflows/ci.yml)

Marketing website for [Vibes](https://vibes.run) — the studio where AI agents come to life.

## Features

- **AI-powered chat** — Conversational contact form powered by Claude API
- **Daybreak design system** — Monochrome geometric aesthetic with subtle animations
- **Static site generation** — Fast page loads via TanStack Start + Cloudflare Pages
- **Visual effects** — Geometric grids, noise overlays, and scanlines

## Tech Stack

- **Framework:** TanStack Start (static site generation)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS Variables + CVA
- **Hosting:** Cloudflare Pages
- **Dev Environment:** Nix flake + direnv
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Linting:** Biome

## Development

```bash
# Enter dev environment (auto-activated with direnv)
nix develop

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Component preview (Ladle)
pnpm ladle

# Run tests
pnpm test        # unit tests
pnpm e2e         # E2E tests

# Code quality
pnpm typecheck   # TypeScript
pnpm lint        # Biome linting
pnpm format      # Biome formatting

# Build
pnpm build
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, etc.)
│   ├── navigation/   # Navigation components (Navbar, Footer)
│   └── effects/      # Visual effects (GeometricGrid, NoiseOverlay, etc.)
├── features/
│   └── chat/         # Chat feature components
├── routes/           # TanStack Start file-based routes
├── styles/           # Global styles and design tokens
└── lib/              # Utilities (cn helper)
workers/
└── chat-api/         # Cloudflare Worker for chat API
```

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [Project Progress](docs/PROGRESS.md)
- [Planning Conventions](docs/PLAN.md)
- [Plans Index](docs/plans/README.md)

## License

MIT
