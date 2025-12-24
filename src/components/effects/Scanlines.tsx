import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface ScanlinesProps extends Omit<ComponentProps<'div'>, 'children'> {}

export function Scanlines({ className, ...props }: ScanlinesProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[3]', className)}
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.12) 2px,
          rgba(0, 0, 0, 0.12) 4px
        )`,
        opacity: 'var(--effect-scanlines-opacity)',
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
