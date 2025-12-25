import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResponseStarter } from './ResponseStarter'

describe('ResponseStarter', () => {
  const starters = ['Our biggest challenge is...', "We've been struggling with..."]

  it('renders all starter options', () => {
    render(<ResponseStarter starters={starters} onSelect={vi.fn()} />)
    expect(screen.getByText('Our biggest challenge is...')).toBeInTheDocument()
    expect(screen.getByText("We've been struggling with...")).toBeInTheDocument()
  })

  it('calls onSelect with starter text when clicked', async () => {
    const onSelect = vi.fn()
    render(<ResponseStarter starters={starters} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Our biggest challenge is...'))
    expect(onSelect).toHaveBeenCalledWith('Our biggest challenge is...')
  })

  it('renders nothing when starters array is empty', () => {
    const { container } = render(<ResponseStarter starters={[]} onSelect={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })
})
