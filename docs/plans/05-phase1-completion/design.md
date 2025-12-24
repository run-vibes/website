# Phase 1 Completion Design

## Overview

Complete the Foundation (MVP) phase of the Vibes marketing website with functional pages and a full chat-based lead capture system.

**Approach:** Finish Home, Services, and Contact pages with functional content. Implement chat backend with Claude-powered conversational lead capture that extracts enough information to generate a PRD draft.

## Decisions Summary

| Area | Choice |
|------|--------|
| Phase restructuring | Brand identity moves to Phase 2; phases shift down |
| Visual direction | daybreak-hybrid-mono (implemented in Phase 2) |
| Contact page | Chat-first with secondary fallback form |
| Chat backend | Full conversational flow with PRD extraction |
| Rate limiting | Hybrid: Cloudflare (DDoS) + D1 (session limits) |
| Email provider | Resend |
| Services page | Full detail per service (description, benefits, use cases, CTA) |

---

## 1. Phase Restructuring

| Phase | Name | Scope |
|-------|------|-------|
| **1** | **Foundation (MVP)** | Functional pages + chat backend |
| **2** | **Brand Identity** | Implement daybreak-hybrid-mono theme |
| **3** | Content & Credibility | Industry pages, case studies, about, newsletter |
| **4** | Insights & Growth | Blog, filtering, RSS, analytics |
| **5** | Polish & Expand | Animations, performance, A/B testing |

**Rationale:** Separating brand polish from functional MVP allows shipping a working product faster. Visual refinement becomes a focused phase.

---

## 2. Page Architecture

### Home Page (`/`)

Expands current scaffold:
- **Hero section** — Headline, subheadline, primary CTA ("Let's Talk" → opens chat modal or navigates to /contact), secondary CTA ("See Our Services")
- **Services overview** — Four cards summarizing each service with links to Services page sections
- **Social proof bar** — Placeholder for client logos ("Trusted by innovative teams")
- **Final CTA section** — "Ready to bring your AI vision to life?" with chat CTA

### Services Page (`/services`)

New page with four detailed sections:

1. **Agent Development**
   - End-to-end design and development of AI agents
   - Single agents to multi-agent orchestration
   - From concept through production deployment

2. **AI Strategy & Consulting**
   - AI readiness assessments
   - Architecture reviews
   - Transformation roadmaps

3. **Product Development**
   - New product ideation and development
   - AI feature integration into existing products
   - MVP through scale

4. **Workshops & Training**
   - Hands-on agent-building workshops
   - Executive AI literacy sessions
   - Team enablement programs

Each section includes: description paragraph, 3-4 key benefits, example use cases, CTA button.

### Contact Page (`/contact`)

- **Chat interface** (primary) — Full-width or centered chat component
- **Fallback form** (secondary) — Simple form in "Prefer email?" collapsed section
- **Contact info** — Email address for direct contact

---

## 3. Chat Backend Architecture

### Endpoint Structure

```
POST /chat
├── Cloudflare Rate Limiting (infrastructure layer)
│   └── 10 req/min per IP (configured in Cloudflare dashboard)
├── Session Management
│   ├── Generate session token on first message
│   └── Track message count in D1 (max 20 messages/session)
├── Claude API Integration
│   ├── System prompt: conversational PRD discovery
│   ├── Stream responses for better UX
│   └── Extract structured lead + PRD data
├── D1 Storage
│   ├── sessions: id, ip_hash, message_count, created_at
│   ├── messages: id, session_id, role, content, created_at
│   └── leads: id, session_id, contact info, prd_draft, extracted_at
└── Resend Integration
    └── Send notification with PRD draft when lead extracted
```

### D1 Schema

```sql
-- Session tracking for rate limiting
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Conversation history
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Extracted lead data
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  company TEXT,
  project_summary TEXT,
  prd_draft TEXT, -- Markdown PRD generated from conversation
  extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

### Claude System Prompt Behavior

Guides conversation to extract PRD-worthy information:
- **Problem/Opportunity** — What challenge are you facing?
- **Vision** — What does success look like?
- **Users** — Who will use this?
- **Key capabilities** — What must it do? What's nice-to-have?
- **Constraints** — Timeline, budget range, integrations?
- **Contact info** — Name, company, email

Tone: Friendly, professional, matches Vibes brand. Feels like a conversation, not a form.

---

## 4. Data Flow

```
User visits /contact
    → Chat UI initializes
    → First message creates session (token in localStorage)
    → Each message: POST /chat with session token
    → Claude responds, guiding toward PRD extraction
    → When sufficient info gathered:
        → Claude summarizes and confirms contact details
        → Lead extracted → stored in D1
        → Resend sends notification email
```

### Notification Email

- **To:** team@vibes.run (configurable via env)
- **Subject:** "New lead: {company} — {project summary}"
- **Body:**
  - Contact info (name, email, company)
  - Generated PRD draft (markdown)
  - Link to full conversation transcript

---

## 5. Implementation Approach

### Phase 1A: Pages (parallel track)

| Task | Description |
|------|-------------|
| 1 | Services page — four detailed sections |
| 2 | Contact page — chat UI + fallback form |
| 3 | Home page — expand with full content + CTAs |

### Phase 1B: Backend (parallel track)

| Task | Description |
|------|-------------|
| 4 | D1 schema — sessions, messages, leads tables |
| 5 | Session management — token generation, message counting |
| 6 | Claude integration — streaming responses, PRD extraction |
| 7 | Lead extraction — parse structured data from conversation |
| 8 | Resend integration — notification emails with PRD draft |
| 9 | Cloudflare rate limiting — configure dashboard rules |

### Phase 1C: Integration

| Task | Description |
|------|-------------|
| 10 | Connect chat UI to backend |
| 11 | End-to-end testing |

### Dependencies

- Pages (1A) and Backend core (Tasks 4-7) can run in parallel
- Task 10 requires both chat UI and backend ready
- Resend (Task 8) can be added after core flow works

### Testing Strategy

- Unit tests for lead extraction logic
- Integration tests for chat API endpoints
- E2E test for full conversation → lead → email flow

---

## Implementation Notes

- Use existing UI components (Button, Card, Input, etc.) for pages
- Chat component exists in `src/features/chat/` — extend for real backend connection
- Worker scaffold exists in `workers/chat-api/` — build on existing structure
- Streaming responses via Server-Sent Events for better UX

## Next Steps

1. Update `docs/PROGRESS.md` with new phase structure
2. Create implementation plan with detailed tasks
3. Begin parallel work on pages and backend
