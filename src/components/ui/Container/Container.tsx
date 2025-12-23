import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const containerVariants = cva('mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

interface ContainerProps
  extends Omit<ComponentProps<'div'>, 'ref'>,
    VariantProps<typeof containerVariants> {}

export function Container({
  size,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size }), className)} {...props}>
      {children}
    </div>
  )
}
