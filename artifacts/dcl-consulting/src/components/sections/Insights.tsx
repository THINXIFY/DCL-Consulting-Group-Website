import { useEffect, useRef } from 'react';
import { insights } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Insights() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclInsights__fadeUp', '.dclInsights__row'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclInsights__fadeUp',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
        },
      );

      gsap.fromTo(
        '.dclInsights__row',
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclInsights__list', start: 'top 78%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="insights" ref={rootRef} aria-labelledby="insights-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-8 border-b border-[#080a0d]/12 pb-14 md:flex-row md:items-end">
          <div>
            <p data-testid="text-insights-eyebrow" className="dclHome__eyebrow dclInsights__fadeUp mb-5 text-[#4f718c]">
              Perspective
            </p>
            <h2 id="insights-title" className="dclHome__display dclInsights__fadeUp max-w-[600px] text-[clamp(2.4rem,4.8vw,4.2rem)] leading-[.96] tracking-[-.04em] text-[#080a0d]">
              How we think about decisions.
            </h2>
          </div>
          <p className="dclInsights__fadeUp max-w-[300px] text-[14px] leading-6 text-[#6b737a]">
            A few of the principles that shape how DCL approaches independent analysis.
          </p>
        </div>

        <div className="dclInsights__list mt-4">
          {insights.map((item) => (
            <div
              key={item.theme}
              data-testid={`row-insight-${item.theme.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '')}`}
              className="dclInsights__row grid gap-4 border-b border-[#080a0d]/12 py-10 lg:grid-cols-[.32fr_1fr] lg:gap-16"
            >
              <p className="dclHome__eyebrow text-[#8497a3]">{item.theme}</p>
              <p className="dclHome__display max-w-[760px] text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.2] tracking-[-.02em] text-[#171714]">
                {item.statement}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
