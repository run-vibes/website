# CI/CD Automation Design

**Status:** Ready
**Created:** 2025-12-24

## Overview

Automate deployment to Cloudflare (Pages and Workers) via CI using just tasks. Introduces staging environment for safe preview testing.

## Goals

1. Auto-deploy Pages previews on PR, production on merge to main
2. Manual trigger for worker deployments (staging/production)
3. Idempotent database migrations
4. Consistent just task naming (noun-verb pattern)
5. Secure authentication via Cloudflare API token

## Architecture

### Environments

```
┌─────────────────────────────────────────────────────────┐
│                      PRODUCTION                         │
├─────────────────────────────────────────────────────────┤
│  Pages: vibes.run                                       │
│  Worker: vibes-chat-api.workers.dev                     │
│  D1: vibes-chat                                         │
│  Secrets: ANTHROPIC_API_KEY, RESEND_API_KEY             │
│  NOTIFICATION_EMAIL: hello@vibes.run                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       STAGING                           │
├─────────────────────────────────────────────────────────┤
│  Pages: <pr-hash>.website.pages.dev (preview URLs)      │
│  Worker: vibes-chat-api-staging.workers.dev             │
│  D1: vibes-chat-staging                                 │
│  Secrets: ANTHROPIC_API_KEY only (no emails)            │
│  NOTIFICATION_EMAIL: (empty - disabled)                 │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

- PR previews automatically get `VITE_CHAT_API_URL` pointing to staging worker
- Production Pages points to production worker
- Staging worker is persistent — not redeployed per PR

### Key Principle

Pages deploys are low-risk (static assets), so they auto-deploy. Worker deploys touch API keys and databases, so production worker requires manual trigger.

## CI/CD Workflow

### Pull Request

```
1. check        → typecheck, lint, test
2. build        → pnpm build
3. e2e          → Playwright tests
4. pages-preview → Deploy to Cloudflare Pages preview
                   (sets VITE_CHAT_API_URL to staging)
```

### Push to Main

```
1. check        → typecheck, lint, test
2. build        → pnpm build
3. e2e          → Playwright tests
4. pages-deploy → Deploy to Cloudflare Pages production
```

### Manual Worker Deploy (workflow_dispatch)

```
Inputs: environment (staging | production)

1. worker-deploy → Deploy worker to selected env
2. worker-migrate → Run idempotent migrations
```

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | API token with Pages + Workers + D1 edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier |

## Just Tasks Reorganization

### Naming Convention

All tasks follow **noun-verb** pattern, grouped by domain:

```
# Development
dev                    # Start frontend dev server
ladle                  # Start component preview
setup-env              # Create .env from .env.example

# Quality
check                  # Run all checks (typecheck, lint, test)
typecheck              # Run TypeScript checking
lint                   # Run Biome linter
format                 # Format code with Biome
test                   # Run unit tests
e2e                    # Run E2E tests

# Build
build                  # Build for production

# Pages (frontend)
pages-deploy           # Deploy to Cloudflare Pages (production)
pages-preview          # Deploy preview (used by CI)
pages-env name value   # Set Pages environment variable

# Worker (chat API)
worker-dev             # Run worker locally
worker-deploy env      # Deploy worker (staging|production)
worker-migrate env     # Run D1 migrations (staging|production)
worker-db-create       # Create D1 database (one-time setup)
worker-secret name     # Set a worker secret

# Utilities
prototypes             # Open design prototypes in browser
```

### Migration from Current Tasks

| Current | New |
|---------|-----|
| `deploy` | `pages-deploy` |
| `deploy-worker` | `worker-deploy production` |
| `pages-env-chat-api url` | `pages-env VITE_CHAT_API_URL url` |

## Wrangler Configuration

### Environment Structure

```toml
name = "vibes-chat-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Production (default)
[vars]
ALLOWED_ORIGIN = "https://www.vibes.run"
MAX_MESSAGES_PER_SESSION = "20"
NOTIFICATION_EMAIL = "hello@vibes.run"

[[d1_databases]]
binding = "DB"
database_name = "vibes-chat"
database_id = "xxx-production-id-xxx"

# Staging environment
[env.staging]
name = "vibes-chat-api-staging"

[env.staging.vars]
ALLOWED_ORIGIN = "*"
MAX_MESSAGES_PER_SESSION = "20"
NOTIFICATION_EMAIL = ""

[[env.staging.d1_databases]]
binding = "DB"
database_name = "vibes-chat-staging"
database_id = "xxx-staging-id-xxx"
```

### Deployment Commands

- `wrangler deploy` → production
- `wrangler deploy --env staging` → staging

## Migration Strategy

### Idempotent SQL

All migrations use `IF NOT EXISTS` to be safe to run repeatedly:

```sql
CREATE TABLE IF NOT EXISTS sessions (...);
CREATE TABLE IF NOT EXISTS messages (...);
CREATE TABLE IF NOT EXISTS leads (...);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
```

### Migration Process

1. `just worker-migrate staging` — run on staging D1
2. `just worker-migrate production` — run on production D1
3. Safe to run repeatedly

### Future Schema Changes

- **Add new tables:** Use `CREATE TABLE IF NOT EXISTS`
- **Add new columns:** Use `ALTER TABLE ... ADD COLUMN`
- **Breaking changes:** Require manual migration + documented process

## Security

### API Token Permissions

Custom Cloudflare API token with:
- Account → Cloudflare Pages → Edit
- Account → Workers Scripts → Edit
- Account → D1 → Edit

### Secrets Management

| Environment | Secrets |
|-------------|---------|
| Production | `ANTHROPIC_API_KEY`, `RESEND_API_KEY` |
| Staging | `ANTHROPIC_API_KEY` only |

Staging has no `RESEND_API_KEY` — email notifications are disabled.

## Trade-offs

### Why persistent staging worker (not per-PR)?

- **Simpler:** No cleanup jobs for orphaned workers
- **Cheaper:** Single staging worker vs. many
- **Sufficient:** PR previews test frontend; staging worker tests API integration
- **Trade-off:** All PRs share staging backend state

### Why manual worker deploys?

- Worker changes are higher risk (API keys, database)
- Gives explicit control over when backend changes go live
- Pages auto-deploy is safe (static assets only)

### Why idempotent SQL vs. migration system?

- **Simpler:** No migration tracking table needed
- **Sufficient:** Works for additive schema changes
- **Trade-off:** Breaking changes need manual handling
- **Future:** Can add migration system if needed
