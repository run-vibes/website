import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heading, Text } from './Typography'

describe('Heading', () => {
  it('renders h1 by default', () => {
    render(<Heading>Hello World</Heading>)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Hello World')
  })

  it('renders specified level', () => {
    render(<Heading level={2}>Subheading</Heading>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it('applies size variant classes', () => {
    render(<Heading size="xl">Large Heading</Heading>)
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-4xl')
  })

  it('merges custom className', () => {
    render(<Heading className="custom-class">Test</Heading>)
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('custom-class')
  })
})

describe('Text', () => {
  it('renders paragraph by default', () => {
    render(<Text>Body text</Text>)
    const text = screen.getByText('Body text')
    expect(text.tagName).toBe('P')
  })

  it('renders as span when specified', () => {
    render(<Text as="span">Inline text</Text>)
    const text = screen.getByText('Inline text')
    expect(text.tagName).toBe('SPAN')
  })

  it('applies size variant', () => {
    render(<Text size="sm">Small text</Text>)
    const text = screen.getByText('Small text')
    expect(text).toHaveClass('text-sm')
  })

  it('applies muted variant', () => {
    render(<Text variant="muted">Muted text</Text>)
    const text = screen.getByText('Muted text')
    expect(text).toHaveClass('text-muted-foreground')
  })
})
