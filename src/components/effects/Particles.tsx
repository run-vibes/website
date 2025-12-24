import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'

interface ParticlesProps extends Omit<ComponentProps<'div'>, 'children'> {
  count?: number
}

export function Particles({ count = 25, className, ...props }: ParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => {
    const left = `${(i * 4) % 100}%`
    const duration = 15 + (i % 10)
    const delay = -(i * 0.8)
    const isAccent = i % 2 === 0

    return (
      <div
        key={i}
        data-particle
        className="absolute w-[3px] h-[3px] rounded-full opacity-0"
        style={{
          left,
          background: isAccent ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)',
          boxShadow: `0 0 6px ${isAccent ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}`,
          animation: `float-up ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })

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
      {particles}
    </div>
  )
}
