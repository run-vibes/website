import type { Story } from '@ladle/react'
import { Button } from '../Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card'

export const Default: Story = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
    </CardHeader>
    <CardContent>
      <p>This is the card content. It can contain any elements.</p>
    </CardContent>
    <CardFooter>
      <Button size="sm">Action</Button>
    </CardFooter>
  </Card>
)

export const Variants: Story = () => (
  <div className="flex gap-4">
    <Card variant="default" className="w-64 p-4">
      <p className="font-medium">Default</p>
      <p className="text-sm text-muted-foreground">With shadow</p>
    </Card>
    <Card variant="outlined" className="w-64 p-4">
      <p className="font-medium">Outlined</p>
      <p className="text-sm text-muted-foreground">With border</p>
    </Card>
    <Card variant="ghost" className="w-64 p-4">
      <p className="font-medium">Ghost</p>
      <p className="text-sm text-muted-foreground">Transparent</p>
    </Card>
  </div>
)

export const WithPadding: Story = () => (
  <div className="flex gap-4">
    <Card padding="sm" className="w-48">
      <p>Small padding</p>
    </Card>
    <Card padding="md" className="w-48">
      <p>Medium padding</p>
    </Card>
    <Card padding="lg" className="w-48">
      <p>Large padding</p>
    </Card>
  </div>
)

export const FeatureCard: Story = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>AI-Powered Agents</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        Build intelligent agents that understand your business and deliver measurable results.
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="primary">Learn More</Button>
      <Button variant="ghost">View Demo</Button>
    </CardFooter>
  </Card>
)
