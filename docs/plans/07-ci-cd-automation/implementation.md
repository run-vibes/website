# CI/CD Automation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automate Cloudflare deployments via CI with staging environment for safe PR previews.

**Architecture:** Pages auto-deploys (preview on PR, production on merge). Workers deploy manually via workflow_dispatch. Staging worker is persistent, shared by all PR previews.

**Tech Stack:** GitHub Actions, Cloudflare Pages/Workers/D1, Wrangler CLI, Just task runner

---

## Phase 1: Reorganize Just Tasks

### Task 1.1: Rename deploy to pages-deploy

**Files:**
- Modify: `justfile:44-46`

**Step 1: Update the task name**

Change:
```just
# Deploy to Cloudflare Pages
deploy:
    pnpm deploy
```

To:
```just
# Deploy to Cloudflare Pages (production)
pages-deploy:
    pnpm deploy
```

**Step 2: Verify task appears in list**

Run: `just --list | grep pages`
Expected: Shows `pages-deploy`

**Step 3: Commit**

```bash
git add justfile
git commit -m "refactor: rename deploy to pages-deploy"
```

---

### Task 1.2: Rename deploy-worker to worker-deploy with env parameter

**Files:**
- Modify: `justfile:80-82`

**Step 1: Update the task**

Change:
```just
# Deploy chat worker
deploy-worker:
    cd workers/chat-api && wrangler deploy
```

To:
```just
# Deploy chat worker (usage: just worker-deploy staging|production)
worker-deploy env:
    #!/usr/bin/env bash
    if [ "{{env}}" = "production" ]; then
        cd workers/chat-api && wrangler deploy
    elif [ "{{env}}" = "staging" ]; then
        cd workers/chat-api && wrangler deploy --env staging
    else
        echo "Error: env must be 'staging' or 'production'"
        exit 1
    fi
```

**Step 2: Verify task works**

Run: `just --list | grep worker-deploy`
Expected: Shows `worker-deploy env`

**Step 3: Commit**

```bash
git add justfile
git commit -m "refactor: rename deploy-worker to worker-deploy with env param"
```

---

### Task 1.3: Update worker-migrate to accept env parameter

**Files:**
- Modify: `justfile:93-95` and `justfile:97-99`

**Step 1: Consolidate the two tasks**

Replace both `worker-db-migrate` and `worker-db-migrate-local` with:

```just
# Run chat worker database migrations (usage: just worker-migrate staging|production|local)
worker-migrate env:
    #!/usr/bin/env bash
    if [ "{{env}}" = "production" ]; then
        cd workers/chat-api && wrangler d1 execute vibes-chat --file=./schema.sql
    elif [ "{{env}}" = "staging" ]; then
        cd workers/chat-api && wrangler d1 execute vibes-chat-staging --file=./schema.sql
    elif [ "{{env}}" = "local" ]; then
        cd workers/chat-api && wrangler d1 execute vibes-chat --local --file=./schema.sql
    else
        echo "Error: env must be 'staging', 'production', or 'local'"
        exit 1
    fi
```

**Step 2: Verify task works**

Run: `just --list | grep worker-migrate`
Expected: Shows `worker-migrate env`

**Step 3: Commit**

```bash
git add justfile
git commit -m "refactor: consolidate worker-db-migrate tasks into worker-migrate"
```

---

### Task 1.4: Generalize pages-env-chat-api to pages-env

**Files:**
- Modify: `justfile:59-78`

**Step 1: Update the task**

Change:
```just
# Set VITE_CHAT_API_URL on Cloudflare Pages (usage: just pages-env-chat-api https://your-worker.workers.dev/chat)
pages-env-chat-api url:
```

To:
```just
# Set Pages environment variable (usage: just pages-env VITE_CHAT_API_URL https://...)
pages-env name value:
    #!/usr/bin/env bash
    if [ -z "$CLOUDFLARE_ACCOUNT_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
        echo "Error: Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables"
        echo "Get these from: https://dash.cloudflare.com/profile/api-tokens"
        exit 1
    fi
    curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/website" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "deployment_configs": {
                "production": {
                    "env_vars": {
                        "{{name}}": {"value": "{{value}}"}
                    }
                }
            }
        }' | jq .
```

**Step 2: Verify task appears**

Run: `just --list | grep pages-env`
Expected: Shows `pages-env name value`

**Step 3: Commit**

```bash
git add justfile
git commit -m "refactor: generalize pages-env-chat-api to pages-env"
```

---

### Task 1.5: Add pages-preview task for CI

**Files:**
- Modify: `justfile` (add after pages-deploy)

**Step 1: Add the new task**

```just
# Deploy Pages preview (used by CI for PRs)
pages-preview:
    pnpm build
    wrangler pages deploy dist --project-name=website
```

**Step 2: Verify task appears**

Run: `just --list | grep pages-preview`
Expected: Shows `pages-preview`

**Step 3: Commit**

```bash
git add justfile
git commit -m "feat: add pages-preview task for CI"
```

---

### Task 1.6: Fix worker-secret to run in correct directory

**Files:**
- Modify: `justfile:100-102`

**Step 1: Update the task**

Change:
```just
# Set a chat worker secret (usage: just worker-secret ANTHROPIC_API_KEY)
worker-secret name:
    wrangler secret put {{name}}
```

