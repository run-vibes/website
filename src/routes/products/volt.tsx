import { Container, Heading, Section, Text } from '@/components/ui'
import { BuiltByVibes, StatusBadge, WaitlistForm } from '@/components/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/volt')({
  component: VoltPage,
})

const screenshots = [
  { src: '/images/products/volt-dashboard.svg', caption: 'IV Surface Visualization' },
]

function VoltPage() {
  return (
    <>
      {/* Hero with atmospheric background */}
      <Section
        size="xl"
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/products/volt-bg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <Container size="sm" className="relative text-center">
          <StatusBadge status="coming-soon" className="mb-6" />
          <Heading size="3xl" className="mb-4">
            Volt
          </Heading>
          <Text size="xl" className="mb-6 text-accent">
            Volatility analysis, simulation & trade execution
          </Text>
          <Text size="lg" variant="muted" className="max-w-xl mx-auto mb-10">
            A comprehensive platform for traders who want to analyze options volatility,
            backtest strategies, and execute with confidence.
          </Text>

          <WaitlistForm product="volt" />
        </Container>
      </Section>

      {/* Screenshot Gallery */}
      <Section>
        <Container>
          <Heading level={2} size="xl" className="text-center mb-12">
            Preview
          </Heading>
          <div className="grid gap-8">
            {screenshots.map((screenshot) => (
              <div key={screenshot.caption} className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border shadow-2xl">
                  <img
                    src={screenshot.src}
                    alt={screenshot.caption}
                    className="w-full"
                  />
                </div>
                <Text variant="muted" className="text-center text-sm">
                  {screenshot.caption}
                </Text>
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
