import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface GeometricGridProps extends Omit<ComponentProps<'div'>, 'children'> {}

export function GeometricGrid({ className, ...props }: GeometricGridProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[1]', className)}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, var(--effect-grid-opacity)) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, var(--effect-grid-opacity)) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
