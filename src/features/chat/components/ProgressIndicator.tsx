import { cn } from '@/lib/cn'

interface ProgressIndicatorProps {
  current: number
  total: number
  showLabel?: boolean
  className?: string
}

// Pre-generate stable dot configs to avoid array index key issues
function generateDotConfigs(total: number, current: number) {
  return Array.from({ length: total }, (_, i) => ({
    id: `progress-dot-${i}`,
    index: i,
    state: i < current ? 'completed' : i === current ? 'current' : 'upcoming',
  }))
}

export function ProgressIndicator({
  current,
  total,
  showLabel = false,
  className,
}: ProgressIndicatorProps) {
  const dots = generateDotConfigs(total, current)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <ol className="flex items-center gap-2" aria-label="Interview progress">
        {dots.map((dot) => (
          <li
            key={dot.id}
            data-state={dot.state}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              dot.state === 'completed' && 'bg-accent',
              dot.state === 'current' && 'bg-accent w-3 h-3',
              dot.state === 'upcoming' && 'bg-muted',
            )}
            aria-label={`Question ${dot.index + 1}: ${dot.state}`}
          />
        ))}
      </ol>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          Question {current + 1} of {total}
        </span>
      )}
    </div>
  )
}
