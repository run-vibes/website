import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Scanlines } from './Scanlines'

describe('Scanlines', () => {
  it('renders the scanlines overlay', () => {
    const { container } = render(<Scanlines />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('has correct z-index', () => {
    const { container } = render(<Scanlines />)
    expect(container.firstChild).toHaveClass('z-[3]')
  })
})
