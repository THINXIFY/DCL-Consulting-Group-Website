import { useEffect, useRef } from 'react';
import { riskWhyDcl } from '@/data/risk-opportunity-assessment-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/risk-opportunity-secondary.webp';

export function RiskWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclRiskWhy__revealLine', '.dclRiskWhy__fadeUp', '.dclRiskWhy__imageWrap', '.dclRiskWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclRiskWhy__imageWrap',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclRiskWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclRiskWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclRiskWhy__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclRiskWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="risk-why-dcl" ref={rootRef} aria-labelledby="risk-why-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-6">
            <div className="dclRiskWhy__imageWrap relative aspect-[5/6] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                data-testid="img-risk-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Building facade split between dark shadow and warm golden sunlight on vertical fins"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="dclHome__eyebrow dclRiskWhy__fadeUp text-[#6b737a]">{riskWhyDcl.label}</p>
            <h2 id="risk-why-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclRiskWhy__revealLine block">{riskWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclRiskWhy__revealLine block">{riskWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclRiskWhy__fadeUp mt-5 max-w-[440px] text-[16px] leading-7 text-[#35404a]">{riskWhyDcl.body}</p>

            <div className="mt-8 grid grid-cols-2 divide-x divide-[#080a0d]/14 border-t border-[#080a0d]/14 pt-6">
              {riskWhyDcl.principles.map((principle, index) => (
                <div key={principle} className={`dclRiskWhy__principle ${index % 2 === 1 ? 'pl-6' : 'pr-6'}`}>
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
