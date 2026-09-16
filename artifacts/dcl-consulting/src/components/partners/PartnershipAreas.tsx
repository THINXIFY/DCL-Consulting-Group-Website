import { useEffect, useRef } from 'react';
import { partnershipAreas } from '@/data/partners-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function PartnershipAreas() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPartnerAreas__revealLine', '.dclPartnerAreas__rule', '.dclPartnerAreas__area'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPartnerAreas__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclPartnerAreas__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclPartnerAreas__area',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclPartnerAreas__grid', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="partnership-areas" ref={rootRef} aria-labelledby="partnership-areas-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-partnership-areas-eyebrow" className="dclHome__eyebrow mb-5 text-[#4f718c]">
          {partnershipAreas.eyebrow}
        </p>
        <div className="max-w-[640px]">
          <h2 id="partnership-areas-title" className="dclHome__display text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.08] tracking-[-.03em] text-[#080a0d]">
            {partnershipAreas.headlineLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="dclPartnerAreas__revealLine block">{line}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="dclPartnerAreas__rule mt-10 h-px w-full origin-left bg-[#080a0d]/14 lg:mt-12" />

        <div className="dclPartnerAreas__grid mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-[#080a0d]/12">
          {partnershipAreas.areas.map((area) => (
            <div
              key={area.name}
              data-testid={`partnership-area-${slug(area.name)}`}
              className="dclPartnerAreas__area border-b border-[#080a0d]/12 py-8 lg:py-10 lg:px-8 lg:first:pl-0"
            >
              <h3 className="dclHome__display text-[1.25rem] leading-[1.15] tracking-[-.01em] text-[#080a0d]">{area.name}</h3>
              <p className="mt-3 max-w-[30ch] text-[15px] leading-6 text-[#4b545c]">{area.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
