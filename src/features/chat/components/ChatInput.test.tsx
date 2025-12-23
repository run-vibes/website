import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('renders input and send button', () => {
    render(<ChatInput onSend={() => {}} />)
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSend with input value when submitted', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)

    await user.type(screen.getByRole('textbox'), 'Hello')
    await user.click(screen.getByRole('button'))

    expect(onSend).toHaveBeenCalledWith('Hello')
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSend={() => {}} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello')
    await user.click(screen.getByRole('button'))

    expect(input).toHaveValue('')
  })

  it('does not send empty messages', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)

    await user.click(screen.getByRole('button'))

    expect(onSend).not.toHaveBeenCalled()
  })

  it('disables input when loading', () => {
    render(<ChatInput onSend={() => {}} loading />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
