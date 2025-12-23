import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies max-width constraint', () => {
    render(<Container data-testid="container">Content</Container>)
    const container = screen.getByTestId('container')
    expect(container).toHaveClass('max-w-7xl')
  })

  it('centers content with mx-auto', () => {
    render(<Container data-testid="container">Content</Container>)
    const container = screen.getByTestId('container')
    expect(container).toHaveClass('mx-auto')
  })

  it('applies size variant', () => {
    render(
      <Container size="sm" data-testid="container">
        Content
      </Container>,
    )
    const container = screen.getByTestId('container')
    expect(container).toHaveClass('max-w-3xl')
  })

  it('merges custom className', () => {
    render(
      <Container className="custom" data-testid="container">
        Content
      </Container>,
    )
    expect(screen.getByTestId('container')).toHaveClass('custom')
  })
})
