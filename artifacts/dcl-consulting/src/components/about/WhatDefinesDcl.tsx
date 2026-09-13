import { useEffect, useRef } from 'react';
import { whatDefinesDcl } from '@/data/about-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhatDefinesDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDefines__revealLine', '.dclDefines__fadeUp', '.dclDefines__title', '.dclDefines__rule', '.dclDefines__desc', '.dclDefines__closingLine'], {
          clearProps: 'all',
        });
        gsap.set('.dclDefines__row', { backgroundColor: 'transparent' });
        return;
      }

      gsap.fromTo(
        '.dclDefines__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 76%' } },
      );
      gsap.fromTo(
        '.dclDefines__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 66%' } },
      );

      gsap.utils.toArray<HTMLElement>('.dclDefines__row').forEach((row) => {
        const title = row.querySelector('.dclDefines__title');
        const rule = row.querySelector('.dclDefines__rule');
        const desc = row.querySelector('.dclDefines__desc');

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.55 } });
        tl.to(title, { opacity: 1, x: 6 }, 0)
          .to(rule, { scaleX: 1 }, 0)
          .to(desc, { autoAlpha: 1, y: 0 }, 0)
          .to(row, { backgroundColor: '#e6ebf0' }, 0);

        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          end: 'bottom 42%',
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
          onLeave: () => tl.reverse(),
          onLeaveBack: () => tl.reverse(),
        });
      });

      gsap.fromTo(
        '.dclDefines__closingLine',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclDefines__closing', start: 'top 80%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="what-defines-dcl" ref={rootRef} aria-labelledby="defines-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <h2
              id="defines-title"
              className="dclHome__display max-w-[420px] text-[clamp(2.2rem,3.6vw,3.1rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]"
            >
              <span className="block overflow-hidden"><span className="dclDefines__revealLine block">{whatDefinesDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclDefines__revealLine block">{whatDefinesDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclDefines__fadeUp mt-6 max-w-[360px] text-[16px] leading-7 text-[#35404a]">{whatDefinesDcl.intro}</p>

            <div className="dclDefines__fadeUp mt-10 border-t border-[#080a0d]/15 pt-6">
              <p className="dclHome__eyebrow text-[#6b737a]">{whatDefinesDcl.brandStatement}</p>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border-t border-[#080a0d]/14">
              {whatDefinesDcl.principles.map((item) => (
                <div
                  key={item.title}
                  data-testid={`defines-row-${slug(item.title)}`}
                  className="dclDefines__row border-b border-[#080a0d]/14 px-2 py-9 transition-colors duration-500 lg:py-12"
                >
                  <h3 className="dclDefines__title dclHome__display inline-block text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.05] tracking-[-.025em] text-[#080a0d]" style={{ opacity: 0.55 }}>
                    {item.title}
                  </h3>
                  <div className="dclDefines__rule mt-4 h-px w-16 origin-left scale-x-0 bg-[#8bbfe8]" />
                  <p className="dclDefines__desc mt-5 max-w-[56ch] text-[16px] leading-7 text-[#35404a] sm:text-[17px]" style={{ opacity: isDesktop ? 0 : 1, transform: isDesktop ? 'translateY(8px)' : 'none' }}>
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-testid="text-defines-closing" className="dclDefines__closing mt-24 border-t border-[#080a0d]/15 pt-14 lg:mt-32">
          <p className="dclHome__display max-w-[900px] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.16] tracking-[-.025em] text-[#080a0d]">
            {whatDefinesDcl.closingLines.map((line) => (
              <span key={line} className="dclDefines__closingLine block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
