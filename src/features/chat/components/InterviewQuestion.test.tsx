import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InterviewQuestion } from './InterviewQuestion'

const mockQuestion = {
  id: 'intent',
  question: 'What brings you to Vibes?',
  subtitle: 'Choose one',
  phase: 'opener' as const,
  options: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ],
}

describe('InterviewQuestion', () => {
  it('renders question text', () => {
    render(<InterviewQuestion question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText('What brings you to Vibes?')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<InterviewQuestion question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText('Choose one')).toBeInTheDocument()
  })

  it('renders all options as AnswerCards', () => {
    render(<InterviewQuestion question={mockQuestion} onAnswer={vi.fn()} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('calls onAnswer with question id and value when option selected', async () => {
    const onAnswer = vi.fn()
    render(<InterviewQuestion question={mockQuestion} onAnswer={onAnswer} />)
    await userEvent.click(screen.getByText('Option A'))
    expect(onAnswer).toHaveBeenCalledWith('intent', 'a')
  })

  it('shows selected state for current value', () => {
    render(<InterviewQuestion question={mockQuestion} currentValue="a" onAnswer={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false')
  })

  it('disables all options when disabled', () => {
    render(<InterviewQuestion question={mockQuestion} disabled onAnswer={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })
})
