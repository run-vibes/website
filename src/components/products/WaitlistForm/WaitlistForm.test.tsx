import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { WaitlistForm } from './WaitlistForm'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('WaitlistForm', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders email input and submit button', () => {
    render(<WaitlistForm product="volt" />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get early access/i })).toBeInTheDocument()
  })

  it('submits email to waitlist API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<WaitlistForm product="volt" />)

    const input = screen.getByPlaceholderText(/email/i)
    const button = screen.getByRole('button', { name: /get early access/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/waitlist'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', product: 'volt' }),
        }),
      )
    })
  })

  it('shows success message after submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<WaitlistForm product="volt" />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument()
    })
  })
})
