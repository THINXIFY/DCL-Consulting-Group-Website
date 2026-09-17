import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ourPerspective } from '@/data/real-estate-investment-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/real-estate-secondary-1.webp';

export function OurPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPerspective__revealLine', '.dclPerspective__fadeUp', '.dclPerspective__imageWrap', '.dclPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclPerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclPerspective__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclPerspective__statement',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclPerspective__statement', start: 'top 82%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="our-perspective" ref={rootRef} aria-labelledby="perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclPerspective__fadeUp text-[#6b737a]">{ourPerspective.label}</p>
            <h2 id="perspective-title" className="dclHome__display mt-5 text-[clamp(2.2rem,3.8vw,3.2rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclPerspective__revealLine block">{ourPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclPerspective__revealLine block">{ourPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclPerspective__fadeUp mt-6 text-[16px] leading-7 text-[#35404a]">{ourPerspective.body[0]}</p>
            <p className="dclPerspective__fadeUp mt-4 text-[16px] leading-7 text-[#35404a]">{ourPerspective.body[1]}</p>
            <Link
              href={ourPerspective.link.href}
              data-testid="link-our-perspective"
              className="dclPerspective__fadeUp group mt-6 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.1em] text-[#4a8fc2] outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              {ourPerspective.link.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="dclPerspective__imageWrap relative aspect-[5/4] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                ref={imageRef}
                data-testid="img-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Low-angle view of a dark curved glass office building with horizontal banding and rooftop greenery"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {ourPerspective.statementLines.map((line) => (
                <p key={line} className="dclPerspective__statement dclHome__display text-[clamp(1.3rem,1.8vw,1.6rem)] leading-[1.25] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
              <p className="dclPerspective__statement mt-4 text-[13px] uppercase tracking-[.05em] text-[#9ca3aa]">{ourPerspective.microCopy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
