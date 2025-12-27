import { Text } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Link } from '@tanstack/react-router'

interface BuiltByVibesProps {
  className?: string
}

export function BuiltByVibes({ className }: BuiltByVibesProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-muted/30 p-6 text-center', className)}>
      <Text variant="muted">
        Built by <span className="font-semibold text-foreground">Vibes</span>, the agentic
        consulting studio.{' '}
        <Link
          to="/contact"
          className="text-accent hover:text-accent/80 transition-colors font-medium"
        >
          Let's talk →
        </Link>
      </Text>
    </div>
  )
}
