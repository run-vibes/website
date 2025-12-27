import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BuiltByVibes } from './BuiltByVibes'

// Mock the Link component from TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('BuiltByVibes', () => {
  it('renders the callout text', () => {
    render(<BuiltByVibes />)
    expect(screen.getByText(/Built by/i)).toBeInTheDocument()
  })

  it('renders link to contact page', () => {
    render(<BuiltByVibes />)
    const link = screen.getByRole('link', { name: /let's talk/i })
    expect(link).toHaveAttribute('href', '/contact')
  })
})
