import { useEffect, useRef, useState } from 'react';
import { whatWeValue } from '@/data/partners-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function WhatWeValue() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhatWeValue__revealLine', '.dclWhatWeValue__fadeUp', '.dclWhatWeValue__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWhatWeValue__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclWhatWeValue__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclWhatWeValue__row',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhatWeValue__list', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-we-value" ref={rootRef} aria-labelledby="what-we-value-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
        <div className={isDesktop ? 'lg:sticky lg:top-28 lg:self-start' : undefined}>
          <p data-testid="text-what-we-value-eyebrow" className="dclHome__eyebrow mb-5 text-[#4f718c]">
            {whatWeValue.eyebrow}
          </p>
          <h2 id="what-we-value-title" className="dclHome__display max-w-[420px] text-[clamp(2rem,3.8vw,3rem)] leading-[1.1] tracking-[-.03em] text-[#080a0d]">
            {whatWeValue.headlineLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="dclWhatWeValue__revealLine block">{line}</span>
              </span>
            ))}
          </h2>
          <p className="dclWhatWeValue__fadeUp mt-6 max-w-[380px] text-[16px] leading-7 text-[#35404a]">{whatWeValue.intro}</p>
        </div>

        <div className="dclWhatWeValue__list border-t border-[#080a0d]/12" onMouseLeave={() => setHoveredIndex(null)}>
          {whatWeValue.principles.map((principle, index) => {
            const active = hoveredIndex === index;
            return (
              <div
                key={principle.name}
                data-testid={`what-we-value-${slug(principle.name)}`}
                tabIndex={0}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                className="dclWhatWeValue__row group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-[#080a0d]/12 py-7 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#4f718c]"
              >
                <h3
                  className="dclHome__display text-[1.4rem] leading-none tracking-[-.02em] transition-colors duration-300"
                  style={{ color: active ? '#4f718c' : '#080a0d' }}
                >
                  {principle.name}
                </h3>
                <p className="max-w-[420px] flex-1 text-[15px] leading-6 text-[#4b545c]">{principle.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
