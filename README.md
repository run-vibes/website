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

## Deployment

### Environments

| Environment | Pages URL | Worker URL | D1 Database |
|-------------|-----------|------------|-------------|
| Production | vibes.run | vibes-chat-api.workers.dev | vibes-chat |
| Staging | *.website.pages.dev | vibes-chat-api-staging.workers.dev | vibes-chat-staging |

### Automatic Deployments (CI)

- **Pull requests:** Pages preview deploys automatically, points to staging worker
- **Merge to main:** Production Pages deploys automatically

Worker deployments are manual (see below).

### Manual Worker Deployment

Use the GitHub Actions workflow or just tasks:

```bash
# Via GitHub Actions (recommended)
# Go to Actions → Deploy Worker → Run workflow → Select environment

# Via just tasks (requires CLOUDFLARE_API_TOKEN)
just worker-deploy staging
just worker-deploy production
```

### Just Tasks Reference

**Development:**
| Task | Description |
|------|-------------|
| `just dev` | Start frontend dev server |
| `just ladle` | Start component preview |
| `just setup-env` | Create .env from .env.example |

**Quality:**
| Task | Description |
|------|-------------|
| `just check` | Run all checks (typecheck, lint, test) |
| `just typecheck` | TypeScript type checking |
| `just lint` | Biome linting |
| `just format` | Biome formatting |
| `just test` | Unit tests |
| `just e2e` | E2E tests |

**Build & Deploy:**
| Task | Description |
|------|-------------|
| `just build` | Build for production |
| `just pages-deploy` | Deploy Pages (production) |
| `just pages-preview` | Deploy Pages preview |
| `just pages-env NAME VALUE` | Set Pages env variable |

**Worker:**
| Task | Description |
|------|-------------|
| `just worker-dev` | Run worker locally |
| `just worker-deploy ENV` | Deploy worker (staging\|production) |
| `just worker-migrate ENV` | Run D1 migrations (staging\|production\|local) |
| `just worker-db-create` | Create production D1 database |
| `just worker-db-create-staging` | Create staging D1 database |
| `just worker-secret NAME [ENV]` | Set worker secret |

### Initial Setup (One-time)

1. **Create D1 databases:**
   ```bash
   just worker-db-create          # Creates vibes-chat
   just worker-db-create-staging  # Creates vibes-chat-staging
   ```

2. **Update wrangler.toml** with the database IDs from step 1

3. **Run initial migrations:**
   ```bash
   just worker-migrate staging
   just worker-migrate production
   ```

4. **Set secrets:**
   ```bash
   # Production
   just worker-secret ANTHROPIC_API_KEY
   just worker-secret RESEND_API_KEY

   # Staging (no RESEND_API_KEY - emails disabled)
   just worker-secret ANTHROPIC_API_KEY staging
   ```

5. **Set GitHub secrets:**
   - `CLOUDFLARE_API_TOKEN` - API token with Pages + Workers + D1 permissions
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

See [docs/SECURITY.md](docs/SECURITY.md) for complete security guidelines.

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
