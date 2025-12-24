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

# Deploy to Cloudflare Pages
deploy:
    pnpm deploy

# Deploy chat worker
deploy-worker:
    cd workers/chat-api && wrangler deploy

# Open all prototypes in browser
prototypes:
    #!/usr/bin/env bash
    for dir in prototypes/*/; do
        if [ -f "${dir}index.html" ]; then
            xdg-open "${dir}index.html" 2>/dev/null || open "${dir}index.html" 2>/dev/null
        fi
    done
