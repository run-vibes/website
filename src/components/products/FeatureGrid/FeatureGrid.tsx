import { cn } from '@/lib/cn'
import { Heading, Text } from '@/components/ui'

export interface Feature {
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3
  className?: string
}

export function FeatureGrid({ features, columns = 2, className }: FeatureGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
        className,
      )}
    >
      {features.map((feature) => (
        <div key={feature.title} className="space-y-2">
          <Heading level={3} size="sm">
            {feature.title}
          </Heading>
          <Text variant="muted">{feature.description}</Text>
        </div>
      ))}
    </div>
  )
}
