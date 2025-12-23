import type { Story } from '@ladle/react'
import { Button } from './Button'

export const Primary: Story = () => <Button>Primary Button</Button>

export const Secondary: Story = () => <Button variant="secondary">Secondary Button</Button>

export const Ghost: Story = () => <Button variant="ghost">Ghost Button</Button>

export const Sizes: Story = () => (
  <div className="flex items-center gap-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const Disabled: Story = () => <Button disabled>Disabled</Button>
