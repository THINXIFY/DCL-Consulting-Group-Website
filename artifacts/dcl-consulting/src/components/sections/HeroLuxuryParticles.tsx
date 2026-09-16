import { useMemo, type CSSProperties } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  blurred: boolean;
  color: string;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  opMin: number;
  opMax: number;
}

// Soft white and baby-blue only - no saturated/bright blue, which would
// start reading as a tech/gaming accent rather than an atmospheric detail.
const PARTICLE_COLORS = ['#ffffff', '#ffffff', '#c6e3fa'];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: randomBetween(0, 100),
    top: randomBetween(0, 100),
    size: randomBetween(1, 2.2),
    blurred: Math.random() < 0.25,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    duration: randomBetween(15, 35),
    delay: -randomBetween(0, 35),
    dx: randomBetween(-14, 14),
    dy: -randomBetween(18, 50),
    opMin: randomBetween(0.08, 0.12),
    opMax: randomBetween(0.16, 0.25),
  }));
}

/**
 * Ambient, non-interactive particle layer for the homepage hero. No
 * pointer tracking, no glow - just slow, barely-noticeable drift, so it
 * reads as atmosphere rather than an effect. Skipped entirely under
 * reduced motion.
 */
export function HeroLuxuryParticles() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 640px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const count = isDesktop ? 30 : isTablet ? 18 : 10;
  const particles = useMemo(() => generateParticles(count), [count]);

  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="dclHeroLux__particle"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
              opacity: particle.opMin,
              filter: particle.blurred ? 'blur(0.6px)' : undefined,
              '--lp-dur': `${particle.duration}s`,
              '--lp-delay': `${particle.delay}s`,
              '--lp-dx': `${particle.dx}px`,
              '--lp-dy': `${particle.dy}px`,
              '--lp-op-min': particle.opMin,
              '--lp-op-max': particle.opMax,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
