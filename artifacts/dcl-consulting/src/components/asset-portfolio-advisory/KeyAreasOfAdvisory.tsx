import { useEffect, useRef } from 'react';
import { Gem, Layers, Shield, Target } from 'lucide-react';
import { keyAreasOfAdvisory } from '@/data/asset-portfolio-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

const ICONS = [Layers, Gem, Shield, Target];

export function KeyAreasOfAdvisory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclKeyAreas__revealLine', '.dclKeyAreas__fadeUp', '.dclKeyAreas__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclKeyAreas__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclKeyAreas__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclKeyAreas__column',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="key-areas-of-advisory" ref={rootRef} aria-labelledby="key-areas-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[520px]">
          <p className="dclHome__eyebrow dclKeyAreas__fadeUp text-[#9ca3aa]">{keyAreasOfAdvisory.label}</p>
          <h2 id="key-areas-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclKeyAreas__revealLine block">{keyAreasOfAdvisory.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclKeyAreas__revealLine block">{keyAreasOfAdvisory.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {keyAreasOfAdvisory.areas.map((area, index) => {
            const Icon = ICONS[index] ?? Layers;
            return (
              <div key={area.name} data-testid={`key-area-${slug(area.name)}`} className="dclKeyAreas__column border-t border-white/14 pt-6">
                <Icon size={18} strokeWidth={1.3} className="text-[#8bbfe8]" aria-hidden="true" />
                <p className="dclHome__eyebrow mt-4 text-white/90">{area.name}</p>
                <p className="mt-3 max-w-[30ch] text-[16px] leading-6 text-white/55">{area.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
