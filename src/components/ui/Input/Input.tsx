import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const inputVariants = cva(
  'flex w-full rounded-lg bg-muted px-4 py-2 font-mono text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
  {
    variants: {
      variant: {
        default: 'border-2 border-border focus-visible:border-accent',
        error: 'border-2 border-destructive focus-visible:ring-destructive',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  },
)

interface InputProps
  extends Omit<ComponentProps<'input'>, 'ref' | 'size'>,
    VariantProps<typeof inputVariants> {}

export function Input({ variant, inputSize, className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, inputSize }), className)}
      {...props}
    />
  )
}
