import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the logo mark', () => {
    render(<Logo />)
    expect(screen.getByLabelText('Vibes logo')).toBeInTheDocument()
  })

  it('renders mark only variant', () => {
    render(<Logo variant="mark" />)
    expect(screen.getByText('/V')).toBeInTheDocument()
  })

  it('renders full variant with wordmark', () => {
    render(<Logo variant="full" />)
    expect(screen.getByText('/V')).toBeInTheDocument()
    expect(screen.getByText('ibes')).toBeInTheDocument()
    expect(screen.getByText('.run')).toBeInTheDocument()
  })

  it('applies size variants', () => {
    const { container } = render(<Logo size="lg" />)
    expect(container.firstChild).toHaveClass('text-4xl')
  })

  it('merges custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
