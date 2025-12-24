import { cn } from '@/lib/cn'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  loading?: boolean
  className?: string
  onFocus?: () => void
}

export function ChatInput({ onSend, loading, className, onFocus }: ChatInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !loading) {
      onSend(trimmed)
      setValue('')
      // Keep focus on input after sending
      inputRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
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
