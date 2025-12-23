import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('renders children', () => {
    render(<Section>Content</Section>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders as section element', () => {
    render(<Section data-testid="section">Content</Section>)
    const section = screen.getByTestId('section')
    expect(section.tagName).toBe('SECTION')
  })

  it('applies padding by default', () => {
    render(<Section data-testid="section">Content</Section>)
    const section = screen.getByTestId('section')
    expect(section).toHaveClass('py-16')
  })

  it('applies size variant', () => {
    render(<Section size="lg" data-testid="section">Content</Section>)
    const section = screen.getByTestId('section')
    expect(section).toHaveClass('py-24')
  })

  it('merges custom className', () => {
    render(<Section className="bg-primary" data-testid="section">Content</Section>)
    expect(screen.getByTestId('section')).toHaveClass('bg-primary')
  })
})
