import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeatureGrid } from './FeatureGrid'

const features = [
  { title: 'Remote Access', description: 'Control from anywhere' },
  { title: 'Plugin System', description: 'Extend with plugins' },
]

describe('FeatureGrid', () => {
  it('renders all feature titles', () => {
    render(<FeatureGrid features={features} />)
    expect(screen.getByText('Remote Access')).toBeInTheDocument()
    expect(screen.getByText('Plugin System')).toBeInTheDocument()
  })

  it('renders all feature descriptions', () => {
    render(<FeatureGrid features={features} />)
    expect(screen.getByText('Control from anywhere')).toBeInTheDocument()
    expect(screen.getByText('Extend with plugins')).toBeInTheDocument()
  })
})
