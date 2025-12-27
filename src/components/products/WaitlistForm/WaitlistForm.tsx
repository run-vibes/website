import { Button, Input, Text } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useState } from 'react'

interface WaitlistFormProps {
  product: string
  className?: string
}

export function WaitlistForm({ product, className }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const apiUrl = import.meta.env.VITE_CHAT_API_URL || ''
      const response = await fetch(`${apiUrl}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('text-center', className)}>
        <Text className="text-green-400">
          You're on the list! We'll notify you when {product === 'volt' ? 'Volt' : 'Vibes'}{' '}
          launches.
        </Text>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-3 max-w-md mx-auto', className)}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="flex-1"
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining...' : 'Get Early Access'}
      </Button>
      {status === 'error' && (
        <Text variant="muted" className="text-red-400 text-sm mt-2">
          {errorMessage}
        </Text>
      )}
    </form>
  )
}
