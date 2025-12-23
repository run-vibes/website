import { Container } from '@/components/ui'
import { cn } from '@/lib/cn'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t border-border bg-background py-8', className)}>
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Vibes. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:hello@vibes.run"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
