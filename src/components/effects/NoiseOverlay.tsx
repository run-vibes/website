import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface NoiseOverlayProps extends Omit<ComponentProps<'div'>, 'children'> {}

const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

export function NoiseOverlay({ className, ...props }: NoiseOverlayProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[2]', className)}
      style={{
        backgroundImage: noiseSvg,
        opacity: 'var(--effect-noise-opacity)',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
