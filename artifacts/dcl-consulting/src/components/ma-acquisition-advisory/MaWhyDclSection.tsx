import { useEffect, useRef } from 'react';
import { maWhyDcl } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/ma-acquisition-secondary.webp';

export function MaWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMaWhy__revealLine', '.dclMaWhy__fadeUp', '.dclMaWhy__imageWrap', '.dclMaWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMaWhy__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.95, ease: 'power4.out', scrollTrigger: { trigger: '.dclMaWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclMaWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclMaWhy__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclMaWhy__principle',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="ma-why-dcl" ref={rootRef} aria-labelledby="ma-why-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-5 lg:order-1">
            <p className="dclHome__eyebrow dclMaWhy__fadeUp text-[#9ca3aa]">{maWhyDcl.label}</p>
            <h2 id="ma-why-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.1] tracking-[-.02em]">
              <span className="block overflow-hidden"><span className="dclMaWhy__revealLine block">{maWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclMaWhy__revealLine block">{maWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclMaWhy__fadeUp mt-4 max-w-[420px] text-[16px] leading-7 text-white/60">{maWhyDcl.body}</p>

            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-white/14 pt-5 sm:grid-cols-2">
              {maWhyDcl.principles.map((principle) => (
                <div key={principle} className="dclMaWhy__principle flex items-center gap-3">
                  <div className="h-px w-6 shrink-0 bg-[#8bbfe8]" />
                  <p className="text-[16px] font-medium leading-6 text-white/85">{principle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 lg:order-2">
            <div className="dclMaWhy__imageWrap relative aspect-[16/11] w-full overflow-hidden">
              <img
                data-testid="img-ma-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Low-angle view of a cream stone building corner where two facades converge under a clear blue sky"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#171714]/15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
