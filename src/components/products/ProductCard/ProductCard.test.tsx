import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProductCard } from './ProductCard'

// Mock the Link component from TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('ProductCard', () => {
  const props = {
    name: 'Vibes',
    tagline: 'Remote control for Claude Code',
    status: 'available' as const,
    features: ['Feature 1', 'Feature 2'],
    href: '/products/vibes',
  }

  it('renders product name and tagline', () => {
    render(<ProductCard {...props} />)
    expect(screen.getByText('Vibes')).toBeInTheDocument()
    expect(screen.getByText('Remote control for Claude Code')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<ProductCard {...props} />)
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('renders feature list', () => {
    render(<ProductCard {...props} />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })

  it('renders link to product page', () => {
    render(<ProductCard {...props} />)
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute(
      'href',
      '/products/vibes',
    )
  })
})
