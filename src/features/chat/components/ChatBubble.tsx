import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const chatBubbleVariants = cva('max-w-[80%] rounded-2xl px-4 py-2', {
  variants: {
    sender: {
      user: 'bg-primary text-primary-foreground ml-auto rounded-br-sm',
      assistant: 'bg-muted text-muted-foreground mr-auto rounded-bl-sm',
    },
  },
  defaultVariants: {
    sender: 'user',
  },
})

interface ChatBubbleProps
  extends Omit<ComponentProps<'div'>, 'ref'>,
    VariantProps<typeof chatBubbleVariants> {}

export function ChatBubble({
  sender,
  className,
  children,
  ...props
}: ChatBubbleProps) {
  return (
    <div className={cn(chatBubbleVariants({ sender }), className)} {...props}>
      {children}
    </div>
  )
}
