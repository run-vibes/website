import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-card')
  })

  it('applies outlined variant', () => {
    render(
      <Card variant="outlined" data-testid="card">
        Content
      </Card>,
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('border')
  })

  it('merges custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>,
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
  })
})

describe('Card composition', () => {
  it('renders full card with all parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('CardTitle renders as h3 by default', () => {
    render(<CardTitle>My Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveTextContent('My Title')
  })
})
