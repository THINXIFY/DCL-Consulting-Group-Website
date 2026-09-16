import { useEffect, useRef } from 'react';
import { privateCapitalWhyDcl } from '@/data/private-capital-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/private-capital-secondary.webp';

// Soft black rather than primary black - keeps this section visibly
// distinct from the primary-black Final CTA immediately below it.
export function PrivateCapitalWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPcWhy__revealLine', '.dclPcWhy__fadeUp', '.dclPcWhy__imageWrap', '.dclPcWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPcWhy__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.dclPcWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclPcWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclPcWhy__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclPcWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="pc-why-dcl" ref={rootRef} aria-labelledby="pc-why-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-7">
            <div className="dclPcWhy__imageWrap relative aspect-[16/11] w-full overflow-hidden">
              <img
                data-testid="img-pc-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Dimly lit concrete stairway leading up to an illuminated glass entrance at night"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#171714]/15" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclPcWhy__fadeUp text-[#9ca3aa]">{privateCapitalWhyDcl.label}</p>
            <h2 id="pc-why-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclPcWhy__revealLine block">{privateCapitalWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclPcWhy__revealLine block">{privateCapitalWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclPcWhy__fadeUp mt-5 max-w-[440px] text-[16px] leading-7 text-white/60">{privateCapitalWhyDcl.body}</p>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-white/14 pt-6 sm:grid-cols-2">
              {privateCapitalWhyDcl.principles.map((principle) => (
                <div key={principle} className="dclPcWhy__principle flex items-center gap-3">
                  <div className="h-px w-6 shrink-0 bg-[#8bbfe8]" />
                  <p className="text-[16px] font-medium leading-6 text-white/85">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