To:
```just
# Set a chat worker secret (usage: just worker-secret ANTHROPIC_API_KEY [staging])
worker-secret name env="production":
    #!/usr/bin/env bash
    if [ "{{env}}" = "production" ]; then
        cd workers/chat-api && wrangler secret put {{name}}
    elif [ "{{env}}" = "staging" ]; then
        cd workers/chat-api && wrangler secret put {{name}} --env staging
    else
        echo "Error: env must be 'staging' or 'production'"
        exit 1
    fi
```

**Step 2: Verify task works**

Run: `just --list | grep worker-secret`
Expected: Shows `worker-secret name env="production"`

**Step 3: Commit**

```bash
git add justfile
git commit -m "fix: worker-secret runs in correct directory with env support"
```

---

## Phase 2: Configure Wrangler for Staging

### Task 2.1: Add staging environment to wrangler.toml

**Files:**
- Modify: `workers/chat-api/wrangler.toml`

**Step 1: Update the configuration**

Replace entire file with:

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
database_id = "placeholder" # Replace after running: wrangler d1 create vibes-chat

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
database_id = "placeholder" # Replace after running: wrangler d1 create vibes-chat-staging
```

**Step 2: Verify config is valid**

Run: `cd workers/chat-api && wrangler deploy --dry-run`
Expected: No syntax errors

**Step 3: Commit**

```bash
git add workers/chat-api/wrangler.toml
git commit -m "feat: add staging environment to wrangler config"
```

---

### Task 2.2: Add worker-db-create-staging task

**Files:**
- Modify: `justfile` (add after worker-db-create)

**Step 1: Add the new task**

```just
# Create staging D1 database (one-time setup)
worker-db-create-staging:
    wrangler d1 create vibes-chat-staging
```

**Step 2: Commit**

```bash
git add justfile
git commit -m "feat: add worker-db-create-staging task"
```

---

## Phase 3: Update CI Workflows

### Task 3.1: Add Pages deployment to CI workflow

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Add deployment jobs**

Add these jobs after the existing `e2e` job:

```yaml
  # Deploy Pages preview for PRs
  pages-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: e2e
    if: github.event_name == 'pull_request'
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build with staging API URL
        run: pnpm build
        env:
          VITE_CHAT_API_URL: https://vibes-chat-api-staging.run-vibes.workers.dev/chat

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=website

  # Deploy Pages production on merge to main
  pages-deploy:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: e2e
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          VITE_CHAT_API_URL: https://vibes-chat-api.run-vibes.workers.dev/chat

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=website --branch=main
```

**Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`
Expected: No errors

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat: add Pages deployment jobs to CI"
```

---

### Task 3.2: Create worker deploy workflow

**Files:**
- Create: `.github/workflows/deploy-worker.yml`

**Step 1: Create the workflow file**

```yaml
name: Deploy Worker

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    name: Deploy Worker (${{ inputs.environment }})
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: workers/chat-api
          command: deploy ${{ inputs.environment == 'staging' && '--env staging' || '' }}

      - name: Run Migrations
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: workers/chat-api
          command: d1 execute ${{ inputs.environment == 'staging' && 'vibes-chat-staging' || 'vibes-chat' }} --file=./schema.sql
```

**Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-worker.yml'))"`
Expected: No errors

**Step 3: Commit**

```bash
git add .github/workflows/deploy-worker.yml
git commit -m "feat: add manual worker deploy workflow"
```

---

## Phase 4: Update Documentation

### Task 4.1: Update README.md with deployment section

**Files:**
- Modify: `README.md`

**Step 1: Add Deployment section after Development section**

Add this section:

```markdown
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
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add deployment section to README"
```

---

### Task 4.2: Update CLAUDE.md with new just tasks

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update the just tasks section**

Replace the "Using Just" section with the updated task list matching the README.

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with reorganized just tasks"
```

---

### Task 4.3: Document idempotent migration convention

**Files:**
- Modify: `docs/PLAN.md`

**Step 1: Add migrations section**

Add this section:

```markdown
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
```

**Step 2: Commit**

```bash
git add docs/PLAN.md
git commit -m "docs: add idempotent migration convention"
```

---

### Task 4.4: Update PROGRESS.md

**Files:**
- Modify: `docs/PROGRESS.md`

**Step 1: Add Phase 2.5 for CI/CD Automation**

Add a new section for CI/CD automation milestone.

**Step 2: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: add CI/CD automation milestone to PROGRESS.md"
```

---

## Phase 5: Verification

### Task 5.1: Verify all just tasks work

**Step 1: Run just --list**

Run: `just --list`
Expected: All new tasks appear with correct descriptions

**Step 2: Test dry-run commands**

Run:
```bash
just worker-deploy staging --dry-run 2>&1 || echo "Expected: shows wrangler command"
```

---

### Task 5.2: Test CI workflow locally (optional)

**Step 1: Install act (GitHub Actions local runner)**

```bash
# macOS
brew install act

# Linux
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

**Step 2: Test the workflow**

Run: `act -n` (dry run)
Expected: Shows workflow would execute

---

### Task 5.3: Push and verify CI

**Step 1: Push branch**

```bash
git push origin HEAD
```

**Step 2: Open PR and verify**

- Check that CI runs successfully
- Verify Pages preview deploys
- Check the preview URL works

---

## Summary

After completing all tasks:

1. Just tasks reorganized to noun-verb pattern
2. Wrangler configured with staging environment
3. CI auto-deploys Pages (preview on PR, production on merge)
4. Manual workflow for worker deployments
5. Documentation updated (README, CLAUDE.md, PLAN.md, PROGRESS.md)
