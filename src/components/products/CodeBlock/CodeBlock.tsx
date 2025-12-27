import { cn } from '@/lib/cn'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  className?: string
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in non-HTTPS contexts or without permissions
      console.error('Failed to copy to clipboard')
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-lg bg-muted/50 border border-border px-4 py-3 font-mono text-sm',
        className,
      )}
    >
      <code className="flex-1 text-foreground">{code}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
