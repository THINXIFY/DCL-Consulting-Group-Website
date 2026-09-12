import { useEffect, useRef, useState } from 'react';
import { whatDefinesDcl } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhatDefinesDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhatDefines__revealLine', '.dclWhatDefines__fadeUp', '.dclWhatDefines__cell', '.dclWhatDefines__closing'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhatDefines__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWhatDefines__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclWhatDefines__cell',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
      gsap.fromTo(
        '.dclWhatDefines__closing',
        { autoAlpha: 0, y: 30, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhatDefines__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-defines-dcl" ref={rootRef} aria-labelledby="defines-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-defines-eyebrow" className="dclHome__eyebrow dclWhatDefines__revealLine mb-6 overflow-hidden text-[#6b737a]">
          What defines DCL
        </p>
        <h2 id="defines-title" className="dclHome__display max-w-[880px] text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1] tracking-[-.04em] text-[#080a0d]">
          <span className="block overflow-hidden"><span className="dclWhatDefines__revealLine block">The quality of the view</span></span>
          <span className="block overflow-hidden"><span className="dclWhatDefines__revealLine block">depends on the standard behind it.</span></span>
        </h2>
        <p className="dclWhatDefines__fadeUp mt-8 max-w-[520px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
          DCL's work is guided by a small number of principles that shape how opportunities are examined and how conclusions are communicated.
        </p>

        <div className="mt-20 grid gap-x-16 gap-y-16 border-t border-[#080a0d]/15 pt-16 sm:grid-cols-2">
          {whatDefinesDcl.map((item, index) => {
            const active = activeIndex === index;
            const dimmed = activeIndex !== null && !active;
            return (
              <div
                key={item.title}
                data-testid={`defines-cell-${slug(item.title)}`}
                data-active={active}
                tabIndex={0}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onBlur={() => setActiveIndex(null)}
                className="dclWhatDefines__cell outline-none transition-[opacity,transform] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                style={{ opacity: dimmed ? 0.5 : 1, transform: active ? 'translateY(-4px)' : 'translateY(0)' }}
              >
                <h3 className="dclHome__display max-w-[380px] text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
                  {item.title}
                </h3>
                <span
                  className="mt-5 block h-px bg-[#8bbfe8] transition-transform duration-500"
                  style={{ width: '72px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                />
                <p className="mt-5 max-w-[420px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{item.copy}</p>
              </div>
            );
          })}
        </div>

        <p
          data-testid="text-defines-closing"
          className="dclHome__display dclWhatDefines__closing mt-24 max-w-[720px] text-[clamp(2rem,4vw,3.4rem)] leading-[1.15] tracking-[-.03em] text-[#080a0d]"
        >
          Independent thinking.
          <br />
          Structured judgement.
          <br />
          Clear communication.
        </p>
      </div>
    </section>
  );
}
