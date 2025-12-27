import { BuiltByVibes, CodeBlock, FeatureGrid } from '@/components/products'
import { Button, Container, Heading, Section, Text } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/vibes')({
  component: VibesPage,
})

const features = [
  {
    title: 'Remote Access',
    description: 'Control Claude Code sessions from your phone, tablet, or any device via web UI.',
  },
  {
    title: 'Session Mirroring',
    description: 'Real-time sync between your terminal and remote devices.',
  },
  {
    title: 'Plugin System',
    description: 'Extend vibes with native Rust plugins for custom commands and workflows.',
  },
  {
    title: 'Cross-Platform',
    description: 'Single binary for Linux, macOS, and Windows.',
  },
]

const steps = [
  { step: '1', title: 'Install', description: 'Run the install command' },
  { step: '2', title: 'Start', description: 'Run vibes claude with your prompt' },
  { step: '3', title: 'Access', description: 'Open the web UI from any device' },
]

function VibesPage() {
  return (
    <>
      {/* Hero */}
      <Section size="xl" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="3xl" className="mb-4">
            Vibes
          </Heading>
          <Text size="xl" className="mb-6 text-accent">
            Remote control for your Claude Code sessions
          </Text>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto mb-8">
            Wrap Claude Code with remote access, session management, and a plugin ecosystem —
            control your AI coding sessions from anywhere.
          </Text>

          <div className="max-w-lg mx-auto mb-6">
            <CodeBlock code="curl -sSf https://vibes.run/install | sh" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <a
                href="https://github.com/run-vibes/vibes"
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on GitHub
              </a>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a
                href="https://github.com/run-vibes/vibes#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Screenshot */}
      <Section className="bg-muted/30">
        <Container>
          <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
            <img
              src="/images/products/vibes-terminal.svg"
              alt="Vibes terminal interface"
              className="w-full"
            />
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <Heading level={2} size="xl" className="text-center mb-12">
            Features
          </Heading>
          <FeatureGrid features={features} columns={2} />
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="bg-muted/30">
        <Container>
          <Heading level={2} size="xl" className="text-center mb-12">
            How It Works
          </Heading>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <Heading level={3} size="md" className="mb-2">
                  {item.title}
                </Heading>
                <Text variant="muted">{item.description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container size="sm">
          <BuiltByVibes />
        </Container>
      </Section>
    </>
  )
}
