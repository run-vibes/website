import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Particles } from './Particles'

describe('Particles', () => {
  it('renders the particles container', () => {
    const { container } = render(<Particles />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('renders 25 particles by default', () => {
    const { container } = render(<Particles />)
    const particles = container.querySelectorAll('[data-particle]')
    expect(particles).toHaveLength(25)
  })

  it('accepts custom count', () => {
    const { container } = render(<Particles count={10} />)
    const particles = container.querySelectorAll('[data-particle]')
    expect(particles).toHaveLength(10)
  })
})
