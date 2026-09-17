import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { privateCapitalOurPerspective } from '@/data/private-capital-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/private-capital-secondary.webp';

export function PrivateCapitalOurPerspectiveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPcPerspective__revealLine', '.dclPcPerspective__fadeUp', '.dclPcPerspective__imageWrap', '.dclPcPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPcPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclPcPerspective__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      // Reveal from the top-right corner outward - a distinct technique
      // from the clip and scale reveals used on the Wealth page.
      gsap.fromTo(
        '.dclPcPerspective__imageWrap',
        { clipPath: 'circle(0% at 100% 0%)' },
        { clipPath: 'circle(140% at 100% 0%)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclPcPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclPcPerspective__statement',
        { autoAlpha: 0, x: 12 },
        { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.dclPcPerspective__statement', start: 'top 85%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="pc-our-perspective" ref={rootRef} aria-labelledby="pc-perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclPcPerspective__fadeUp text-[#6b737a]">{privateCapitalOurPerspective.label}</p>
            <h2 id="pc-perspective-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclPcPerspective__revealLine block">{privateCapitalOurPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclPcPerspective__revealLine block">{privateCapitalOurPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclPcPerspective__fadeUp mt-6 text-[16px] leading-7 text-[#35404a]">{privateCapitalOurPerspective.body[0]}</p>
            <p className="dclPcPerspective__fadeUp mt-4 text-[16px] leading-7 text-[#35404a]">{privateCapitalOurPerspective.body[1]}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="dclPcPerspective__imageWrap relative aspect-[4/3] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                ref={imageRef}
                data-testid="img-pc-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Dimly lit concrete stairway leading up to an illuminated glass entrance at night"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {privateCapitalOurPerspective.statementLines.map((line) => (
                <p key={line} className="dclPcPerspective__statement dclHome__display text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.3] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
            </div>
            <Link
              href={privateCapitalOurPerspective.link.href}
              data-testid="link-pc-our-perspective"
              className="dclPcPerspective__statement group mt-5 inline-flex items-center gap-2 pl-6 text-[13px] font-semibold uppercase tracking-[.1em] text-[#4a8fc2] outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              {privateCapitalOurPerspective.link.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
