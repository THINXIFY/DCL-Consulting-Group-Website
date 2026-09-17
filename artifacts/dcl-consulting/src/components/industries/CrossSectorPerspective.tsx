import { useEffect, useRef } from 'react';
import { crossSectorPerspective } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function CrossSectorPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclCrossSector__revealLine', '.dclCrossSector__fadeUp', '.dclCrossSector__imageWrap', '.dclCrossSector__badge'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclCrossSector__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.dclCrossSector__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclCrossSector__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclCrossSector__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
      );
      gsap.fromTo(
        '.dclCrossSector__badge',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.dclCrossSector__imageWrap', start: 'top 70%' }, delay: 0.5 },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="cross-sector-perspective" ref={rootRef} aria-labelledby="cross-sector-title" className="relative overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="relative z-10 lg:col-span-6 lg:pr-6">
            <p className="dclHome__eyebrow dclCrossSector__fadeUp text-[#6b737a]">{crossSectorPerspective.label}</p>
            <h2 id="cross-sector-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclCrossSector__revealLine block">{crossSectorPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclCrossSector__revealLine block">{crossSectorPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclCrossSector__fadeUp mt-6 max-w-[440px] text-[16px] leading-7 text-[#35404a]">{crossSectorPerspective.copy}</p>
          </div>

          <div className="relative lg:col-span-6 lg:-ml-16 lg:mt-10">
            <div className="dclCrossSector__imageWrap relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/9]">
              <img loading="lazy" decoding="async"
                ref={imageRef}
                data-testid="img-cross-sector"
                className="h-full w-full scale-105 object-cover object-center"
                src={crossSectorPerspective.image.src}
                alt={crossSectorPerspective.image.alt}
              />
            </div>
            {/* Overlapping editorial label - deliberately not aligned to
                the image's own edge, so the composition reads as one
                layered element rather than a caption. */}
            <div className="dclCrossSector__badge absolute -top-6 left-6 hidden bg-[#080a0d] px-5 py-4 sm:block lg:-left-10">
              <p className="text-[11px] font-semibold uppercase leading-[1.4] tracking-[.13em] text-white/70">
                Sector Lines
                <br />
                <span className="text-[#8bbfe8]">Rarely Stay Separate</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
