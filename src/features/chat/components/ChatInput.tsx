import { cn } from '@/lib/cn'
import { useState } from 'react'
import type { FormEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  loading?: boolean
  className?: string
}

export function ChatInput({ onSend, loading, className }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !loading) {
      onSend(trimmed)
      setValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        disabled={loading}
        className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
