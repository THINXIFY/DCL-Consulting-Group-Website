import { useEffect, useRef } from 'react';
import { commercialFinancial } from '@/data/real-estate-investment-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/real-estate-secondary-2.webp';

export function CommercialFinancial() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclCommercial__revealLine', '.dclCommercial__fadeUp', '.dclCommercial__imageWrap', '.dclCommercial__item'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclCommercial__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclCommercial__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclCommercial__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclCommercial__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclCommercial__item',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="commercial-financial" ref={rootRef} aria-labelledby="commercial-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclCommercial__fadeUp text-[#6b737a]">{commercialFinancial.label}</p>
            <h2 id="commercial-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.08] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclCommercial__revealLine block">{commercialFinancial.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclCommercial__revealLine block">{commercialFinancial.headlineLines[1]}</span></span>
            </h2>
            <p className="dclCommercial__fadeUp mt-5 max-w-[400px] text-[16px] leading-7 text-[#35404a]">{commercialFinancial.body}</p>
          </div>

          <div className="lg:col-span-4">
            <div className="dclCommercial__imageWrap relative aspect-[4/5] w-full overflow-hidden">
              <img
                data-testid="img-commercial-financial"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Close-up of a curved white concrete building facade with rounded glass bay windows"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="border-t border-[#080a0d]/14">
              {commercialFinancial.list.map((item) => (
                <div key={item} className="dclCommercial__item border-b border-[#080a0d]/14 py-4">
                  <p className="text-[16px] font-medium leading-6 text-[#080a0d]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
