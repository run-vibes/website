import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NoiseOverlay } from './NoiseOverlay'

describe('NoiseOverlay', () => {
  it('renders the noise overlay', () => {
    const { container } = render(<NoiseOverlay />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('is hidden from accessibility tree', () => {
    const { container } = render(<NoiseOverlay />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
