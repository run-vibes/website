import { cn } from '@/lib/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const cardVariants = cva('rounded-xl border transition-all', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground border-border shadow-md',
      outlined: 'border-border bg-transparent',
      ghost: 'bg-transparent border-transparent',
      interactive:
        'bg-card text-card-foreground border-border shadow-md hover:border-accent/20 hover:shadow-glow cursor-pointer hover:-translate-y-1',
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

interface CardProps extends Omit<ComponentProps<'div'>, 'ref'>, VariantProps<typeof cardVariants> {
  asChild?: boolean
}

export function Card({
  variant,
  padding,
  className,
  children,
  asChild = false,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </Comp>
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
    <h3
      className={cn('font-heading text-xl font-bold uppercase tracking-tight', className)}
      {...props}
    >
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
