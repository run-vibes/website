# Vibes Marketing Website — Product Requirements Document

## Overview

**Product:** Vibes Marketing Website

**Vision:** A bold, energetic marketing website that positions Vibes as the creative studio where AI agents come to life — combining craft and artistry with measurable business transformation.

**Core Message:**
> "The studio where AI agents come to life — delivering impact you can measure"

**Brand Personality:**
- Confident but not arrogant
- Creative and craft-focused
- Results-oriented
- Energetic and forward-moving
- Expert but approachable

## Target Audiences

- **Technical leaders** — CTOs, VPs of Engineering (evaluate feasibility, architecture, integration)
- **Business executives** — CEOs, COOs, Heads of Strategy (ROI, competitive advantage, transformation)
- **Innovation/AI leads** — Chief AI Officers, Innovation Directors (AI adoption mandate)
- **Founders/Startups** — Building AI-native products or adding AI capabilities

## Primary Goals

1. Generate qualified project inquiries via conversational chat interface
2. Build an audience through newsletter subscription
3. Establish Vibes as a differentiated, premium agentic studio

---

## Site Structure & Navigation

### Primary Navigation

| Page | Purpose |
|------|---------|
| **Home** | Hero, value prop, featured work, social proof |
| **Services** | What Vibes offers (with persona-relevant framing) |
| **Industries** | Fintech, E-commerce, SaaS, Professional Services |
| **Work** | Case studies and portfolio (filterable by industry + persona) |
| **Insights** | Blog/content hub (technical + business articles) |
| **Contact** | Project inquiry form via chat interface |

### Secondary/Footer Navigation

- About / Team
- Newsletter signup
- Careers (placeholder for future)
- Legal (Privacy, Terms)

### Persona Paths

Rather than explicit "For CTOs" pages, persona targeting happens through:
- Case study tagging ("Technical Deep-Dive" vs "Business Impact")
- Content categorization in Insights
- Service page framing (same services, different emphasis by context)

### Industry Pages

Each industry page includes:
- Industry-specific challenges Vibes solves
- Relevant case studies
- Tailored service recommendations
- Industry-specific CTA

---

## Services

### 1. Agent Development
*Full-build engagements — end-to-end design and development*

> "Intelligent agents. Coordinated swarms. Real-world impact."

- End-to-end design and development of AI agents
- Single agents to multi-agent orchestration
- From concept through production deployment
- Ongoing support and iteration

### 2. AI Strategy & Consulting
*Advisory and roadmapping*

> "Navigate the AI landscape with a clear plan"

- AI readiness assessments
- Architecture reviews
- Transformation roadmaps
- Vendor/tool evaluation

### 3. Product Development
*Building AI-native products*

> "Ship AI products that users love"

- New product ideation and development
- AI feature integration into existing products
- MVP through scale

### 4. Workshops & Training
*Upskilling teams*

> "Empower your team to think in agents"

- Hands-on agent-building workshops
- Executive AI literacy sessions
- Team enablement programs

---

## Homepage

### Hero Section
- **Headline:** "The studio where AI agents come to life"
- **Subheadline:** "Delivering impact you can measure"
- Brief supporting text (1-2 sentences on what Vibes does)
- **Primary CTA:** "Let's Talk" → Opens chat interface
- **Secondary CTA:** "See Our Work" → case studies
- Dynamic visual element (abstract, energetic — not generic AI imagery)

### Social Proof Bar
- Client logos (when available)
- Or: key metrics / credibility markers

### Services Overview
- The four services as cards or columns
- Brief description + link to learn more
- Visual icons or illustrations per service

### Featured Work
- 2-3 highlighted case studies
- Industry + outcome focus
- "View All Work" link

### Industry Focus
- Quick visual grid: Fintech, E-commerce, SaaS, Professional Services
- Links to industry-specific pages

### Insights Preview
- 2-3 recent articles (mix of technical + business)
- Newsletter signup CTA

### Final CTA Section
- "Ready to bring your AI vision to life?"
- Chat CTA + newsletter as secondary

---

## Key Pages

### Work / Case Studies

**List View:**
- Filterable grid: by industry, by service, by persona lens (technical/business)
- Each card shows: client industry, challenge summary, outcome metrics

**Individual Case Study:**
- Challenge / Context
- Approach / Solution
- Results (quantified where possible)
- Tech stack / tools (for technical readers)
- "Related Work" suggestions

### Industry Pages

*Fintech, E-commerce, SaaS, Professional Services*

