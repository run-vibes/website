# Products Pages Design

## Overview

Add product showcase pages to the Vibes website, serving dual purposes:
1. **Product marketing** — Treat Vibes and Volt as standalone products
2. **Lead generation** — Demonstrate Vibes studio's product development capabilities

## Information Architecture

### URL Structure

```
/products          → Index page (both products)
/products/vibes    → Full Vibes product page
/products/volt     → Volt teaser page
```

### Navigation

Add "Products" to main navbar between "Services" and "Contact".

### Status Model

```typescript
type ProductStatus = 'available' | 'coming-soon'
```

Drives badge styling, CTA text, and whether install commands appear.

---

## Products Index Page (`/products`)

### Hero Section

- **Headline:** "What We're Building"
- **Subhead:** "Open source tools and platforms from the Vibes studio."

### Product Cards

2-column grid on desktop, stacked on mobile. Each card includes:

- Screenshot thumbnail (16:9 ratio)
- Status badge ("Available" / "Coming Soon")
- Product name (large heading)
- One-liner tagline
- 3 feature bullets
- "Learn More →" CTA

#### Vibes Card

```
[Screenshot: terminal with vibes claude command]
[Available badge]

Vibes
Remote control for your Claude Code sessions

• Control sessions from any device
• Native Rust plugin system
• Real-time session mirroring

[Learn More →]
```

#### Volt Card

```
[Screenshot: blurred/cropped prototype dashboard]
[Coming Soon badge]

Volt
Volatility analysis & trade execution

• IV surfaces and Greeks analytics
• 11 options strategies built-in
• Backtest with synthetic or real data

[Learn More →]
```

---

## Vibes Product Page (`/products/vibes`)

### Hero Section

- **Headline:** "Vibes"
- **Tagline:** "Remote control for your Claude Code sessions"
- **Description:** 1-2 sentences expanding on value prop
- **Primary CTA:** Copyable install command
  ```bash
  curl -sSf https://vibes.run/install | sh
  ```
- **Secondary CTA:** "Star on GitHub" with star count badge
- **Visual:** Terminal screenshot or animated demo

### Features Grid (2x2)

| Feature | Description |
|---------|-------------|
| Remote Access | Control sessions from your phone, tablet, or any device via web UI |
| Session Mirroring | Real-time sync between terminal and remote devices |
| Plugin System | Extend with native Rust plugins for custom workflows |
| Cross-Platform | Single binary for Linux, macOS, and Windows |

### How It Works Section

3-step visual flow:
1. Install vibes CLI
2. Run `vibes claude "your prompt"`
3. Access from any device at `localhost:7432`

### Architecture Diagram

Clean SVG recreation of the ASCII architecture from README.

### Built by Vibes Callout

Subtle banner: "Vibes is built by Vibes, the agentic consulting studio. Need custom AI tooling? [Let's talk →]"

---

## Volt Teaser Page (`/products/volt`)

### Atmospheric Background

- Blurred, cropped screenshot of prototype dashboard
- Dark overlay gradient for text legibility
- Subtle animated grain or glow effect (matches site aesthetic)

### Hero Section (centered, minimal)

- **Status badge:** "Coming Soon"
- **Headline:** "Volt"
- **Tagline:** "Volatility analysis, simulation & trade execution"
- **Description:** "A comprehensive platform for traders who want to analyze options volatility, backtest strategies, and execute with confidence."
- No feature list — maintain mystery

### Email Capture Form

```
[Email input: "Enter your email"]
[Button: "Get Early Access"]
```

- Success state: "You're on the list. We'll notify you when Volt launches."
- Stores to D1 `waitlist` table with `product: 'volt'`

### Screenshot Gallery

Below the fold, 2-3 static screenshots from HTML prototypes:
- "IV Surface Visualization"
- "Strategy Builder"
- "Backtest Results"

Styled as floating cards with subtle shadows.

### Built by Vibes Callout

Same treatment as Vibes page.

---

## Technical Implementation

### New Routes

```
src/routes/products/index.tsx      → Products index
src/routes/products/vibes.tsx      → Vibes product page
src/routes/products/volt.tsx       → Volt teaser page
```

### New Components

```
src/components/products/ProductCard.tsx      → Card for index page
src/components/products/StatusBadge.tsx      → "Available" / "Coming Soon"
src/components/products/FeatureGrid.tsx      → 2x2 or 3-col feature display
src/components/products/WaitlistForm.tsx     → Email capture for Volt
src/components/products/CodeBlock.tsx        → Copyable install command
src/components/products/BuiltByVibes.tsx     → Lead-gen callout banner
```

### Backend: Waitlist API

**New endpoint:** `POST /api/waitlist`

```typescript
// Request
{ email: string, product: string }

// Response
{ success: true } | { error: string }
```

**Validation:**
- Email format validation
- Product must be in allowed list (`volt`, `vibes`)
- Rate limiting (reuse existing session-based approach)

### Database: Waitlist Table

```sql
-- 0003_waitlist.sql
CREATE TABLE waitlist (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  product TEXT NOT NULL,  -- 'volt' | 'vibes' | future products
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Optional context
  referrer TEXT,          -- Where they came from
  user_agent TEXT,        -- Browser info

  UNIQUE(email, product)  -- Prevent duplicate signups per product
);

CREATE INDEX idx_waitlist_product ON waitlist(product);
CREATE INDEX idx_waitlist_created ON waitlist(created_at);
```

---

## Assets Required

### Vibes

- Terminal screenshot showing `vibes claude` command
- Architecture diagram (SVG, recreated from ASCII)
- OG image for social sharing

### Volt

- 2-3 prototype screenshots (from HTML prototypes)
- Blurred hero background image
- OG image for social sharing

---

## Lead Generation Tie-in

Both product pages include a "Built by Vibes" callout:

> "Vibes is built by Vibes, the agentic consulting studio. Need custom AI tooling? Let's talk →"

Links to `/contact` to drive leads.
