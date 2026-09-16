import { useEffect, useRef } from 'react';
import { whatWeLookFor } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function WhatWeLookFor() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclLookFor__revealLine', '.dclLookFor__rule', '.dclLookFor__factor'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclLookFor__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclLookFor__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclLookFor__factor',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclLookFor__grid', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-we-look-for" ref={rootRef} aria-labelledby="what-we-look-for-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[640px]">
          <h2 id="what-we-look-for-title" className="dclHome__display text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.08] tracking-[-.03em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclLookFor__revealLine block">{whatWeLookFor.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclLookFor__revealLine block">{whatWeLookFor.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="dclLookFor__rule mt-10 h-px w-full origin-left bg-[#080a0d]/14 lg:mt-12" />

        <div className="dclLookFor__grid mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-[#080a0d]/12">
          {whatWeLookFor.factors.map((factor) => (
            <div key={factor.name} data-testid={`look-for-factor-${slug(factor.name)}`} className="dclLookFor__factor border-b border-[#080a0d]/12 py-8 lg:border-b-0 lg:px-8 lg:py-10 lg:first:pl-0">
              <p className="dclHome__eyebrow text-[#8bbfe8]">{factor.name}</p>
              <p className="mt-3 max-w-[28ch] text-[16px] leading-7 text-[#35404a]">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
