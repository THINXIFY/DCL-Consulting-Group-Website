import { useEffect, useRef } from 'react';
import { industriesIntro } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function IndustriesIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclIndustriesIntro__revealLine', '.dclIndustriesIntro__fadeUp', '.dclIndustriesIntro__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclIndustriesIntro__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclIndustriesIntro__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclIndustriesIntro__principle',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclIndustriesIntro__principles', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="industries-intro" ref={rootRef} aria-labelledby="industries-intro-title" className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p data-testid="text-industries-intro-eyebrow" className="dclHome__eyebrow dclIndustriesIntro__fadeUp text-[#6b737a]">
              {industriesIntro.eyebrow}
            </p>
            <h2
              id="industries-intro-title"
              className="dclHome__display mt-5 text-[clamp(2.1rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-.02em] text-[#080a0d]"
            >
              <span className="block overflow-hidden"><span className="dclIndustriesIntro__revealLine block">{industriesIntro.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIndustriesIntro__revealLine block">{industriesIntro.headlineLines[1]}</span></span>
            </h2>
            <p data-testid="text-industries-intro-copy" className="dclIndustriesIntro__fadeUp mt-6 max-w-[520px] text-[17px] leading-[1.65] text-[#35404a]">
              {industriesIntro.copy}
            </p>
          </div>

          <div className="dclIndustriesIntro__principles lg:col-span-5">
            <div className="flex flex-col divide-y divide-[#080a0d]/10 border-t border-[#080a0d]/10 sm:flex-row sm:divide-x sm:divide-y-0 sm:border-t-0">
              {industriesIntro.principles.map((principle) => (
                <div key={principle} data-testid={`text-industries-intro-principle-${principle.toLowerCase().replaceAll(' ', '-')}`} className="dclIndustriesIntro__principle flex-1 py-5 sm:px-6 sm:py-0 first:sm:pl-0">
                  <p className="dclHome__eyebrow text-[#8497a3]">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
