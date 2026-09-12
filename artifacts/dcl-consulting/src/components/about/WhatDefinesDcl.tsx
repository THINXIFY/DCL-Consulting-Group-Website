import { useEffect, useRef, useState } from 'react';
import { whatDefinesDcl } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhatDefinesDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhatDefines__revealLine', '.dclWhatDefines__fadeUp', '.dclWhatDefines__row', '.dclWhatDefines__closing'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhatDefines__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWhatDefines__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclWhatDefines__row',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 58%' } },
      );
      // Appears in the sticky left column only once the row list on the
      // right has mostly scrolled past, so it reads as the conclusion of
      // reading through the principles rather than being visible upfront.
      gsap.fromTo(
        '.dclWhatDefines__closing',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rowsRef.current, start: 'bottom 75%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-defines-dcl" ref={rootRef} aria-labelledby="defines-title" className="relative bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <p data-testid="text-defines-eyebrow" className="dclHome__eyebrow dclWhatDefines__revealLine mb-6 overflow-hidden text-[#6b737a]">
              What defines DCL
            </p>
            <h2 id="defines-title" className="dclHome__display max-w-[420px] text-[clamp(2.4rem,4.2vw,3.4rem)] leading-[1.02] tracking-[-.035em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWhatDefines__revealLine block">The quality of the view</span></span>
              <span className="block overflow-hidden"><span className="dclWhatDefines__revealLine block">depends on the standard behind it.</span></span>
            </h2>
            <p className="dclWhatDefines__fadeUp mt-7 max-w-[380px] text-[16px] leading-7 text-[#35404a]">
              DCL's work is guided by a small number of principles that shape how opportunities are examined and how conclusions are communicated.
            </p>

            <div className="dclWhatDefines__closing mt-16 border-t border-[#080a0d]/15 pt-8">
              <p
                data-testid="text-defines-closing"
                className="dclHome__display max-w-[340px] text-[clamp(1.6rem,2.4vw,2.15rem)] leading-[1.15] tracking-[-.02em] text-[#080a0d]"
              >
                Independent thinking.
                <br />
                Structured judgement.
                <br />
                Clear communication.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div ref={rowsRef} className="border-t border-[#080a0d]/14">
              {whatDefinesDcl.map((item, index) => {
                const active = isDesktop ? activeIndex === index : true;
                const dimmed = isDesktop && activeIndex !== null && !active;
                return (
                  <div
                    key={item.title}
                    data-testid={`defines-row-${slug(item.title)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setActiveIndex(index)}
                    onFocus={() => isDesktop && setActiveIndex(index)}
                    onMouseLeave={() => isDesktop && setActiveIndex(null)}
                    onBlur={() => isDesktop && setActiveIndex(null)}
                    className="dclWhatDefines__row relative overflow-hidden border-b border-[#080a0d]/14 py-9 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-11"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 bg-[#e4e9ee] transition-opacity duration-500"
                      style={{ opacity: active && isDesktop ? 1 : 0 }}
                    />
                    <div className="relative px-1 transition-[opacity,transform] duration-400" style={{ opacity: dimmed ? 0.5 : 1, transform: active && isDesktop ? 'translateX(10px)' : 'translateX(0)' }}>
                      <h3 className="dclHome__display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-[1.02] tracking-[-.03em] text-[#080a0d]">{item.title}</h3>
                      <div
                        className="overflow-hidden transition-all duration-500"
                        style={{
                          maxHeight: active ? '160px' : isDesktop ? '0px' : '160px',
                          opacity: active || !isDesktop ? 1 : 0,
                          marginTop: active || !isDesktop ? '14px' : '0px',
                        }}
                      >
                        <p className="max-w-[52ch] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{item.copy}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white/70" />
    </section>
  );
}
