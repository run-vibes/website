-- Sessions for rate limiting and conversation tracking
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  message_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Conversation messages
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Extracted lead data
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  company TEXT,
  project_summary TEXT,
  problem TEXT,
  vision TEXT,
  users TEXT,
  capabilities TEXT,
  constraints TEXT,
  prd_draft TEXT,
  -- Structured interview answers
  intent TEXT,
  role TEXT,
  ai_maturity TEXT,
  working_style TEXT,
  timeline TEXT,
  company_size TEXT,
  industry TEXT,
  budget_range TEXT,
  lead_score INTEGER,
  lead_tier TEXT,
  interview_answers TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_ip_hash ON sessions(ip_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_lead_tier ON leads(lead_tier);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
