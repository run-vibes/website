import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatBubble } from './ChatBubble'

describe('ChatBubble', () => {
  it('renders message content', () => {
    render(<ChatBubble sender="user">Hello</ChatBubble>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies user sender styles', () => {
    render(
      <ChatBubble sender="user" data-testid="bubble">
        Hello
      </ChatBubble>,
    )
    const bubble = screen.getByTestId('bubble')
    expect(bubble).toHaveClass('bg-primary')
  })

  it('applies assistant sender styles', () => {
    render(
      <ChatBubble sender="assistant" data-testid="bubble">
        Hello
      </ChatBubble>,
    )
    const bubble = screen.getByTestId('bubble')
    expect(bubble).toHaveClass('bg-muted')
  })

  it('aligns user messages to the right', () => {
    render(
      <ChatBubble sender="user" data-testid="bubble">
        Hello
      </ChatBubble>,
    )
    const bubble = screen.getByTestId('bubble')
    expect(bubble).toHaveClass('ml-auto')
  })

  it('aligns assistant messages to the left', () => {
    render(
      <ChatBubble sender="assistant" data-testid="bubble">
        Hello
      </ChatBubble>,
    )
    const bubble = screen.getByTestId('bubble')
    expect(bubble).toHaveClass('mr-auto')
  })
})
