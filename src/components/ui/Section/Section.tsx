import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const sectionVariants = cva('', {
  variants: {
    size: {
      sm: 'py-8 md:py-12',
      md: 'py-16 md:py-20',
      lg: 'py-24 md:py-32',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface SectionProps
  extends Omit<ComponentProps<'section'>, 'ref'>,
    VariantProps<typeof sectionVariants> {}

export function Section({
  size,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ size }), className)} {...props}>
      {children}
    </section>
  )
}
