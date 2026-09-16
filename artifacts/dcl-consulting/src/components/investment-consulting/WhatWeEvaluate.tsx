import { useEffect, useRef } from 'react';
import { whatWeEvaluate } from '@/data/investment-consulting-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function WhatWeEvaluate() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWeEvaluate__revealLine', '.dclWeEvaluate__fadeUp', '.dclWeEvaluate__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWeEvaluate__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWeEvaluate__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclWeEvaluate__column',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-we-evaluate" ref={rootRef} aria-labelledby="evaluate-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[420px]">
            <p className="dclHome__eyebrow dclWeEvaluate__fadeUp text-[#6b737a]">{whatWeEvaluate.label}</p>
            <h2 id="evaluate-title" className="dclHome__display mt-5 text-[clamp(2.2rem,3.8vw,3.2rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWeEvaluate__revealLine block">{whatWeEvaluate.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWeEvaluate__revealLine block">{whatWeEvaluate.headlineLines[1]}</span></span>
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {whatWeEvaluate.areas.map((area) => (
            <div key={area.name} data-testid={`evaluate-area-${slug(area.name)}`} className="dclWeEvaluate__column border-t-2 border-[#8bbfe8] pt-5">
              <p className="dclHome__eyebrow text-[#080a0d]">{area.name}</p>
              <p className="mt-3 max-w-[28ch] text-[16px] leading-6 text-[#35404a]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
