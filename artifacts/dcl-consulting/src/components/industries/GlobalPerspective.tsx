import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { globalPerspective } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/industries/global-perspective.webp';

export function GlobalPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclGlobalPerspective__revealLine', '.dclGlobalPerspective__fadeUp', '.dclGlobalPerspective__imageWrap'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclGlobalPerspective__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.dclGlobalPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclGlobalPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclGlobalPerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
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
    <section id="global-perspective" ref={rootRef} aria-labelledby="global-perspective-title" className="relative overflow-hidden bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclGlobalPerspective__fadeUp text-[#9ca3aa]">{globalPerspective.label}</p>
            <h2 id="global-perspective-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclGlobalPerspective__revealLine block">{globalPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclGlobalPerspective__revealLine block">{globalPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclGlobalPerspective__fadeUp mt-6 max-w-[420px] text-[16px] leading-7 text-white/60">{globalPerspective.copy}</p>
            <Link
              href={globalPerspective.cta.href}
              data-testid="link-global-perspective-cta"
              className="dclGlobalPerspective__fadeUp group mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {globalPerspective.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="dclGlobalPerspective__imageWrap relative aspect-[16/10] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-global-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Aerial view of a dense downtown business district under an overcast sky with dozens of office towers"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171714]/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
