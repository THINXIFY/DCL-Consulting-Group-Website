import { useEffect, useRef } from 'react';
import { marketWhyDcl } from '@/data/market-entry-expansion-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/market-entry-secondary.webp';

export function MarketWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMeWhy__revealLine', '.dclMeWhy__fadeUp', '.dclMeWhy__imageWrap', '.dclMeWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMeWhy__imageWrap',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.dclMeWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclMeWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclMeWhy__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclMeWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="market-why-dcl" ref={rootRef} aria-labelledby="market-why-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-7">
            <div className="dclMeWhy__imageWrap relative aspect-[16/10] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                data-testid="img-market-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Symmetrical low-angle view of several glass skyscrapers converging toward a bright sky"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclMeWhy__fadeUp text-[#6b737a]">{marketWhyDcl.label}</p>
            <h2 id="market-why-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclMeWhy__revealLine block">{marketWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclMeWhy__revealLine block">{marketWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclMeWhy__fadeUp mt-5 max-w-[420px] text-[16px] leading-7 text-[#35404a]">{marketWhyDcl.body}</p>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-[#080a0d]/14 pt-6 sm:grid-cols-2">
              {marketWhyDcl.principles.map((principle) => (
                <div key={principle} className="dclMeWhy__principle">
                  <div className="h-px w-8 bg-[#8bbfe8]" />
                  <p className="mt-3 text-[16px] font-medium leading-6 text-[#080a0d]">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
