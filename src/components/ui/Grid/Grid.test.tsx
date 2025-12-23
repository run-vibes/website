import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Grid } from './Grid'

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <div>Item</div>
      </Grid>,
    )
    expect(screen.getByText('Item')).toBeInTheDocument()
  })

  it('applies grid display', () => {
    render(
      <Grid data-testid="grid">
        <div>Item</div>
      </Grid>,
    )
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveClass('grid')
  })

  it('applies column count', () => {
    render(
      <Grid cols={3} data-testid="grid">
        <div>Item</div>
      </Grid>,
    )
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveClass('md:grid-cols-3')
  })

  it('applies gap', () => {
    render(
      <Grid gap="lg" data-testid="grid">
        <div>Item</div>
      </Grid>,
    )
    const grid = screen.getByTestId('grid')
    expect(grid).toHaveClass('gap-8')
  })

  it('merges custom className', () => {
    render(
      <Grid className="custom" data-testid="grid">
        <div>Item</div>
      </Grid>,
    )
    expect(screen.getByTestId('grid')).toHaveClass('custom')
  })
})
