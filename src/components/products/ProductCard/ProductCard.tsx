import { cn } from '@/lib/cn'
import { Card, CardContent, Heading, Text } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { StatusBadge, type ProductStatus } from '../StatusBadge'

interface ProductCardProps {
  name: string
  tagline: string
  status: ProductStatus
  features: string[]
  href: string
  image?: string
  className?: string
}

export function ProductCard({
  name,
  tagline,
  status,
  features,
  href,
  image,
  className,
}: ProductCardProps) {
  return (
    <Card variant="interactive" className={cn('overflow-hidden', className)}>
      {image && (
        <div className="aspect-video bg-muted/50 border-b border-border">
          <img src={image} alt={`${name} screenshot`} className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
        </div>
        <div>
          <Heading level={3} size="lg" className="mb-1">
            {name}
          </Heading>
          <Text variant="muted">{tagline}</Text>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <Text size="sm">{feature}</Text>
            </li>
          ))}
        </ul>
        <Link
          to={href}
          className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors"
        >
          Learn More →
        </Link>
      </CardContent>
    </Card>
  )
}
