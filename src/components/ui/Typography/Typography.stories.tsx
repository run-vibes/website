import type { Story } from '@ladle/react'
import { Heading, Text } from './Typography'

export const FontFamilies: Story = () => (
  <div className="space-y-8">
    <div>
      <Text size="sm" variant="muted" className="mb-2">
        Headings use JetBrains Mono (monospace)
      </Text>
      <Heading size="xl">THE QUICK BROWN FOX</Heading>
    </div>
    <div>
      <Text size="sm" variant="muted" className="mb-2">
        Body text uses Inter (sans-serif)
      </Text>
      <Text size="lg">The quick brown fox jumps over the lazy dog.</Text>
    </div>
    <div>
      <Text size="sm" variant="muted" className="mb-2">
        Code uses JetBrains Mono (monospace)
      </Text>
      <code className="font-mono text-lg text-accent-secondary">const agent = new AIAgent()</code>
    </div>
  </div>
)

export const HeadingSizes: Story = () => (
  <div className="space-y-4">
    <Heading size="2xl">Heading 2XL</Heading>
    <Heading size="xl">Heading XL</Heading>
    <Heading size="lg">Heading LG</Heading>
    <Heading size="md">Heading MD</Heading>
    <Heading size="sm">Heading SM</Heading>
  </div>
)

export const HeadingLevels: Story = () => (
  <div className="space-y-4">
    <Heading level={1}>H1 Heading</Heading>
    <Heading level={2}>H2 Heading</Heading>
    <Heading level={3}>H3 Heading</Heading>
    <Heading level={4}>H4 Heading</Heading>
  </div>
)

export const TextSizes: Story = () => (
  <div className="space-y-2">
    <Text size="lg">Large text for emphasis</Text>
    <Text size="md">Medium text (default)</Text>
    <Text size="sm">Small text for captions</Text>
    <Text size="xs">Extra small text</Text>
  </div>
)

export const TextVariants: Story = () => (
  <div className="space-y-2">
    <Text variant="default">Default text color</Text>
    <Text variant="muted">Muted text for secondary content</Text>
    <Text variant="accent">Accent text for highlights</Text>
  </div>
)

export const TextWeights: Story = () => (
  <div className="space-y-2">
    <Text weight="normal">Normal weight</Text>
    <Text weight="medium">Medium weight</Text>
    <Text weight="semibold">Semibold weight</Text>
    <Text weight="bold">Bold weight</Text>
  </div>
)

export const TextElements: Story = () => (
  <div className="space-y-2">
    <Text as="p">Paragraph element (default)</Text>
    <Text as="span">Span element (inline)</Text>
    <Text as="div">Div element (block)</Text>
  </div>
)
