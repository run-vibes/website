import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SuggestionChips } from './SuggestionChips'

const mockOptions = [
  { value: 'option_a', label: 'Option A' },
  { value: 'option_b', label: 'Option B' },
  { value: 'option_c', label: 'Option C' },
]

describe('SuggestionChips', () => {
  it('renders all options as buttons', () => {
    render(<SuggestionChips options={mockOptions} onSelect={vi.fn()} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
    expect(screen.getByText('Option C')).toBeInTheDocument()
  })

  it('calls onSelect with value and label when chip clicked', async () => {
    const onSelect = vi.fn()
    render(<SuggestionChips options={mockOptions} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Option B'))
    expect(onSelect).toHaveBeenCalledWith('option_b', 'Option B')
  })

  it('applies custom className', () => {
    const { container } = render(
      <SuggestionChips options={mockOptions} onSelect={vi.fn()} className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders chips as rounded buttons', () => {
    render(<SuggestionChips options={mockOptions} onSelect={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    for (const button of buttons) {
      expect(button).toHaveClass('rounded-full')
    }
  })
})
