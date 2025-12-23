import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const cardVariants = cva('rounded-lg', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground shadow-md',
      outlined: 'border border-border bg-transparent',
      ghost: 'bg-transparent',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'none',
  },
})

interface CardProps extends Omit<ComponentProps<'div'>, 'ref'>, VariantProps<typeof cardVariants> {}

export function Card({ variant, padding, className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: Omit<ComponentProps<'div'>, 'ref'>) {
  return (
    <div className={cn('p-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: Omit<ComponentProps<'h3'>, 'ref'>) {
  return (
    <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: Omit<ComponentProps<'div'>, 'ref'>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: Omit<ComponentProps<'div'>, 'ref'>) {
  return (
    <div className={cn('p-6 pt-0 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}
