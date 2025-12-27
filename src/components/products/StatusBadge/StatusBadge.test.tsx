import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders available status with green styling', () => {
    render(<StatusBadge status="available" />)
    const badge = screen.getByText('Available')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-500/10')
  })

  it('renders coming-soon status with amber styling', () => {
    render(<StatusBadge status="coming-soon" />)
    const badge = screen.getByText('Coming Soon')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-amber-500/10')
  })
})
