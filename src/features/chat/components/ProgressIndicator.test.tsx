import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  it('renders correct number of dots', () => {
    render(<ProgressIndicator current={0} total={7} />)
    const dots = screen.getAllByRole('listitem')
    expect(dots).toHaveLength(7)
  })

  it('marks completed dots correctly', () => {
    render(<ProgressIndicator current={3} total={7} />)
    const dots = screen.getAllByRole('listitem')
    // First 3 should be completed (0, 1, 2)
    expect(dots[0]).toHaveAttribute('data-state', 'completed')
    expect(dots[1]).toHaveAttribute('data-state', 'completed')
    expect(dots[2]).toHaveAttribute('data-state', 'completed')
    // Current (3) should be current
    expect(dots[3]).toHaveAttribute('data-state', 'current')
    // Rest should be upcoming
    expect(dots[4]).toHaveAttribute('data-state', 'upcoming')
  })

  it('shows text label when showLabel is true', () => {
    render(<ProgressIndicator current={2} total={7} showLabel />)
    expect(screen.getByText('Question 3 of 7')).toBeInTheDocument()
  })
})
