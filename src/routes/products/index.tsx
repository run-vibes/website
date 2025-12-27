import { ProductCard } from '@/components/products'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, Text } from '@/components/ui/Typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
})

const products = [
  {
    name: 'Vibes',
    tagline: 'Remote control for your Claude Code sessions',
    status: 'available' as const,
    features: [
      'Control sessions from any device',
      'Native Rust plugin system',
      'Real-time session mirroring',
    ],
    href: '/products/vibes',
    image: '/images/products/vibes-terminal.svg',
  },
  {
    name: 'Volt',
    tagline: 'Volatility analysis & trade execution',
    status: 'coming-soon' as const,
    features: [
      'IV surfaces and Greeks analytics',
      '11 options strategies built-in',
      'Backtest with synthetic or real data',
    ],
    href: '/products/volt',
    image: '/images/products/volt-dashboard.svg',
  },
]

function ProductsPage() {
  return (
    <>
      <Section size="lg" className="bg-gradient-to-b from-background to-muted/20">
        <Container size="md" className="text-center">
          <Heading size="2xl" className="mb-6">
            What We're Building
          </Heading>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
            Open source tools and platforms from the Vibes studio.
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
