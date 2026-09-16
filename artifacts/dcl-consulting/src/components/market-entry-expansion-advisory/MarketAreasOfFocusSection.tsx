import { useEffect, useRef } from 'react';
import { marketAreasOfFocus } from '@/data/market-entry-expansion-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function MarketAreasOfFocusSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMeFocus__revealLine', '.dclMeFocus__fadeUp', '.dclMeFocus__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMeFocus__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 80%' } },
      );
      gsap.fromTo(
        '.dclMeFocus__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 74%' } },
      );
      gsap.fromTo(
        '.dclMeFocus__column',
        { autoAlpha: 0, x: 16 },
        { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 66%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="market-areas-of-focus" ref={rootRef} aria-labelledby="market-focus-title" className="bg-[#f2f4f6] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[460px]">
          <p className="dclHome__eyebrow dclMeFocus__fadeUp text-[#6b737a]">{marketAreasOfFocus.label}</p>
          <h2 id="market-focus-title" className="dclHome__display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclMeFocus__revealLine block">{marketAreasOfFocus.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclMeFocus__revealLine block">{marketAreasOfFocus.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 divide-y divide-[#080a0d]/14 border-t border-[#080a0d]/14 sm:grid-cols-2 sm:divide-y-0 lg:mt-14 lg:grid-cols-4 lg:divide-x">
          {marketAreasOfFocus.areas.map((area) => (
            <div key={area.name} data-testid={`market-focus-area-${slug(area.name)}`} className="dclMeFocus__column py-7 sm:py-8 sm:pr-7 lg:py-0 lg:pl-7 lg:pt-8 lg:first:pl-0">
              <p className="dclHome__eyebrow text-[#8bbfe8]">{area.name}</p>
              <p className="mt-3 max-w-[28ch] text-[16px] leading-6 text-[#35404a]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
