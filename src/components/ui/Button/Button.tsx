import { cn } from '@/lib/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100',
        ghost: 'text-neutral-900 hover:bg-neutral-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
