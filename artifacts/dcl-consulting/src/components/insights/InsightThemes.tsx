import { useEffect, useRef } from 'react';
import { insightThemes } from '@/data/insights-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function InsightThemes() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclInsightThemes__fadeUp', '.dclInsightThemes__item'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclInsightThemes__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclInsightThemes__item',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', scrollTrigger: { trigger: '.dclInsightThemes__list', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="insight-themes" ref={rootRef} aria-labelledby="insight-themes-title" className="border-t border-[#080a0d]/10 bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <h2
          id="insight-themes-title"
          data-testid="text-insight-themes-title"
          className="dclHome__display dclInsightThemes__fadeUp max-w-[540px] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]"
        >
          Explore by perspective.
        </h2>

        <ul className="dclInsightThemes__list mt-11 flex flex-wrap gap-x-10 gap-y-5 lg:gap-x-14">
          {insightThemes.map((theme) => (
            <li key={theme} className="dclInsightThemes__item">
              <a
                href="#latest-perspectives"
                data-testid={`link-theme-${slug(theme)}`}
                className="group relative inline-block pb-2 text-[15px] font-medium uppercase tracking-[.06em] text-[#080a0d]/55 outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {theme}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#8bbfe8] transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