- Industry-specific hero with tailored messaging
- Key challenges Vibes solves in that vertical
- Relevant case studies
- Services most applicable
- Industry-specific CTA → chat/inquiry

### Insights (Blog)

- Two content tracks: Technical | Business (filterable)
- Article pages with:
  - Rich content (code blocks for technical, charts for business)
  - Author attribution
  - Related articles
  - Newsletter CTA at end
- RSS feed support

### Contact

- Embedded chat interface (same as hero CTA)
- Alternative: traditional form for those who prefer
- Email fallback

---

## Chat Interface

The primary CTA is a hybrid conversational interface that collects project inquiries.

**Behavior:**
- Starts with guided prompts (name, company, what you're looking to build)
- Handles freeform responses intelligently
- Extracts structured data (contact, project type, industry, stage)
- Submits to backend as form data
- Fallback link to traditional form for users who prefer it

**Backend:**
- Cloudflare Workers API endpoint
- Rate limiting: per-IP limits (suggested 5 requests/minute, 10-20 messages per session)
- AI provider: Anthropic Claude for conversational handling
- Storage: Cloudflare D1 for submissions
- Notifications: Email via Resend or similar

---

## Brand & Visual Direction

### Brand Identity (To Be Created)
- **Logo:** Wordmark or logomark + wordmark
- **Color palette:** Bold, energetic — vibrant primary with strong contrasts
- **Typography:** Modern, confident — bold sans-serif for headlines, clean sans for body
- **Visual system:** Abstract, dynamic shapes/patterns conveying energy and motion

### Visual Principles
- **Bold over safe** — Strong colors, confident typography, not corporate-bland
- **Motion and energy** — Subtle animations, dynamic layouts, forward movement
- **Craft and precision** — Clean execution, attention to detail
- **Human + technical** — Not cold/robotic, but not overly casual

### Imagery Approach
- Abstract visuals over stock photos
- Generative/procedural graphics that feel AI-native
- **Avoid:** generic "AI brain" imagery, robot hands, blue glowing circuits
- **Consider:** dynamic particle systems, flowing data visualizations, bold geometric shapes

### UI Components
- **Buttons:** Bold, clear hierarchy (primary/secondary/ghost)
- **Cards:** Clean with subtle depth, hover states with motion
- **Forms:** Chat-first, clean fallback form styling
- **Navigation:** Clean, possibly with animated transitions

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (static site generation) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Content | Hand-coded JSX (no CMS) |
| Hosting | Cloudflare Pages |
| Dev Environment | Nix flake |

### Nix Flake Includes
- Node.js (LTS)
- pnpm (recommended for speed)
- TypeScript
- Wrangler CLI (Cloudflare)

### Chat Backend (Cloudflare Workers)
- Rate limiting via Cloudflare Rate Limiting or Workers-based implementation
- Per-IP limits: 5 requests/minute
- Per-session limits: 10-20 messages
- AI: Anthropic Claude API
- Storage: Cloudflare D1 (SQLite at edge)
- Notifications: Resend for email

### Integrations
- **Newsletter:** Buttondown, ConvertKit, or Resend
- **Analytics:** Plausible, Fathom, or Cloudflare Analytics (privacy-friendly)

### Performance Targets
- Lighthouse score: 95+ across all metrics
- Core Web Vitals: Pass all
- First contentful paint: <1s

---

## Phased Delivery

### Phase 1 — Foundation (MVP)
- Home page (hero, services overview, CTA)
- Services page (four services detailed)
- Contact page (chat interface + fallback form)
- Basic brand identity (logo, colors, typography)
- Nix flake + project scaffolding
- Cloudflare Pages deployment pipeline

### Phase 2 — Content & Credibility
- Industry pages (4 verticals)
- Work/Case studies page + 2-3 initial case studies
- About page
- Newsletter integration

### Phase 3 — Insights & Growth
- Insights/blog section
- Content filtering (technical/business)
- RSS feed
- Enhanced analytics

### Phase 4 — Polish & Expand
- Additional industries
- Animation refinements
- Performance optimization
- A/B testing on CTAs

---

## Success Metrics

### Primary KPIs
- Project inquiries submitted per month
- Inquiry-to-call conversion rate
- Newsletter subscribers

### Secondary KPIs
- Chat engagement rate (started vs completed)
- Time on site / pages per session
- Industry page → inquiry conversion by vertical
- Insights article engagement

### Technical Health
- Lighthouse scores maintained at 95+
- Core Web Vitals passing
- Zero downtime (Cloudflare edge reliability)
