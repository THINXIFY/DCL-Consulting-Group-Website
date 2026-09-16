import { useEffect, useRef } from 'react';
import { assetWhyDcl } from '@/data/asset-portfolio-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/asset-portfolio-secondary.webp';

// Soft black rather than primary black - this is the tonal step that
// keeps this section visibly distinct from the primary-black Final CTA
// immediately below it, since both are dark sections back to back.
export function AssetWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApWhy__revealLine', '.dclApWhy__fadeUp', '.dclApWhy__imageWrap', '.dclApWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclApWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclApWhy__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclApWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
      gsap.fromTo(
        '.dclApWhy__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclApWhy__imageWrap', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="asset-why-dcl" ref={rootRef} aria-labelledby="ap-why-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-12">
          <div className="lg:col-span-8">
            <p className="dclHome__eyebrow dclApWhy__fadeUp text-[#9ca3aa]">{assetWhyDcl.label}</p>
            <h2 id="ap-why-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclApWhy__revealLine block">{assetWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclApWhy__revealLine block">{assetWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclApWhy__fadeUp mt-5 max-w-[460px] text-[16px] leading-7 text-white/60">{assetWhyDcl.body}</p>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-white/14 pt-6 sm:grid-cols-2">
              {assetWhyDcl.principles.map((principle) => (
                <div key={principle} className="dclApWhy__principle flex items-center gap-3">
                  <div className="h-px w-6 shrink-0 bg-[#8bbfe8]" />
                  <p className="text-[16px] font-medium leading-6 text-white/85">{principle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="dclApWhy__imageWrap relative aspect-[3/5] w-full overflow-hidden">
              <img
                data-testid="img-asset-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Angled close-up of a glass office tower facade with repeating vertical mullions"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#171714]/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
