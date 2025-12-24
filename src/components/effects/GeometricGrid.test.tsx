import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeometricGrid } from './GeometricGrid'

describe('GeometricGrid', () => {
  it('renders the grid overlay', () => {
    const { container } = render(<GeometricGrid />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('is positioned fixed and full screen', () => {
    const { container } = render(<GeometricGrid />)
    expect(container.firstChild).toHaveClass('fixed', 'inset-0')
  })

  it('merges custom className', () => {
    const { container } = render(<GeometricGrid className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
