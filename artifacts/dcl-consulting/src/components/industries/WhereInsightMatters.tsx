import { useEffect, useRef } from 'react';
import { whereInsightMatters } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function WhereInsightMatters() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhereInsightMatters__revealLine', '.dclWhereInsightMatters__fadeUp', '.dclWhereInsightMatters__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWhereInsightMatters__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWhereInsightMatters__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclWhereInsightMatters__row',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhereInsightMatters__list', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="where-insight-matters" ref={rootRef} aria-labelledby="where-insight-matters-title" className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 border-b border-[#080a0d]/12 pb-12 md:flex-row md:items-end">
          <div>
            <p className="dclHome__eyebrow dclWhereInsightMatters__fadeUp text-[#6b737a]">{whereInsightMatters.label}</p>
            <h2
              id="where-insight-matters-title"
              className="dclHome__display mt-4 max-w-[560px] text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]"
            >
              <span className="block overflow-hidden"><span className="dclWhereInsightMatters__revealLine block">{whereInsightMatters.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWhereInsightMatters__revealLine block">{whereInsightMatters.headlineLines[1]}</span></span>
            </h2>
          </div>
        </div>

        <div className="dclWhereInsightMatters__list">
          {whereInsightMatters.items.map((item) => (
            <div
              key={item}
              data-testid={`where-insight-item-${slug(item)}`}
              tabIndex={0}
              className="dclWhereInsightMatters__row group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-[#080a0d]/12 py-7 outline-none transition-colors duration-300 hover:border-[#8bbfe8] focus-visible:border-[#8bbfe8]"
            >
              <p className="dclHome__display text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.2] tracking-[-.015em] text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
                {item}
              </p>
              <span
                aria-hidden="true"
                className="text-[15px] text-[#8497a3] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#4f718c] group-focus-visible:translate-x-1 group-focus-visible:text-[#4f718c]"
              >
                &#8594;
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
