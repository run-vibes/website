import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const chatBubbleVariants = cva('max-w-[80%] rounded-2xl px-4 py-2', {
  variants: {
    role: {
      user: 'bg-primary text-primary-foreground ml-auto rounded-br-sm',
      assistant: 'bg-muted text-muted-foreground mr-auto rounded-bl-sm',
    },
  },
  defaultVariants: {
    role: 'user',
  },
})

interface ChatBubbleProps
  extends Omit<ComponentProps<'div'>, 'ref'>,
    VariantProps<typeof chatBubbleVariants> {}

export function ChatBubble({
  role,
  className,
  children,
  ...props
}: ChatBubbleProps) {
  return (
    <div className={cn(chatBubbleVariants({ role }), className)} {...props}>
      {children}
    </div>
  )
}
