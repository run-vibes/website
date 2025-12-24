import { Card, CardContent } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/brand')({
  component: BrandPage,
})

const colors = [
  { name: 'Background', value: '#0a0a0b', textColor: 'white' },
  { name: 'Surface', value: '#18181b', textColor: 'white' },
  { name: 'Accent', value: '#ffffff', textColor: 'black' },
  { name: 'Secondary', value: '#666666', textColor: 'white' },
  { name: 'Text Primary', value: '#fafafa', textColor: 'black' },
  { name: 'Text Muted', value: '#71717a', textColor: 'white' },
]

function BrandPage() {
  return (
    <>
      {/* Hero */}
      <Section size="xl" className="bg-gradient-to-b from-background to-muted/10">
        <Container size="md" className="text-center">
          <Text variant="muted" className="uppercase tracking-widest text-sm mb-4">
            Brand Assets
          </Text>
          <Heading size="3xl" className="mb-6">
            /Vibes
          </Heading>
          <Text size="xl" variant="muted" className="max-w-2xl mx-auto">
            The forward slash is our signature. It's the beginning of every path, every command,
            every journey. It signals momentum—we don't wait, we run.
          </Text>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section>
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Heading level={2} size="lg" className="mb-4">
                Philosophy
              </Heading>
              <Text variant="muted" className="mb-6">
                Our identity emerges from the intersection of code and motion. The forward slash
                isn't decoration—it's infrastructure. Every Unix path, every URL, every CLI command
                begins with <code className="font-mono text-accent">/</code>.
              </Text>
              <Text variant="muted">
                We chose monochrome because confidence doesn't need color. We chose monospace
                because precision matters. We chose the slash because we move forward, always.
              </Text>
            </div>
            <div>
              <Heading level={2} size="lg" className="mb-4">
                Principles
              </Heading>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-accent font-mono">/</span>
                  <Text variant="muted">
                    <strong className="text-foreground">Forward motion.</strong> The slash leans
                    into the future. We build what's next.
                  </Text>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-mono">/</span>
                  <Text variant="muted">
                    <strong className="text-foreground">Developer-native.</strong> Our aesthetic
                    speaks the language of builders—terminals, paths, precision.
                  </Text>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-mono">/</span>
                  <Text variant="muted">
                    <strong className="text-foreground">Measured impact.</strong> We ship agents
                    that deliver results you can quantify.
                  </Text>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Logo Section */}
      <Section className="bg-muted/30">
        <Container>
          <Heading level={2} size="xl" className="mb-2 text-center">
            Logo
          </Heading>
          <Text variant="muted" className="text-center mb-12 max-w-xl mx-auto">
            The /V mark and /Vibes wordmark. Use the mark for compact spaces; the full logo where
            recognition matters.
          </Text>

          {/* Dark versions on dark bg */}
          <div className="mb-8">
            <Text variant="muted" className="text-sm uppercase tracking-widest mb-4">
              For Dark Backgrounds
            </Text>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#0a0a0b] border-white/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <img src="/logo-mark-dark.svg" alt="/V mark" className="h-16 w-16 mb-4" />
                  <Text variant="muted" className="text-sm text-zinc-500">
                    Mark
                  </Text>
                </CardContent>
              </Card>
              <Card className="bg-[#0a0a0b] border-white/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <img src="/logo-full-dark.svg" alt="/Vibes logo" className="h-12 mb-4" />
                  <Text variant="muted" className="text-sm text-zinc-500">
                    Full Logo
                  </Text>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Light versions on light bg */}
          <div>
            <Text variant="muted" className="text-sm uppercase tracking-widest mb-4">
              For Light Backgrounds
            </Text>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#fafafa] border-black/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <img src="/logo-mark-light.svg" alt="/V mark" className="h-16 w-16 mb-4" />
                  <Text className="text-sm text-zinc-600">Mark</Text>
                </CardContent>
              </Card>
              <Card className="bg-[#fafafa] border-black/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <img src="/logo-full-light.svg" alt="/Vibes logo" className="h-12 mb-4" />
                  <Text className="text-sm text-zinc-600">Full Logo</Text>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Colors */}
      <Section>
        <Container>
          <Heading level={2} size="xl" className="mb-2 text-center">
            Color Palette
          </Heading>
          <Text variant="muted" className="text-center mb-12 max-w-xl mx-auto">
            Monochrome by design. Our palette speaks through contrast and restraint, not chromatic
            noise.
          </Text>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {colors.map((color) => (
              <div key={color.value} className="text-center">
                <div
                  className="aspect-square rounded-xl border border-white/10 mb-3 flex items-end justify-center pb-3"
                  style={{ backgroundColor: color.value }}
                >
                  <span className="font-mono text-xs" style={{ color: color.textColor }}>
                    {color.value}
                  </span>
                </div>
                <Text variant="muted" className="text-sm">
                  {color.name}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Typography */}
      <Section className="bg-muted/30">
        <Container>
          <Heading level={2} size="xl" className="mb-2 text-center">
            Typography
          </Heading>
          <Text variant="muted" className="text-center mb-12 max-w-xl mx-auto">
            JetBrains Mono for headlines and brand voice. Inter for comfortable reading. Monospace
            signals precision; sans-serif provides warmth.
          </Text>

          <div className="grid md:grid-cols-2 gap-8">
            <Card padding="lg">
              <Text variant="muted" className="text-sm uppercase tracking-widest mb-4">
                Display & Headlines
              </Text>
              <p className="font-heading text-4xl font-extrabold uppercase tracking-tight mb-2">
                JetBrains Mono
              </p>
              <Text variant="muted">
                Used for headlines, navigation, buttons, and anywhere the brand speaks directly.
                Bold weights, tight tracking, uppercase for impact.
              </Text>
            </Card>
            <Card padding="lg">
              <Text variant="muted" className="text-sm uppercase tracking-widest mb-4">
                Body & UI
              </Text>
              <p className="font-sans text-4xl font-semibold mb-2">Inter</p>
              <Text variant="muted">
                Used for body copy, descriptions, and longer content. Optimized for readability
                across all screen sizes.
              </Text>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Usage Guidelines */}
      <Section>
        <Container size="md">
          <Heading level={2} size="xl" className="mb-2 text-center">
            Usage
          </Heading>
          <Text variant="muted" className="text-center mb-12 max-w-xl mx-auto">
            Simple rules. Maximum impact.
          </Text>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-green-500 font-mono text-lg">✓</span>
              <div>
                <Text className="font-medium">Use adequate clear space around the logo</Text>
                <Text variant="muted" className="text-sm">
                  Minimum clear space equals the height of the slash character.
                </Text>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-green-500 font-mono text-lg">✓</span>
              <div>
                <Text className="font-medium">Use the appropriate color variant</Text>
                <Text variant="muted" className="text-sm">
                  Dark version for dark backgrounds. Light version for light backgrounds.
                </Text>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-red-500 font-mono text-lg">✗</span>
              <div>
                <Text className="font-medium">Don't alter the logo proportions</Text>
                <Text variant="muted" className="text-sm">
                  Never stretch, compress, or distort the logo.
                </Text>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-red-500 font-mono text-lg">✗</span>
              <div>
                <Text className="font-medium">Don't add effects or embellishments</Text>
                <Text variant="muted" className="text-sm">
                  No shadows, gradients, outlines, or other modifications.
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Download */}
      <Section className="bg-muted/30">
        <Container size="sm" className="text-center">
          <Heading level={2} size="lg" className="mb-4">
            Download Assets
          </Heading>
          <Text variant="muted" className="mb-8">
            All logo files in SVG format for maximum flexibility.
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/logo-mark-dark.svg"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-heading text-sm uppercase tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              Mark (Dark)
            </a>
            <a
              href="/logo-mark-light.svg"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-heading text-sm uppercase tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              Mark (Light)
            </a>
            <a
              href="/logo-full-dark.svg"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-heading text-sm uppercase tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              Full (Dark)
            </a>
            <a
              href="/logo-full-light.svg"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-heading text-sm uppercase tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              Full (Light)
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
