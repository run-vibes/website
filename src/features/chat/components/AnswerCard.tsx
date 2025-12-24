import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface AnswerCardProps extends Omit<ComponentProps<'button'>, 'onSelect'> {
  icon: string
  label: string
  value: string
  selected?: boolean
  onSelect: (value: string) => void
}

export function AnswerCard({
  icon,
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
        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
        'hover:shadow-md hover:-translate-y-0.5',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        selected
          ? 'border-accent bg-accent/10 shadow-md'
          : 'border-border bg-card hover:border-accent/50',
        disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none',
        className,
      )}
      {...props}
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  )
}
