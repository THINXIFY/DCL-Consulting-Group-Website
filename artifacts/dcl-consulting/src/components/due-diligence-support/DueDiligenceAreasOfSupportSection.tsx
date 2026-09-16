import { useEffect, useRef } from 'react';
import { dueDiligenceAreasOfSupport } from '@/data/due-diligence-support-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function DueDiligenceAreasOfSupportSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDdSupport__revealLine', '.dclDdSupport__fadeUp', '.dclDdSupport__cell'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclDdSupport__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclDdSupport__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclDdSupport__cell',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="dd-areas-of-support" ref={rootRef} aria-labelledby="dd-support-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[520px]">
          <p className="dclHome__eyebrow dclDdSupport__fadeUp text-[#6b737a]">{dueDiligenceAreasOfSupport.label}</p>
          <h2 id="dd-support-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] tracking-[-.025em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclDdSupport__revealLine block">{dueDiligenceAreasOfSupport.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclDdSupport__revealLine block">{dueDiligenceAreasOfSupport.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 border-t border-l border-[#080a0d]/14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {dueDiligenceAreasOfSupport.areas.map((area) => (
            <div key={area.name} data-testid={`dd-support-area-${slug(area.name)}`} className="dclDdSupport__cell border-b border-r border-[#080a0d]/14 p-7 lg:p-8">
              <p className="dclHome__eyebrow text-[#8bbfe8]">{area.name}</p>
              <p className="mt-4 max-w-[30ch] text-[16px] leading-7 text-[#35404a]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
