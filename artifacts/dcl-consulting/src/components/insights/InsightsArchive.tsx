import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { insightsArchive } from '@/data/insights-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function InsightsArchive() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclInsightsArchive__fadeUp', '.dclInsightsArchive__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclInsightsArchive__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclInsightsArchive__row',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.dclInsightsArchive__list', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="insights-archive" ref={rootRef} aria-labelledby="insights-archive-title" className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 border-b border-[#080a0d]/12 pb-12 md:flex-row md:items-end">
          <div>
            <p data-testid="text-insights-archive-eyebrow" className="dclHome__eyebrow dclInsightsArchive__fadeUp text-[#6b737a]">
              All Insights
            </p>
            <h2
              id="insights-archive-title"
              className="dclHome__display dclInsightsArchive__fadeUp mt-4 max-w-[560px] text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]"
            >
              The full archive.
            </h2>
          </div>
        </div>

        <div className="dclInsightsArchive__list">
          {insightsArchive.map((item) => (
            <Link
              key={item.slug}
              href={`/insights/${item.slug}`}
              data-testid={`row-archive-${item.slug}`}
              className="dclInsightsArchive__row group grid grid-cols-1 gap-3 border-b border-[#080a0d]/12 py-9 outline-none transition-colors duration-300 hover:border-[#8bbfe8] focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:grid-cols-[.26fr_1fr_auto] lg:items-center lg:gap-10"
            >
              <p className="dclHome__eyebrow text-[#8497a3] transition-colors duration-300 group-hover:text-[#4f718c]">{item.category}</p>
              <div className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                <p className="dclHome__display text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.2] tracking-[-.015em] text-[#080a0d]">{item.title}</p>
                <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.6] text-[#6b737a]">{item.excerpt}</p>
              </div>
              <span className="mt-2 inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-[#080a0d]/60 transition-colors duration-300 group-hover:text-[#4f718c] lg:mt-0">
                Read
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
