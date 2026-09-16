import { useEffect, useRef } from 'react';
import { investmentWhyDcl } from '@/data/investment-consulting-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/investment-consulting-secondary.webp';

export function InvestmentWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclIcWhy__revealLine', '.dclIcWhy__fadeUp', '.dclIcWhy__imageWrap', '.dclIcWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclIcWhy__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclIcWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclIcWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclIcWhy__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclIcWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="investment-why-dcl" ref={rootRef} aria-labelledby="ic-why-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-6">
            <div className="dclIcWhy__imageWrap relative aspect-[5/4] w-full overflow-hidden">
              <img
                data-testid="img-investment-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Minimalist curved glass office tower corner against a clear blue sky"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="dclHome__eyebrow dclIcWhy__fadeUp text-[#6b737a]">{investmentWhyDcl.label}</p>
            <h2 id="ic-why-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclIcWhy__revealLine block">{investmentWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIcWhy__revealLine block">{investmentWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclIcWhy__fadeUp mt-5 max-w-[440px] text-[16px] leading-7 text-[#35404a]">{investmentWhyDcl.body}</p>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-[#080a0d]/14 pt-6 sm:grid-cols-2">
              {investmentWhyDcl.principles.map((principle) => (
                <div key={principle} className="dclIcWhy__principle">
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
