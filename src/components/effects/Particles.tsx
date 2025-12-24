import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface ParticlesProps extends Omit<ComponentProps<'div'>, 'children'> {
  count?: number
}

// Pre-generate stable particle configs to avoid array index key issues
function generateParticleConfigs(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `particle-${i}`,
    left: `${(i * 4) % 100}%`,
    duration: 15 + (i % 10),
    delay: -(i * 0.8),
    isAccent: i % 2 === 0,
  }))
}

export function Particles({ count = 25, className, ...props }: ParticlesProps) {
  const particles = generateParticleConfigs(count)

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-[5] overflow-hidden', className)}
      aria-hidden="true"
      {...props}
    >
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: var(--effect-particle-opacity);
            transform: translateY(90vh) scale(1);
          }
          90% {
            opacity: var(--effect-particle-opacity);
          }
          100% {
            transform: translateY(-10vh) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          data-particle
          className="absolute w-[3px] h-[3px] rounded-full opacity-0"
          style={{
            left: particle.left,
            background: particle.isAccent
              ? 'var(--color-accent-primary)'
              : 'var(--color-accent-secondary)',
            boxShadow: `0 0 6px ${particle.isAccent ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}`,
            animation: `float-up ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
