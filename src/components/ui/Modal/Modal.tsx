import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const modalContentVariants = cva(
  'relative bg-background rounded-lg shadow-xl p-6 w-full',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        full: 'max-w-4xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface ModalProps extends VariantProps<typeof modalContentVariants> {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  size,
  children,
  className,
}: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        data-testid="modal-overlay"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />
      <div
        data-testid="modal-content"
        className={cn(modalContentVariants({ size }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
