import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

const logoVariants = cva('inline-flex items-center font-heading font-extrabold', {
  variants: {
    variant: {
      mark: '',
      full: '',
    },
    size: {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl',
    },
  },
  defaultVariants: {
    variant: 'full',
    size: 'md',
  },
})

export interface LogoProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof logoVariants> {}

export function Logo({ variant = 'full', size, className, ...props }: LogoProps) {
  return (
    <div
      className={cn(logoVariants({ variant, size }), className)}
      aria-label="Vibes logo"
      {...props}
    >
      <span className="text-accent">/V</span>
      {variant === 'full' && (
        <>
          <span className="text-accent-secondary">ibes</span>
          <span className="text-accent-secondary opacity-60">.run</span>
        </>
      )}
    </div>
  )
}
