import type { Story } from '@ladle/react'
import { Logo } from './Logo'

export const Default: Story = () => <Logo />

export const MarkOnly: Story = () => <Logo variant="mark" />

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4 items-start">
    <Logo size="sm" />
    <Logo size="md" />
    <Logo size="lg" />
  </div>
)

export const MarkSizes: Story = () => (
  <div className="flex gap-4 items-center">
    <Logo variant="mark" size="sm" />
    <Logo variant="mark" size="md" />
    <Logo variant="mark" size="lg" />
  </div>
)
