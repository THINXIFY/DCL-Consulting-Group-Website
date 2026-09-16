import { useEffect, useRef } from 'react';
import { whyDclExpertise } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/general/expertise-why-dcl.webp';

export function WhyDclExpertise() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhyExp__revealLine', '.dclWhyExp__fadeUp', '.dclWhyExp__imageWrap', '.dclWhyExp__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWhyExp__imageWrap',
        { clipPath: 'inset(30% 30% 30% 30%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhyExp__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclWhyExp__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclWhyExp__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclWhyExp__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 58%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-dcl-expertise" ref={rootRef} aria-labelledby="why-dcl-expertise-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclWhyExp__fadeUp text-[#6b737a]">{whyDclExpertise.label}</p>
            <h2 id="why-dcl-expertise-title" className="dclHome__display mt-5 text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWhyExp__revealLine block">{whyDclExpertise.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWhyExp__revealLine block">{whyDclExpertise.headlineLines[1]}</span></span>
            </h2>
            <p className="dclWhyExp__fadeUp mt-6 max-w-[400px] text-[16px] leading-7 text-[#35404a]">{whyDclExpertise.copy}</p>
          </div>

          <div className="lg:col-span-4">
            <div className="dclWhyExp__imageWrap relative aspect-[4/5] w-full overflow-hidden">
              <img
                data-testid="img-why-dcl-expertise"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Classical stone building facade with Ionic columns and carved cornice ornamentation under a blue sky"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex flex-col divide-y divide-[#080a0d]/12 border-t border-[#080a0d]/12">
              {whyDclExpertise.principles.map((principle) => (
                <div key={principle.name} data-testid={`why-dcl-expertise-principle-${principle.name.toLowerCase().replaceAll(' ', '-')}`} className="dclWhyExp__principle py-4">
                  <p className="text-[15.5px] font-semibold text-[#080a0d]">{principle.name}</p>
                  <p className="mt-1.5 max-w-[36ch] text-[14.5px] leading-6 text-[#6b737a]">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
