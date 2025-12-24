import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Grid } from '@/components/ui/Grid'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const services = [
  {
    title: 'Agent Development',
    description:
      'End-to-end design and development of AI agents, from single-purpose assistants to multi-agent orchestrations.',
    href: '/services#agent-development',
  },
  {
    title: 'AI Strategy',
    description:
      'Navigate the AI landscape with practical roadmaps that align with your business objectives.',
    href: '/services#ai-strategy',
  },
  {
    title: 'Product Development',
    description: 'Build AI-native products that leverage intelligence as a core differentiator.',
    href: '/services#product-development',
  },
  {
    title: 'Workshops',
    description:
      'Empower your team with hands-on training to build and deploy AI agents independently.',
    href: '/services#workshops',
  },
]

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="xl" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="3xl" className="mb-6">
            The studio where AI agents come to life
          </Heading>
          <Text size="xl" variant="muted" className="mb-8 max-w-2xl mx-auto">
            Delivering impact you can measure. We build intelligent agents that understand your
            business and drive real results.
          </Text>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/contact">Let's Talk</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">See Our Services</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Social Proof Bar */}
      <Section size="sm" className="border-y bg-muted/30">
        <Container>
          <Text variant="muted" className="text-center text-sm">
            Trusted by innovative teams building the future with AI
          </Text>
        </Container>
      </Section>

      {/* Services Overview */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              What We Do
            </Heading>
            <Text variant="muted" size="lg" className="max-w-2xl mx-auto">
              From strategy to deployment, we help you build AI systems that work
            </Text>
          </div>
          <Grid cols={2} gap="lg">
            {services.map((service) => (
              <Card key={service.title} variant="interactive" asChild>
                <Link to={service.href}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="muted">{service.description}</Text>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </Grid>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/services">Learn More About Our Services</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* How We Work */}
      <Section className="bg-muted/30">
        <Container size="md">
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              How We Work
            </Heading>
            <Text variant="muted" size="lg">
              A collaborative approach focused on delivering real value
            </Text>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Discover',
                description:
                  'We start by understanding your business, challenges, and goals through in-depth conversations.',
              },
              {
                step: '02',
                title: 'Design',
                description:
                  'We architect solutions that fit your specific needs, not one-size-fits-all templates.',
              },
              {
                step: '03',
                title: 'Deliver',
                description:
                  'We build iteratively, shipping value early and often with continuous feedback loops.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-primary mb-4">{item.step}</div>
                <Heading level={3} size="md" className="mb-2">
                  {item.title}
                </Heading>
                <Text variant="muted">{item.description}</Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section size="lg" className="bg-primary text-primary-foreground">
        <Container size="sm" className="text-center">
          <Heading level={2} size="xl" className="mb-4">
            Ready to bring your AI vision to life?
          </Heading>
          <Text size="lg" className="mb-8 opacity-90">
            Tell us about your project and let's explore what's possible together.
          </Text>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/contact">Start a Conversation</Link>
          </Button>
        </Container>
      </Section>
    </>
  )
}
