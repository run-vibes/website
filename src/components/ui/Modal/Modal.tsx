import { cn } from '@/lib/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ReactNode } from 'react'

const modalContentVariants = cva('relative bg-background rounded-lg shadow-xl p-6 w-full', {
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
})

interface ModalProps extends VariantProps<typeof modalContentVariants> {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, size, children, className }: ModalProps) {
  if (!open) return null

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
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
        onKeyDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </dialog>
  )
}
