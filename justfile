# Show available commands
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Start dev server
dev:
    pnpm dev

# Start Ladle component preview
ladle:
    pnpm ladle

# Run type checking
typecheck:
    pnpm typecheck

# Run linting
lint:
    pnpm lint

# Format code
format:
    pnpm format

# Run all checks (CI equivalent)
check: typecheck lint test

# Run unit tests
test:
    pnpm test

# Run E2E tests
e2e:
    pnpm e2e

# Build for production
build:
    pnpm build

# Deploy to Cloudflare Pages (production)
pages-deploy:
    pnpm deploy

# Set up local environment (copies .env.example to .env)
setup-env:
    #!/usr/bin/env bash
    if [ -f .env ]; then
        echo ".env already exists. Edit it directly or remove it first."
    else
        cp .env.example .env
        echo "Created .env from .env.example"
        echo "Edit .env to configure VITE_CHAT_API_URL"
    fi

# Set environment variable on Cloudflare Pages (usage: just pages-env VITE_CHAT_API_URL https://your-worker.workers.dev/chat)
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

# Deploy preview to Cloudflare Pages
pages-preview:
    pnpm build
    wrangler pages deploy dist --project-name=website

# Deploy chat worker
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

# Run chat worker locally
worker-dev:
    cd workers/chat-api && wrangler dev

# Create D1 database for chat worker
worker-db-create:
    wrangler d1 create vibes-chat

# Create staging D1 database (one-time setup)
worker-db-create-staging:
    wrangler d1 create vibes-chat-staging

# Run chat worker database migrations
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

# Set a chat worker secret (usage: just worker-secret ANTHROPIC_API_KEY)
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

# Open all prototypes in browser
prototypes:
    #!/usr/bin/env bash
    for dir in prototypes/*/; do
        if [ -f "${dir}index.html" ]; then
            xdg-open "${dir}index.html" 2>/dev/null || open "${dir}index.html" 2>/dev/null
        fi
    done
