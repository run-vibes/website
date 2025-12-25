import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface AnswerCardProps extends Omit<ComponentProps<'button'>, 'onSelect'> {
  /** Letter prefix like "A", "B", "C" */
  prefix: string
  label: string
  value: string
  selected?: boolean
  onSelect: (value: string) => void
}

export function AnswerCard({
  prefix,
  label,
  value,
  selected = false,
  disabled = false,
  onSelect,
  className,
  ...props
}: AnswerCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left w-full',
        'hover:bg-accent/5',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        selected ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold',
          selected ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {prefix}
      </span>
      <span className="text-sm">{label}</span>
    </button>
  )
}
