import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-heading uppercase tracking-wide',
  {
    variants: {
      status: {
        available: 'bg-green-500/10 text-green-400 border border-green-500/20',
        'coming-soon': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      },
    },
    defaultVariants: {
      status: 'available',
    },
  },
)

export type ProductStatus = 'available' | 'coming-soon'

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  status: ProductStatus
  className?: string
}

const statusLabels: Record<ProductStatus, string> = {
  available: 'Available',
  'coming-soon': 'Coming Soon',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ status }), className)}>{statusLabels[status]}</span>
}
