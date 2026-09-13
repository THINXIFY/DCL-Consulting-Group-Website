import { useEffect, useRef } from 'react';
import { companyFoundations } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function CompanyFoundations() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFoundations__revealLine', '.dclFoundations__fadeUp', '.dclFoundations__rule', '.dclFoundations__value', '.dclFoundations__anchorLine'], {
          clearProps: 'all',
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 74%' } });
      tl.fromTo('.dclFoundations__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.85, stagger: 0.09, ease: 'power4.out' })
        .fromTo('.dclFoundations__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.5');

      gsap.utils.toArray<HTMLElement>('.dclFoundations__fact').forEach((row, i) => {
        const rule = row.querySelector('.dclFoundations__rule');
        const value = row.querySelector('.dclFoundations__value');
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left center', duration: 0.7, ease: 'power2.out', delay: i * 0.05, scrollTrigger: { trigger: row, start: 'top 85%' } },
        );
        gsap.fromTo(
          value,
          { autoAlpha: 0, x: -10 },
          { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.05 + 0.08, scrollTrigger: { trigger: row, start: 'top 85%' } },
        );
      });

      gsap.fromTo(
        '.dclFoundations__anchorLine',
        { autoAlpha: 0, y: 18, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclFoundations__anchor', start: 'top 85%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="company-foundations" ref={rootRef} aria-labelledby="foundations-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <h2
              id="foundations-title"
              className="dclHome__display max-w-[380px] text-[clamp(2.2rem,3.6vw,3.1rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]"
            >
              <span className="block overflow-hidden"><span className="dclFoundations__revealLine block">{companyFoundations.headline}</span></span>
            </h2>
            <p className="dclFoundations__fadeUp mt-6 max-w-[360px] text-[16px] leading-7 text-[#35404a]">{companyFoundations.intro}</p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-[#080a0d]/14">
              {companyFoundations.facts.map((fact, index) => (
                <div
                  key={fact.label}
                  data-testid={`foundation-fact-${slug(fact.label)}`}
                  className="dclFoundations__fact grid grid-cols-1 gap-1 border-b border-[#080a0d]/14 py-6 sm:grid-cols-[200px_1fr] sm:items-baseline sm:gap-6"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#8a939b]">{fact.label}</p>
                  <div>
                    <div className="dclFoundations__rule mb-2 h-px w-10 origin-left scale-x-0 bg-[#8bbfe8] sm:hidden" />
                    <p
                      className={`dclFoundations__value text-[#080a0d] ${
                        index === 0 ? 'text-[clamp(1.3rem,2vw,1.6rem)] font-medium leading-tight' : 'text-[17px] leading-7'
                      }`}
                      style={{ fontFamily: index === 0 ? 'var(--app-font-sans)' : undefined }}
                    >
                      {fact.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-testid="text-foundations-anchor" className="dclFoundations__anchor mt-24 border-t border-[#080a0d]/14 pt-14 lg:mt-32">
          <p className="dclHome__display text-[clamp(2.4rem,6vw,5.2rem)] leading-[.98] tracking-[-.035em] text-[#080a0d]">
            {companyFoundations.anchorLines.map((line) => (
              <span key={line} className="dclFoundations__anchorLine block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
