import type { Session, Message } from './types'

export function generateSessionId(): string {
  return crypto.randomUUID()
}

export function hashIP(ip: string): string {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + 'vibes-salt')
  return Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

export async function getOrCreateSession(
  db: D1Database,
  sessionId: string | undefined,
  ipHash: string
): Promise<Session> {
  if (sessionId) {
    const existing = await db
      .prepare('SELECT * FROM sessions WHERE id = ?')
      .bind(sessionId)
      .first<Session>()

    if (existing) {
      return existing
    }
  }

  const newId = generateSessionId()
  await db
    .prepare('INSERT INTO sessions (id, ip_hash, message_count) VALUES (?, ?, 0)')
    .bind(newId, ipHash)
    .run()

  return {
    id: newId,
    ip_hash: ipHash,
    message_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function incrementMessageCount(
  db: D1Database,
  sessionId: string
): Promise<number> {
  await db
    .prepare(
      "UPDATE sessions SET message_count = message_count + 1, updated_at = datetime('now') WHERE id = ?"
    )
    .bind(sessionId)
    .run()

  const session = await db
    .prepare('SELECT message_count FROM sessions WHERE id = ?')
    .bind(sessionId)
    .first<{ message_count: number }>()

  return session?.message_count ?? 0
}

export async function saveMessage(
  db: D1Database,
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<void> {
  await db
    .prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)')
    .bind(sessionId, role, content)
    .run()
}

export async function getConversationHistory(
  db: D1Database,
  sessionId: string
): Promise<Message[]> {
  const result = await db
    .prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC')
    .bind(sessionId)
    .all<Message>()

  return result.results ?? []
}

export async function checkRateLimit(
  db: D1Database,
  sessionId: string,
  maxMessages: number
): Promise<{ allowed: boolean; remaining: number }> {
  const session = await db
    .prepare('SELECT message_count FROM sessions WHERE id = ?')
    .bind(sessionId)
    .first<{ message_count: number }>()

  const count = session?.message_count ?? 0
  return {
    allowed: count < maxMessages,
    remaining: Math.max(0, maxMessages - count),
  }
}
