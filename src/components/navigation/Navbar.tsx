import { Container } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Link } from '@tanstack/react-router'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn(
        'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-foreground">
            Vibes
          </Link>
          <div className="flex items-center gap-6">
            {/* Navigation links will be added as routes are created */}
          </div>
        </nav>
      </Container>
    </header>
  )
}
