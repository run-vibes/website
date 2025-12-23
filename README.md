# Vibes Website

Marketing website for [Vibes](https://vibes.run) — the studio where AI agents come to life.

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
│   └── navigation/   # Navigation components (Navbar, Footer)
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
- [Scaffolding Design](docs/plans/01-scaffolding/design.md)
- [Implementation Plan](docs/plans/01-scaffolding/implementation.md)

## License

MIT
