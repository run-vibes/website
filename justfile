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
    cd workers/chat-api && wrangler dev --config wrangler.toml

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
        cd workers/chat-api && wrangler d1 migrations apply vibes-chat --remote --config wrangler.toml
    elif [ "{{env}}" = "staging" ]; then
        cd workers/chat-api && wrangler d1 migrations apply vibes-chat-staging --remote --config wrangler.toml
    elif [ "{{env}}" = "local" ]; then
        cd workers/chat-api && wrangler d1 migrations apply vibes-chat --local --config wrangler.toml
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

# Set up redirect from naked domain to www subdomain
# Requires CLOUDFLARE_API_TOKEN with Zone.Settings permissions
redirect-naked-to-www:
    #!/usr/bin/env bash
    set -e

    # Domain configuration (change these if reusing for a different domain)
    DOMAIN="vibes.run"
    WWW_DOMAIN="www.${DOMAIN}"

    # Zone ID is a public identifier, not a secret (see docs/SECURITY.md)
    # Override with CLOUDFLARE_ZONE_ID env var if needed
    ZONE_ID="${CLOUDFLARE_ZONE_ID:-dc9aa7a9e10c27c1e4f35f533eed1257}"

    if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
        echo "Error: Set CLOUDFLARE_API_TOKEN environment variable"
        echo ""
        echo "Create a token at: https://dash.cloudflare.com/profile/api-tokens"
        echo "Required permissions: Zone > Zone Settings > Edit"
        echo ""
        echo "Or configure via dashboard:"
        echo "  1. Go to: https://dash.cloudflare.com/?to=/:account/${DOMAIN}/rules/redirect-rules"
        echo "  2. Click 'Create rule'"
        echo "  3. Rule name: 'Redirect naked to www'"
        echo "  4. Expression: (http.host eq \"${DOMAIN}\")"
        echo "  5. URL redirect: Dynamic"
        echo "  6. Expression: concat(\"https://${WWW_DOMAIN}\", http.request.uri.path)"
        echo "  7. Status: 301 (Permanent)"
        echo "  8. Preserve query string: checked"
        exit 1
    fi

    echo "Creating redirect rule: ${DOMAIN} → ${WWW_DOMAIN}"

    # First, check if there's an existing ruleset for redirect rules
    EXISTING=$(curl -s "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets?phase=http_request_dynamic_redirect" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json")

    if echo "$EXISTING" | jq -e '.success == false' > /dev/null 2>&1; then
        echo "Error checking existing rulesets:"
        echo "$EXISTING" | jq '.errors'
        exit 1
    fi

    RULESET_ID=$(echo "$EXISTING" | jq -r '.result[0].id // empty')

    if [ -z "$RULESET_ID" ]; then
        # Create new ruleset with the redirect rule
        echo "Creating new redirect ruleset..."
        RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{
                \"name\": \"Redirect rules\",
                \"kind\": \"zone\",
                \"phase\": \"http_request_dynamic_redirect\",
                \"rules\": [{
                    \"expression\": \"(http.host eq \\\"${DOMAIN}\\\")\",
                    \"description\": \"Redirect naked domain to www\",
                    \"action\": \"redirect\",
                    \"action_parameters\": {
                        \"from_value\": {
                            \"target_url\": {
                                \"expression\": \"concat(\\\"https://${WWW_DOMAIN}\\\", http.request.uri.path)\"
                            },
                            \"status_code\": 301,
                            \"preserve_query_string\": true
                        }
                    }
                }]
            }")
    else
        # Add rule to existing ruleset
        echo "Adding redirect rule to existing ruleset ($RULESET_ID)..."
        RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{
                \"expression\": \"(http.host eq \\\"${DOMAIN}\\\")\",
                \"description\": \"Redirect naked domain to www\",
                \"action\": \"redirect\",
                \"action_parameters\": {
                    \"from_value\": {
                        \"target_url\": {
                            \"expression\": \"concat(\\\"https://${WWW_DOMAIN}\\\", http.request.uri.path)\"
                        },
                        \"status_code\": 301,
                        \"preserve_query_string\": true
                    }
                }
            }")
    fi

    if echo "$RESULT" | jq -e '.success == true' > /dev/null 2>&1; then
        echo "✓ Redirect rule created successfully!"
        echo ""
        echo "Visitors to https://${DOMAIN} will now be redirected to https://${WWW_DOMAIN}"
    else
        echo "Error creating redirect rule:"
        echo "$RESULT" | jq '.'
        exit 1
    fi
