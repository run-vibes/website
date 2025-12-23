import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        Content
      </Modal>,
    )
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders overlay when open', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        Content
      </Modal>,
    )
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        Content
      </Modal>,
    )

    await user.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when content is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose}>
        <div>Content</div>
      </Modal>,
    )

    await user.click(screen.getByText('Content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('applies size variant', () => {
    render(
      <Modal open={true} onClose={() => {}} size="lg">
        Content
      </Modal>,
    )
    const content = screen.getByTestId('modal-content')
    expect(content).toHaveClass('max-w-2xl')
  })
})
