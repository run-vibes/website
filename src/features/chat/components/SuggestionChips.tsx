import { cn } from '@/lib/cn'
import type { QuestionOption } from '../config/questions'

interface SuggestionChipsProps {
  options: QuestionOption[]
  onSelect: (value: string, label: string) => void
  className?: string
}

export function SuggestionChips({ options, onSelect, className }: SuggestionChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value, option.label)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            'bg-background hover:bg-accent/10 hover:border-accent/50',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
