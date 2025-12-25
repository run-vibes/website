import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AnswerCard } from './AnswerCard'

describe('AnswerCard', () => {
  it('renders prefix and label', () => {
    render(<AnswerCard prefix="A" label="Test Label" value="test" onSelect={vi.fn()} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('calls onSelect with value when clicked', async () => {
    const onSelect = vi.fn()
    render(<AnswerCard prefix="A" label="Test" value="test_value" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('test_value')
  })

  it('shows selected state', () => {
    render(<AnswerCard prefix="A" label="Test" value="test" selected onSelect={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('is disabled when disabled prop is true', () => {
    render(<AnswerCard prefix="A" label="Test" value="test" disabled onSelect={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
