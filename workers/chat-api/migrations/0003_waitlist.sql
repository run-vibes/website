-- 0003_waitlist.sql
CREATE TABLE waitlist (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  referrer TEXT,
  user_agent TEXT,
  UNIQUE(email, product)
);

CREATE INDEX idx_waitlist_product ON waitlist(product);
CREATE INDEX idx_waitlist_created ON waitlist(created_at);
