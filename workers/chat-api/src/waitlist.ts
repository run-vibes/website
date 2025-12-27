import type { D1Database } from '@cloudflare/workers-types'

export interface WaitlistEntry {
  email: string
  product: string
  referrer?: string
  userAgent?: string
}

const VALID_PRODUCTS = new Set(['volt', 'vibes'])

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidProduct(product: string): boolean {
  return VALID_PRODUCTS.has(product)
}

export async function addToWaitlist(
  db: D1Database,
  entry: WaitlistEntry,
): Promise<{ success: boolean; error?: string }> {
  if (!isValidEmail(entry.email)) {
    return { success: false, error: 'Invalid email format' }
  }

  if (!isValidProduct(entry.product)) {
    return { success: false, error: 'Invalid product' }
  }

  try {
    await db
      .prepare(
        `INSERT INTO waitlist (email, product, referrer, user_agent)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (email, product) DO NOTHING`,
      )
      .bind(entry.email.toLowerCase(), entry.product, entry.referrer ?? null, entry.userAgent ?? null)
      .run()

    return { success: true }
  } catch (err) {
    console.error('Waitlist insert error:', err)
    return { success: false, error: 'Failed to join waitlist' }
  }
}
