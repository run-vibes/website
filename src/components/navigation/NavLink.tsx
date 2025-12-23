import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

interface NavLinkProps extends Omit<ComponentProps<typeof Link>, 'ref'> {
  active?: boolean
}

export function NavLink({
  className,
  active,
  children,
  ...props
}: NavLinkProps) {
  return (
    <Link
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        active ? 'text-primary' : 'text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
