import { cn } from '@/lib/cn'
import type { QuestionOption } from '../config/questions'

interface SuggestionChipsProps {
  options: QuestionOption[]
  onSelect: (value: string, label: string) => void
  className?: string
}

export function SuggestionChips({ options, onSelect, className }: SuggestionChipsProps) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide',
        // Wrap on desktop, scroll on mobile
        'sm:flex-wrap',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value, option.label)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors whitespace-nowrap shrink-0',
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
