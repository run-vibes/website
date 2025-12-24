import type { Story } from '@ladle/react'
import { EffectsContainer } from './EffectsContainer'
import { GeometricGrid } from './GeometricGrid'
import { NoiseOverlay } from './NoiseOverlay'
import { Particles } from './Particles'
import { Scanlines } from './Scanlines'

export default {
  title: 'Effects',
}

export const Grid: Story = () => (
  <div className="relative min-h-[400px]">
    <GeometricGrid className="!absolute !inset-0" />
    <div className="relative z-10 p-8">
      <h3 className="font-heading text-xl mb-2">Geometric Grid</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        Subtle 60px grid pattern using CSS linear gradients. Opacity controlled by{' '}
        <code className="text-accent-secondary">--effect-grid-opacity</code>
      </p>
    </div>
  </div>
)

export const Noise: Story = () => (
  <div className="relative min-h-[400px]">
    <NoiseOverlay className="!absolute !inset-0" />
    <div className="relative z-10 p-8">
      <h3 className="font-heading text-xl mb-2">Noise Overlay</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        SVG fractal noise texture using feTurbulence. Creates film grain effect with{' '}
        <code className="text-accent-secondary">mix-blend-mode: overlay</code>
      </p>
    </div>
  </div>
)

export const ScanlineEffect: Story = () => (
  <div className="relative min-h-[400px]">
    <Scanlines className="!absolute !inset-0" />
    <div className="relative z-10 p-8">
      <h3 className="font-heading text-xl mb-2">Scanlines</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        CRT-style horizontal lines using repeating-linear-gradient. 2px transparent, 2px dark,
        repeating. Opacity via{' '}
        <code className="text-accent-secondary">--effect-scanlines-opacity</code>
      </p>
    </div>
  </div>
)

export const ParticleEffect: Story = () => (
  <div className="relative min-h-[400px]">
    <Particles className="!absolute !inset-0" count={15} />
    <div className="relative z-10 p-8">
      <h3 className="font-heading text-xl mb-2">Particles</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        Floating dots that rise upward using CSS keyframe animations. Each particle has randomized
        position, duration, and delay. Alternates between primary and secondary accent colors.
      </p>
    </div>
  </div>
)

export const AllEffectsCombined: Story = () => (
  <div className="relative min-h-[400px]">
    <EffectsContainer
      className="[&>*]:!absolute [&>*]:!inset-0"
      enableGrid
      enableNoise
      enableScanlines
      enableParticles
    />
    <div className="relative z-10 p-8">
      <h3 className="font-heading text-xl mb-4">All Effects Combined</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-4">
        The full visual effect stack layered together. Z-index order: Grid (1) → Noise (2) →
        Scanlines (3) → Particles (5)
      </p>
      <div className="space-y-2 font-mono text-xs text-accent-secondary">
        <div>Grid: 60px squares at 3% opacity</div>
        <div>Noise: Fractal turbulence at 4% opacity</div>
        <div>Scanlines: 4px repeat at 8% opacity</div>
        <div>Particles: 25 dots at 40% opacity</div>
      </div>
    </div>
  </div>
)

export const EffectsToggle: Story = () => (
  <div className="relative min-h-[400px]">
    <EffectsContainer
      className="[&>*]:!absolute [&>*]:!inset-0"
      enableGrid={true}
      enableNoise={false}
      enableScanlines={true}
      enableParticles={false}
    />
    <div className="relative z-10 p-8">
      <h3 className="font-heading text-xl mb-4">Selective Effects</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-4">
        EffectsContainer accepts boolean props to toggle individual effects. This example shows only
        Grid + Scanlines (no Noise or Particles).
      </p>
      <div className="space-y-1 font-mono text-xs">
        <div className="text-accent">✓ enableGrid</div>
        <div className="text-muted-foreground">✗ enableNoise</div>
        <div className="text-accent">✓ enableScanlines</div>
        <div className="text-muted-foreground">✗ enableParticles</div>
      </div>
    </div>
  </div>
)
