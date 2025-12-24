import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'
import { GeometricGrid } from './GeometricGrid'
import { NoiseOverlay } from './NoiseOverlay'
import { Particles } from './Particles'
import { Scanlines } from './Scanlines'

interface EffectsContainerProps extends Omit<ComponentProps<'div'>, 'children'> {
  enableGrid?: boolean
  enableNoise?: boolean
  enableScanlines?: boolean
  enableParticles?: boolean
}

export function EffectsContainer({
  enableGrid = true,
  enableNoise = true,
  enableScanlines = true,
  enableParticles = true,
  className,
  ...props
}: EffectsContainerProps) {
  return (
    <div className={cn('contents', className)} {...props}>
      {enableGrid && <GeometricGrid />}
      {enableNoise && <NoiseOverlay />}
      {enableScanlines && <Scanlines />}
      {enableParticles && <Particles />}
    </div>
  )
}
