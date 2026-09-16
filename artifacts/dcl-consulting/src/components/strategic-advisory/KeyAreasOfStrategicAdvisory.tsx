import { useEffect, useRef } from 'react';
import { Compass, Gem, Layers, Users } from 'lucide-react';
import { keyAreasOfStrategicAdvisory } from '@/data/strategic-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

const ICONS = [Compass, Layers, Users, Gem];

export function KeyAreasOfStrategicAdvisory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclKeyStrategic__revealLine', '.dclKeyStrategic__fadeUp', '.dclKeyStrategic__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclKeyStrategic__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclKeyStrategic__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclKeyStrategic__column',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="key-areas-of-strategic-advisory" ref={rootRef} aria-labelledby="key-strategic-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[560px]">
          <p className="dclHome__eyebrow dclKeyStrategic__fadeUp text-[#9ca3aa]">{keyAreasOfStrategicAdvisory.label}</p>
          <h2 id="key-strategic-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclKeyStrategic__revealLine block">{keyAreasOfStrategicAdvisory.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclKeyStrategic__revealLine block">{keyAreasOfStrategicAdvisory.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {keyAreasOfStrategicAdvisory.areas.map((area, index) => {
            const Icon = ICONS[index] ?? Compass;
            return (
              <div key={area.name} data-testid={`key-strategic-area-${slug(area.name)}`} className="dclKeyStrategic__column border-t border-white/14 pt-7">
                <Icon size={18} strokeWidth={1.3} className="text-[#8bbfe8]" aria-hidden="true" />
                <p className="dclHome__eyebrow mt-5 text-white/90">{area.name}</p>
                <p className="mt-3 max-w-[30ch] text-[16px] leading-6 text-white/55">{area.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
