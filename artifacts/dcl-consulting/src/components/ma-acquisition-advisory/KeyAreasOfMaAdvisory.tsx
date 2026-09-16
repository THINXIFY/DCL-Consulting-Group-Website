import { useEffect, useRef } from 'react';
import { Layers, Merge, Search, Target } from 'lucide-react';
import { keyAreasOfMaAdvisory } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

const ICONS = [Target, Search, Layers, Merge];

export function KeyAreasOfMaAdvisory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMaKeyAreas__revealLine', '.dclMaKeyAreas__fadeUp', '.dclMaKeyAreas__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMaKeyAreas__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclMaKeyAreas__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclMaKeyAreas__column',
        { autoAlpha: 0, x: -12 },
        { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="ma-key-areas" ref={rootRef} aria-labelledby="ma-key-areas-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[520px]">
          <p className="dclHome__eyebrow dclMaKeyAreas__fadeUp text-[#9ca3aa]">{keyAreasOfMaAdvisory.label}</p>
          <h2 id="ma-key-areas-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.08] tracking-[-.02em]">
            <span className="block overflow-hidden"><span className="dclMaKeyAreas__revealLine block">{keyAreasOfMaAdvisory.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclMaKeyAreas__revealLine block">{keyAreasOfMaAdvisory.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 divide-y divide-white/12 sm:grid-cols-2 sm:divide-y-0 lg:mt-14 lg:grid-cols-4 lg:divide-x lg:divide-white/12">
          {keyAreasOfMaAdvisory.areas.map((area, index) => {
            const Icon = ICONS[index] ?? Target;
            return (
              <div key={area.name} data-testid={`ma-key-area-${slug(area.name)}`} className="dclMaKeyAreas__column py-6 sm:py-8 sm:pr-6 lg:py-0 lg:pl-6 lg:pt-8 lg:first:pl-0">
                <Icon size={17} strokeWidth={1.3} className="text-[#8bbfe8]" aria-hidden="true" />
                <p className="dclHome__eyebrow mt-4 text-white/90">{area.name}</p>
                <p className="mt-3 max-w-[28ch] text-[16px] leading-6 text-white/55">{area.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
