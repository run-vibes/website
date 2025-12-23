import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  Heading,
  Section,
  Text,
} from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="lg" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="2xl" className="mb-6">
            The studio where AI agents come to life
          </Heading>
          <Text size="lg" variant="muted" className="mb-8 max-w-2xl mx-auto">
            Delivering impact you can measure. We build intelligent agents that understand your
            business and drive real results.
          </Text>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              Start a Project
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} size="lg" className="mb-4">
              What We Build
            </Heading>
            <Text variant="muted" className="max-w-2xl mx-auto">
              Custom AI agents tailored to your unique business challenges
            </Text>
          </div>
          <Grid cols={3} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle>Autonomous Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="muted">
                  AI agents that work independently, making decisions and taking actions to achieve
                  your goals.
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Process Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="muted">
                  Streamline complex workflows with intelligent automation that adapts to changing
                  conditions.
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="muted">
                  Connect AI capabilities with your existing tools and systems for seamless
                  operation.
                </Text>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>
    </>
  )
}
