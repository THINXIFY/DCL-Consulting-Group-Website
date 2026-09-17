import { useEffect, useRef } from 'react';
import { dueDiligenceWhyDcl } from '@/data/due-diligence-support-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/due-diligence-secondary.webp';

export function DueDiligenceWhyDclSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDdWhy__revealLine', '.dclDdWhy__fadeUp', '.dclDdWhy__imageWrap', '.dclDdWhy__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclDdWhy__imageWrap',
        { clipPath: 'inset(30% 30% 30% 30%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclDdWhy__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclDdWhy__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclDdWhy__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclDdWhy__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="dd-why-dcl" ref={rootRef} aria-labelledby="dd-why-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-12">
          <div className="lg:col-span-6">
            <div className="dclDdWhy__imageWrap relative aspect-[4/3] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                data-testid="img-dd-why-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Close-up of a sandstone building facade with fine vertical fluting and sharp shadow lines"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="dclHome__eyebrow dclDdWhy__fadeUp text-[#9ca3aa]">{dueDiligenceWhyDcl.label}</p>
            <h2 id="dd-why-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclDdWhy__revealLine block">{dueDiligenceWhyDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclDdWhy__revealLine block">{dueDiligenceWhyDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclDdWhy__fadeUp mt-5 max-w-[440px] text-[16px] leading-7 text-white/60">{dueDiligenceWhyDcl.body}</p>

            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/14 pt-6">
              {dueDiligenceWhyDcl.principles.map((principle) => (
                <div key={principle} className="dclDdWhy__principle">
                  <div className="h-px w-8 bg-[#8bbfe8]" />
                  <p className="mt-3 text-[16px] font-medium leading-6 text-white/90">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
