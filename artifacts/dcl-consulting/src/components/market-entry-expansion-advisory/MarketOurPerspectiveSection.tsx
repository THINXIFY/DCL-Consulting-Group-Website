import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { marketOurPerspective } from '@/data/market-entry-expansion-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/market-entry-secondary.webp';

// Text-left, image-centre, statement-right - the mirror of the Risk
// page's image-left composition, keeping the two hubs from feeling
// like the same template with swapped copy.
export function MarketOurPerspectiveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMePerspective__revealLine', '.dclMePerspective__fadeUp', '.dclMePerspective__imageWrap', '.dclMePerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMePerspective__imageWrap',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclMePerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclMePerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclMePerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclMePerspective__statement',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.dclMePerspective__statement', start: 'top 85%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          xPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="market-our-perspective" ref={rootRef} aria-labelledby="market-perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclMePerspective__fadeUp text-[#6b737a]">{marketOurPerspective.label}</p>
            <h2 id="market-perspective-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclMePerspective__revealLine block">{marketOurPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclMePerspective__revealLine block">{marketOurPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclMePerspective__fadeUp mt-6 text-[16px] leading-7 text-[#35404a]">{marketOurPerspective.body[0]}</p>
            <p className="dclMePerspective__fadeUp mt-4 text-[16px] leading-7 text-[#35404a]">{marketOurPerspective.body[1]}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="dclMePerspective__imageWrap relative aspect-[4/3] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                ref={imageRef}
                data-testid="img-market-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Symmetrical low-angle view of several glass skyscrapers converging toward a bright sky"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {marketOurPerspective.statementLines.map((line) => (
                <p key={line} className="dclMePerspective__statement dclHome__display text-[clamp(1.1rem,1.4vw,1.3rem)] leading-[1.3] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
              <Link
                href={marketOurPerspective.link.href}
                data-testid="link-market-perspective-approach"
                className="dclMePerspective__statement group mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {marketOurPerspective.link.label}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
