import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    },
    gap: {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
})

interface GridProps extends Omit<ComponentProps<'div'>, 'ref'>, VariantProps<typeof gridVariants> {}

export function Grid({ cols, gap, className, children, ...props }: GridProps) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props}>
      {children}
    </div>
  )
}
