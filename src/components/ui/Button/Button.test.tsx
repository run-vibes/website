import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies primary variant by default', () => {
    render(<Button>Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-neutral-100')
  })

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-neutral-100')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-12')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('passes through HTML attributes', () => {
    render(<Button disabled>Button</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
