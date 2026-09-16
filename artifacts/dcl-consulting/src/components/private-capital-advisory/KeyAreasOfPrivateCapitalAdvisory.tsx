import { useEffect, useRef } from 'react';
import { FileSearch, Gem, Layers, Target } from 'lucide-react';
import { keyAreasOfPrivateCapitalAdvisory } from '@/data/private-capital-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

const ICONS = [Target, Layers, FileSearch, Gem];

export function KeyAreasOfPrivateCapitalAdvisory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPcKeyAreas__revealLine', '.dclPcKeyAreas__fadeUp', '.dclPcKeyAreas__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPcKeyAreas__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclPcKeyAreas__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclPcKeyAreas__column',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="pc-key-areas" ref={rootRef} aria-labelledby="pc-key-areas-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[520px]">
          <p className="dclHome__eyebrow dclPcKeyAreas__fadeUp text-[#9ca3aa]">{keyAreasOfPrivateCapitalAdvisory.label}</p>
          <h2 id="pc-key-areas-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclPcKeyAreas__revealLine block">{keyAreasOfPrivateCapitalAdvisory.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclPcKeyAreas__revealLine block">{keyAreasOfPrivateCapitalAdvisory.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {keyAreasOfPrivateCapitalAdvisory.areas.map((area, index) => {
            const Icon = ICONS[index] ?? Target;
            return (
              <div key={area.name} data-testid={`pc-key-area-${slug(area.name)}`} className="dclPcKeyAreas__column border-t border-white/14 pt-6">
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
