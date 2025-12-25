import { cn } from '@/lib/cn'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  loading?: boolean
  className?: string
  onFocus?: () => void
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function ChatInput({
  onSend,
  loading,
  className,
  onFocus,
  value: controlledValue,
  onChange: controlledOnChange,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const wasLoading = useRef(false)

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue ?? internalValue
  const setValue = controlledOnChange ?? setInternalValue

  // Refocus input when loading finishes
  useEffect(() => {
    if (wasLoading.current && !loading) {
      inputRef.current?.focus()
    }
    wasLoading.current = loading ?? false
  }, [loading])

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
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={loading}
        className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
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
