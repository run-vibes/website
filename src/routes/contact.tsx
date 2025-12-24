import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { ChatContainer } from '@/features/chat/components/ChatContainer'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useRef, useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [showForm, setShowForm] = useState(false)
  const toggleRef = useRef<HTMLDivElement>(null)

  // Scroll the toggle link into view when chat input is focused
  // This positions the toggle just above the iOS keyboard, keeping the whole chat visible
  const handleChatFocus = useCallback(() => {
    setTimeout(() => {
      toggleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 300) // Delay for iOS keyboard animation
  }, [])

  return (
    <>
      <Section size="lg">
        <Container size="md">
          <div className="text-center mb-12">
            <Heading size="2xl" className="mb-4">
              Let's Talk
            </Heading>
            <Text size="lg" variant="muted" className="max-w-xl mx-auto">
              Whether it's a rough idea or a detailed plan, we want to hear it.
            </Text>
          </div>

          {/* Chat Interface */}
          <div className="max-w-2xl mx-auto">
            <ChatContainer
              apiEndpoint={import.meta.env.VITE_CHAT_API_URL || '/api/chat'}
              onInputFocus={handleChatFocus}
            />

            {/* Fallback Form Toggle */}
            <div ref={toggleRef} className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                {showForm ? 'Use chat instead' : 'Prefer a traditional form?'}
              </button>
            </div>

            {/* Fallback Form */}
            {showForm && (
              <form
                className="mt-8 space-y-4 p-6 border rounded-xl bg-muted/30"
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <Heading level={3} size="md" className="mb-4">
                  Contact Form
                </Heading>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <Input id="company" name="company" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            )}
          </div>
        </Container>
      </Section>

      {/* Contact Info */}
      <Section className="bg-muted/30">
        <Container size="sm" className="text-center">
          <Heading level={2} size="lg" className="mb-4">
            Other Ways to Reach Us
          </Heading>
          <Text variant="muted" className="mb-4">
            Email us directly at{' '}
            <a href="mailto:hello@vibes.run" className="text-primary hover:underline">
              hello@vibes.run
            </a>
          </Text>
        </Container>
      </Section>
    </>
  )
}
