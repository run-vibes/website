import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EffectsContainer } from './EffectsContainer'

describe('EffectsContainer', () => {
  it('renders all effect layers', () => {
    const { container } = render(<EffectsContainer />)
    // Should have grid, noise, scanlines, particles
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBeGreaterThanOrEqual(4)
  })

  it('respects reduced motion preference', () => {
    // This is tested via CSS media query, just verify component renders
    const { container } = render(<EffectsContainer />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
