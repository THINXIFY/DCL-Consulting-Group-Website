import { useEffect, useRef } from 'react';
import { whatHappensNext } from '@/data/contact-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

export function WhatHappensNext() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHappensNext__revealLine', '.dclHappensNext__fadeUp', '.dclHappensNext__rule', '.dclHappensNext__stage'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclHappensNext__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclHappensNext__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclHappensNext__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
      );
      gsap.fromTo(
        '.dclHappensNext__stage',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: '.dclHappensNext__stages', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-happens-next" ref={rootRef} aria-labelledby="what-happens-next-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <p className="dclHome__eyebrow dclHappensNext__fadeUp text-[#9ca3aa]">{whatHappensNext.label}</p>
            <h2 id="what-happens-next-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.8vw,3.2rem)] leading-[1.06] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclHappensNext__revealLine block">{whatHappensNext.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclHappensNext__revealLine block">{whatHappensNext.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="dclHappensNext__fadeUp max-w-[360px] text-[16px] leading-7 text-white/55">{whatHappensNext.supporting}</p>
          </div>
        </div>

        <div className="dclHappensNext__rule mt-12 h-px w-full origin-left bg-white/15 lg:mt-14" />

        <div className="dclHappensNext__stages mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 lg:divide-x lg:divide-white/12">
          {whatHappensNext.stages.map((stage) => (
            <div key={stage.name} data-testid={`happens-next-stage-${slug(stage.name)}`} className="dclHappensNext__stage lg:pl-8 lg:first:pl-0">
              <p className="dclHome__eyebrow text-white/90">{stage.name}</p>
              <p className="mt-4 max-w-[32ch] text-[16px] leading-7 text-white/55">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
