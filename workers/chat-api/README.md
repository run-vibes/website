# Vibes Chat API Worker

Cloudflare Worker for the Vibes website chat interface.

## Setup

### 1. Create D1 Database

```bash
wrangler d1 create vibes-chat
```

Copy the database_id from the output and update `wrangler.toml`.

### 2. Run Migrations

```bash
wrangler d1 execute vibes-chat --file=./schema.sql
```

### 3. Set Secrets

```bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put RESEND_API_KEY
```

### 4. Configure Cloudflare Rate Limiting

In the Cloudflare dashboard:

1. Go to Security → WAF → Rate limiting rules
2. Create a new rule:
   - **Rule name:** Chat API Rate Limit
   - **If incoming requests match:** URI Path equals `/chat`
   - **Rate limit:** 10 requests per minute
   - **Action:** Block
   - **Duration:** 1 minute

This provides infrastructure-level protection against abuse. Session-based limits are handled in the worker code.

### 5. Deploy

```bash
wrangler deploy
```

## Local Development

```bash
# Create a local D1 database
wrangler d1 execute vibes-chat --local --file=./schema.sql

# Run the worker locally
wrangler dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ALLOWED_ORIGIN` | CORS origin (e.g., `https://www.vibes.run`) |
| `MAX_MESSAGES_PER_SESSION` | Max messages per chat session (default: 20) |
| `NOTIFICATION_EMAIL` | Email address for lead notifications |
| `ANTHROPIC_API_KEY` | Anthropic API key (secret) |
| `RESEND_API_KEY` | Resend API key (secret) |
