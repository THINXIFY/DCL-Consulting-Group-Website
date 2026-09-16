import { useEffect, useRef } from 'react';
import { whereSectorPerspectiveMatters } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function WhereSectorPerspectiveMatters() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSectorMatters__revealLine', '.dclSectorMatters__item'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclSectorMatters__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclSectorMatters__item',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.dclSectorMatters__grid', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="where-sector-perspective-matters"
      ref={rootRef}
      aria-labelledby="sector-matters-title"
      className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[720px]">
          <h2 id="sector-matters-title" className="dclHome__display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] tracking-[-.03em]">
            <span className="block overflow-hidden"><span className="dclSectorMatters__revealLine block">{whereSectorPerspectiveMatters.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclSectorMatters__revealLine block">{whereSectorPerspectiveMatters.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="dclSectorMatters__grid mt-14 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-white/12 pt-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {whereSectorPerspectiveMatters.situations.map((situation) => (
            <div key={situation} data-testid={`sector-matters-item-${slug(situation)}`} className="dclSectorMatters__item group">
              <p className="dclHome__display text-[clamp(1.4rem,2vw,1.8rem)] leading-[1.15] text-white/85 transition-colors duration-300 group-hover:text-white">{situation}</p>
              <div className="mt-4 h-px w-8 bg-[#8bbfe8] transition-all duration-300 group-hover:w-14" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
