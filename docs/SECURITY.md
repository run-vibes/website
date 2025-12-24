# Security Guidelines

This document outlines security practices for the Vibes website and infrastructure.

## Secret Classification

### Actual Secrets (Never Commit)

These provide access to resources and must NEVER be in git:

| Secret | Purpose | Storage |
|--------|---------|---------|
| `ANTHROPIC_API_KEY` | Claude API access | Cloudflare Worker secret |
| `RESEND_API_KEY` | Email sending | Cloudflare Worker secret |
| `CLOUDFLARE_API_TOKEN` | Wrangler deployments | GitHub Actions secret |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier | GitHub Actions secret |

### Non-Secrets (Safe to Commit)

These are identifiers, not credentials:

| Identifier | Purpose | Why Safe |
|------------|---------|----------|
| D1 Database IDs | Database binding | Requires authentication to access |
| Worker names | Deployment target | Public information |
| Pages project names | Deployment target | Public information |

## File Patterns

### Always in `.gitignore`

```gitignore
# Environment files with secrets
.env
.env.local
.env.*.local
.dev.vars

# Cloudflare local state
.wrangler/
```

### Safe to Commit

```
wrangler.toml        # Worker config with D1 IDs
wrangler.jsonc       # Website worker config
.env.example         # Template without values
```

## Secret Management

### Worker Secrets (Cloudflare)

Set secrets using wrangler (interactive, never in CLI args):

```bash
cd workers/chat-api
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put RESEND_API_KEY
```

List configured secrets:

```bash
npx wrangler secret list
```

### CI/CD Secrets (GitHub)

Configure in GitHub repository settings:
- `CLOUDFLARE_API_TOKEN` - From Cloudflare dashboard
- `CLOUDFLARE_ACCOUNT_ID` - From dashboard URL or `wrangler whoami`

**Required scopes for API token:**
- Workers Scripts: Edit
- Pages: Edit
- D1: Edit (if using D1 in CI)

### Local Development

Create `.dev.vars` for local secrets (gitignored):

```bash
# .dev.vars (never commit)
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
```

## Security Checklist

### Before Committing

- [ ] No API keys/tokens in code
- [ ] No secrets in commit messages
- [ ] `.env` files not staged
- [ ] `.dev.vars` not staged

### Before Deploying

- [ ] Worker secrets configured via `wrangler secret put`
- [ ] GitHub Actions secrets configured
- [ ] D1 database schema applied

### Periodic Review

- [ ] Rotate API keys quarterly
- [ ] Audit GitHub Actions secrets
- [ ] Review worker secret list
- [ ] Check for accidental commits with `git log -p -S "api_key\|secret\|password" --pickaxe-regex`

## Incident Response

### If Secrets Are Committed

1. **Rotate immediately** - Generate new keys before removing from git
2. **Remove from history** - Use git-filter-repo (not git rebase)
3. **Force push all branches** - Disable branch protection temporarily
4. **Notify affected parties** - If customer data could be exposed

```bash
# Install git-filter-repo
nix-shell -p git-filter-repo

# Create backup
git branch backup-before-rewrite

# Create replacements file
echo "OLD_SECRET==>REDACTED" > /tmp/replacements.txt

# Rewrite history
git filter-repo --replace-text /tmp/replacements.txt --force

# Restore remote and force push
git remote add origin git@github.com:run-vibes/website.git
git push origin --force --all
```

### Common Mistakes

| Mistake | Prevention |
|---------|------------|
| Committing `.env` | Add to `.gitignore` before creating |
| Secrets in CI logs | Use `${{ secrets.* }}` not echo |
| D1 IDs as secrets | They're not secrets - keep in config |
| Placeholder IDs in prod | Verify after git-filter-repo |

## Architecture Security

### CORS Configuration

Production worker restricts origins:

```toml
[vars]
ALLOWED_ORIGIN = "https://www.vibes.run"
```

Staging allows any origin for testing:

```toml
[env.staging.vars]
ALLOWED_ORIGIN = "*"
```

### Rate Limiting

Chat sessions limited to 20 messages via `MAX_MESSAGES_PER_SESSION`.

### Data Privacy

- IP addresses hashed before storage
- Conversation data stored in D1 (Cloudflare-managed)
- Lead data extracted only with user consent
