import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CodeBlock } from './CodeBlock'

// Mock clipboard API
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText },
})

describe('CodeBlock', () => {
  it('renders the code content', () => {
    render(<CodeBlock code="npm install vibes" />)
    expect(screen.getByText('npm install vibes')).toBeInTheDocument()
  })

  it('copies code to clipboard when copy button is clicked', async () => {
    mockWriteText.mockResolvedValueOnce(undefined)
    render(<CodeBlock code="curl example.com" />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)

    expect(mockWriteText).toHaveBeenCalledWith('curl example.com')
  })

  it('shows copied feedback after clicking', async () => {
    mockWriteText.mockResolvedValueOnce(undefined)
    render(<CodeBlock code="test" />)

    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)

    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
