import { useEffect, useMemo, useRef, type CSSProperties, type RefObject } from 'react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  opMin: number;
  opMax: number;
}

const PARTICLE_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#c6e3fa', '#8bbfe8'];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateParticles(count: number, biasTextZone: boolean): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    const left = randomBetween(0, 100);
    const top = randomBetween(0, 100);
    const inTextZone = biasTextZone && left < 55 && top > 18 && top < 82;
    const opMin = randomBetween(0.05, 0.09) * (inTextZone ? 0.4 : 1);
    const opMax = randomBetween(0.14, 0.22) * (inTextZone ? 0.4 : 1);
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(40, 130);
    const duration = randomBetween(18, 35);
    return {
      id,
      left,
      top,
      size: randomBetween(1, 2),
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      duration,
      delay: -randomBetween(0, duration),
      dx: Math.cos(angle) * distance * 0.35,
      dy: -Math.abs(Math.sin(angle) * distance),
      opMin,
      opMax,
    };
  });
}

export function HeroBackground({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const particlesLayerRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 640px)');
  const isFinePointer = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const particleCount = isDesktop ? 32 : isTablet ? 16 : 9;
  const particles = useMemo(() => generateParticles(particleCount, isDesktop), [particleCount, isDesktop]);

  useEffect(() => {
    const section = rootRef.current;
    if (!section || !particlesLayerRef.current || !glowLayerRef.current) return;
    if (prefersReducedMotion || !isFinePointer) return;
    ensureGsapRegistered();

    const particlesTarget = particlesLayerRef.current;
    const glowTarget = glowLayerRef.current;
    const xToParticles = gsap.quickTo(particlesTarget, 'x', { duration: 0.9, ease: 'power2.out' });
    const yToParticles = gsap.quickTo(particlesTarget, 'y', { duration: 0.9, ease: 'power2.out' });
    const xToGlow = gsap.quickTo(glowTarget, 'x', { duration: 1.2, ease: 'power2.out' });
    const yToGlow = gsap.quickTo(glowTarget, 'y', { duration: 1.2, ease: 'power2.out' });

    function handlePointerMove(event: PointerEvent) {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      xToParticles(nx * 12);
      yToParticles(ny * 12);
      xToGlow(nx * 20);
      yToGlow(ny * 20);
    }

    section.addEventListener('pointermove', handlePointerMove);
    return () => {
      section.removeEventListener('pointermove', handlePointerMove);
      gsap.set([particlesTarget, glowTarget], { clearProps: 'transform' });
    };
  }, [rootRef, prefersReducedMotion, isFinePointer]);

  return (
    <div className="dclHeroBg pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="dclHeroBg__lines" />
      <div ref={glowLayerRef} className="dclHeroBg__glow" />
      <div ref={particlesLayerRef} className="absolute inset-0">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="dclHeroBg__particle"
            style={
              {
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                opacity: particle.opMin,
                '--p-dur': `${particle.duration}s`,
                '--p-delay': `${particle.delay}s`,
                '--p-dx': `${particle.dx}px`,
                '--p-dy': `${particle.dy}px`,
                '--p-op-min': particle.opMin,
                '--p-op-max': particle.opMax,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
