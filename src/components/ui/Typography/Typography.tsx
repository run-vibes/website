import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, ElementType } from 'react'

const headingVariants = cva('font-heading font-bold tracking-tight', {
  variants: {
    size: {
      '2xl': 'text-5xl md:text-6xl',
      xl: 'text-4xl md:text-5xl',
      lg: 'text-3xl md:text-4xl',
      md: 'text-2xl md:text-3xl',
      sm: 'text-xl md:text-2xl',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
})

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps
  extends Omit<ComponentProps<'h1'>, 'ref'>,
    VariantProps<typeof headingVariants> {
  level?: HeadingLevel
}

export function Heading({ level = 1, size, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType
  return (
    <Tag className={cn(headingVariants({ size }), className)} {...props}>
      {children}
    </Tag>
  )
}

const textVariants = cva('', {
  variants: {
    size: {
      lg: 'text-lg',
      md: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-primary',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    weight: 'normal',
  },
})

type TextElement = 'p' | 'span' | 'div'

interface TextProps extends Omit<ComponentProps<'p'>, 'ref'>, VariantProps<typeof textVariants> {
  as?: TextElement
}

export function Text({
  as: Tag = 'p',
  size,
  variant,
  weight,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, variant, weight }), className)} {...props}>
      {children}
    </Tag>
  )
}
