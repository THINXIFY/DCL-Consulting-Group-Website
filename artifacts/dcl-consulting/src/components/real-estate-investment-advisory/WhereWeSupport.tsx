import { useEffect, useRef } from 'react';
import { whereWeSupport } from '@/data/real-estate-investment-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function WhereWeSupport() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSupport__revealLine', '.dclSupport__fadeUp', '.dclSupport__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclSupport__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclSupport__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclSupport__column',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="where-we-support" ref={rootRef} aria-labelledby="support-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[560px]">
          <p className="dclHome__eyebrow dclSupport__fadeUp text-[#6b737a]">{whereWeSupport.label}</p>
          <h2 id="support-title" className="dclHome__display mt-5 text-[clamp(2.2rem,3.8vw,3.2rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclSupport__revealLine block">{whereWeSupport.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclSupport__revealLine block">{whereWeSupport.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-[#080a0d]/14 border-t border-[#080a0d]/14 sm:grid-cols-2 sm:divide-y-0 lg:mt-16 lg:grid-cols-5 lg:divide-x">
          {whereWeSupport.areas.map((area) => (
            <div
              key={area.name}
              data-testid={`support-area-${slug(area.name)}`}
              className="dclSupport__column py-8 sm:py-10 sm:pr-6 lg:py-0 lg:pl-6 lg:pt-10 lg:first:pl-0"
            >
              <p className="dclHome__eyebrow text-[#8bbfe8]">{area.name}</p>
              <p className="mt-4 max-w-[28ch] text-[16px] leading-6 text-[#35404a]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
