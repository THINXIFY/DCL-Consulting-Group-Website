import { useEffect, useRef } from 'react';
import { investmentFocus } from '@/data/private-capital-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

export function InvestmentFocusSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFocus__revealLine', '.dclFocus__fadeUp', '.dclFocus__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclFocus__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclFocus__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclFocus__column',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="investment-focus" ref={rootRef} aria-labelledby="focus-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[520px]">
          <p className="dclHome__eyebrow dclFocus__fadeUp text-[#6b737a]">{investmentFocus.label}</p>
          <h2 id="focus-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclFocus__revealLine block">{investmentFocus.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclFocus__revealLine block">{investmentFocus.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 divide-y divide-[#080a0d]/14 border-t border-[#080a0d]/14 sm:grid-cols-2 sm:divide-y-0 lg:mt-14 lg:grid-cols-4 lg:divide-x">
          {investmentFocus.areas.map((area) => (
            <div key={area.name} data-testid={`focus-area-${slug(area.name)}`} className="dclFocus__column py-6 sm:py-8 sm:pr-6 lg:py-0 lg:pl-6 lg:pt-8 lg:first:pl-0">
              <p className="dclHome__eyebrow text-[#8bbfe8]">{area.name}</p>
              <p className="mt-3 max-w-[28ch] text-[16px] leading-6 text-[#35404a]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
