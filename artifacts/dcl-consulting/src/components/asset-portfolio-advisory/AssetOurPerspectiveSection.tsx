import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { assetOurPerspective } from '@/data/asset-portfolio-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/asset-portfolio-secondary.webp';

export function AssetOurPerspectiveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApPerspective__revealLine', '.dclApPerspective__fadeUp', '.dclApPerspective__imageWrap', '.dclApPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclApPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclApPerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclApPerspective__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclApPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclApPerspective__statement',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclApPerspective__statement', start: 'top 85%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="asset-our-perspective" ref={rootRef} aria-labelledby="ap-perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclApPerspective__fadeUp text-[#6b737a]">{assetOurPerspective.label}</p>
            <h2 id="ap-perspective-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclApPerspective__revealLine block">{assetOurPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclApPerspective__revealLine block">{assetOurPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclApPerspective__fadeUp mt-6 text-[16px] leading-7 text-[#35404a]">{assetOurPerspective.body[0]}</p>
            <p className="dclApPerspective__fadeUp mt-4 text-[16px] leading-7 text-[#35404a]">{assetOurPerspective.body[1]}</p>
          </div>

          <div className="lg:col-span-4">
            <div className="dclApPerspective__imageWrap relative aspect-[5/4] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-asset-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Angled close-up of a glass office tower facade with repeating vertical mullions"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {assetOurPerspective.statementLines.map((line) => (
                <p key={line} className="dclApPerspective__statement dclHome__display text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.3] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
            </div>
            <Link
              href={assetOurPerspective.link.href}
              data-testid="link-asset-our-perspective"
              className="dclApPerspective__statement group mt-5 inline-flex items-center gap-2 pl-6 text-[13px] font-semibold uppercase tracking-[.1em] text-[#4a8fc2] outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              {assetOurPerspective.link.label}
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
