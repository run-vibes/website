import type { Story } from '@ladle/react'
import { Input } from './Input'

export const Default: Story = () => <Input placeholder="Enter your email" />

export const Variants: Story = () => (
  <div className="space-y-4 w-80">
    <Input variant="default" placeholder="Default input" />
    <Input variant="error" placeholder="Error state" />
  </div>
)

export const Sizes: Story = () => (
  <div className="space-y-4 w-80">
    <Input inputSize="sm" placeholder="Small input" />
    <Input inputSize="md" placeholder="Medium input (default)" />
    <Input inputSize="lg" placeholder="Large input" />
  </div>
)

export const States: Story = () => (
  <div className="space-y-4 w-80">
    <Input placeholder="Normal" />
    <Input placeholder="Disabled" disabled />
    <Input placeholder="With value" defaultValue="Hello world" />
  </div>
)

export const Types: Story = () => (
  <div className="space-y-4 w-80">
    <Input type="text" placeholder="Text input" />
    <Input type="email" placeholder="Email input" />
    <Input type="password" placeholder="Password input" />
    <Input type="number" placeholder="Number input" />
  </div>
)
