import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

const services = [
  {
    id: 'agent-development',
    title: 'Agent Development',
    tagline: 'Intelligent agents. Coordinated swarms. Real-world impact.',
    description:
      'We design and build AI agents that work autonomously to achieve your business goals. From single-purpose assistants to complex multi-agent orchestrations, we handle the full lifecycle from concept through production deployment.',
    benefits: [
      'End-to-end design and development of AI agents',
      'Single agents to multi-agent orchestration',
      'Production-ready deployment and monitoring',
      'Ongoing support and iteration',
    ],
    useCases: [
      'Customer support agents that resolve issues autonomously',
      'Research agents that synthesize information across sources',
      'Operations agents that coordinate complex workflows',
    ],
  },
  {
    id: 'ai-strategy',
    title: 'AI Strategy & Consulting',
    tagline: 'Navigate the AI landscape with a clear plan.',
    description:
      'Cut through the hype and build a practical AI roadmap. We assess your readiness, identify high-impact opportunities, and create actionable plans that align with your business objectives.',
    benefits: [
      'AI readiness assessments',
      'Architecture reviews and recommendations',
      'Transformation roadmaps with clear milestones',
      'Vendor and tool evaluation',
    ],
    useCases: [
      'Evaluating where AI can have the biggest impact',
      'Building internal AI capabilities vs. buying solutions',
      'Preparing your data and infrastructure for AI',
    ],
  },
  {
    id: 'product-development',
    title: 'Product Development',
    tagline: 'Ship AI products that users love.',
    description:
      'Building AI-native products requires a different approach. We help you ideate, prototype, and ship products that leverage AI as a core differentiator—not just a feature.',
    benefits: [
      'New product ideation and validation',
      'AI feature integration into existing products',
      'Rapid prototyping and user testing',
      'Scale from MVP to production',
    ],
    useCases: [
      'Launching a new AI-powered SaaS product',
      'Adding intelligent features to your existing platform',
      'Rebuilding legacy products with AI capabilities',
    ],
  },
  {
    id: 'workshops',
    title: 'Workshops & Training',
    tagline: 'Empower your team to think in agents.',
    description:
      'Your team is your most valuable asset. We run hands-on workshops that give your engineers and leaders the skills to build and deploy AI agents independently.',
    benefits: [
      'Hands-on agent-building workshops',
      'Executive AI literacy sessions',
      'Team enablement programs',
      'Custom curriculum for your stack',
    ],
    useCases: [
      'Upskilling engineering teams on agent architectures',
      'Helping leadership understand AI capabilities and limits',
      'Building internal centers of excellence',
    ],
  },
]

function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <Section size="lg" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="2xl" className="mb-6">
            What We Do
          </Heading>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
            From strategy to deployment, we help you build AI systems that deliver measurable
            business impact.
          </Text>
        </Container>
      </Section>

      {/* Service Sections */}
      {services.map((service, index) => (
        <Section key={service.id} id={service.id} className={index % 2 === 1 ? 'bg-muted/30' : ''}>
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <Heading level={2} size="xl" className="mb-2">
                  {service.title}
                </Heading>
                <Text variant="muted" className="text-lg mb-6 italic">
                  {service.tagline}
                </Text>
                <Text className="mb-6">{service.description}</Text>
                <Button asChild>
                  <Link to="/contact">Discuss Your Project</Link>
                </Button>
              </div>
              <div className="space-y-8">
                <div>
                  <Heading level={3} size="sm" className="mb-3">
                    Key Benefits
                  </Heading>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <Text>{benefit}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Heading level={3} size="sm" className="mb-3">
                    Example Use Cases
                  </Heading>
                  <ul className="space-y-2">
                    {service.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-start gap-2">
                        <span className="text-muted-foreground">→</span>
                        <Text variant="muted">{useCase}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* CTA */}
      <Section size="lg" className="bg-primary text-primary-foreground">
        <Container size="sm" className="text-center">
          <Heading level={2} size="xl" className="mb-4">
            Ready to get started?
          </Heading>
          <Text size="lg" className="mb-8 opacity-90">
            Tell us about your project and we'll help you figure out the best path forward.
          </Text>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/contact">Start a Conversation</Link>
          </Button>
        </Container>
      </Section>
    </>
  )
}
