import { useEffect, useRef } from 'react';
import { whyDcl } from '@/data/real-estate-investment-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/real-estate-secondary-1.webp';

export function WhyDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhy__revealLine', '.dclWhy__fadeUp', '.dclWhy__imageWrap', '.dclWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWhy__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclWhy__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-dcl" ref={rootRef} aria-labelledby="why-dcl-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-7">
            <div className="dclWhy__imageWrap relative aspect-[16/11] w-full overflow-hidden">
              <img
                data-testid="img-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Low-angle view of a dark curved glass office building with horizontal banding and rooftop greenery"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclWhy__fadeUp text-[#6b737a]">{whyDcl.label}</p>
            <h2 id="why-dcl-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWhy__revealLine block">{whyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWhy__revealLine block">{whyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclWhy__fadeUp mt-5 max-w-[420px] text-[16px] leading-7 text-[#35404a]">{whyDcl.body}</p>

            <div className="mt-8 border-t border-[#080a0d]/14">
              {whyDcl.principles.map((principle) => (
                <div key={principle} className="dclWhy__principle border-b border-[#080a0d]/14 py-4">
                  <p className="text-[16px] font-medium leading-6 text-[#080a0d]">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
