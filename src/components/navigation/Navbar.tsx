import { Container, Logo } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Link } from '@tanstack/react-router'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl',
        className,
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              to="/products"
              className="font-heading text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Products
            </Link>
            <Link
              to="/services"
              className="font-heading text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="font-heading text-sm font-semibold uppercase tracking-wide bg-accent text-background px-4 py-2 rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-glow"
            >
              Let's Talk
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  )
}
