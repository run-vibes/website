import { Container, Logo } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Link } from '@tanstack/react-router'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t border-border bg-muted py-12', className)}>
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo size="sm" variant="mark" />
          <p className="font-mono text-sm text-muted-foreground">
            &copy; {currentYear} Vibes. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/brand"
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Brand
            </Link>
            <a
              href="mailto:hello@vibes.run"
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              hello@vibes.run
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
