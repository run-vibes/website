import { cn } from '@/lib/cn'

interface ResponseStarterProps {
  starters: string[]
  onSelect: (starter: string) => void
  className?: string
}

export function ResponseStarter({ starters, onSelect, className }: ResponseStarterProps) {
  if (starters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {starters.map((starter) => (
        <button
          key={starter}
          type="button"
          onClick={() => onSelect(starter)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full',
            'bg-muted hover:bg-muted/80 text-muted-foreground',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
          )}
        >
          {starter}
        </button>
      ))}
    </div>
  )
}
