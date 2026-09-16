import { useEffect, useRef } from 'react';
import { dueDiligenceOurPerspective } from '@/data/due-diligence-support-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/due-diligence-secondary.webp';

export function DueDiligenceOurPerspectiveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDdPerspective__revealLine', '.dclDdPerspective__fadeUp', '.dclDdPerspective__imageWrap', '.dclDdPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclDdPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclDdPerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      // Same aperture-style reveal as the hero, applied here at a
      // gentler scale - keeps the "precise, investigative" motif
      // consistent through the page without repeating it identically.
      gsap.fromTo(
        '.dclDdPerspective__imageWrap',
        { clipPath: 'inset(25% 25% 25% 25%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclDdPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclDdPerspective__statement',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.dclDdPerspective__statement', start: 'top 85%' } },
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
    <section id="dd-our-perspective" ref={rootRef} aria-labelledby="dd-perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclDdPerspective__fadeUp text-[#6b737a]">{dueDiligenceOurPerspective.label}</p>
            <h2 id="dd-perspective-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclDdPerspective__revealLine block">{dueDiligenceOurPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclDdPerspective__revealLine block">{dueDiligenceOurPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclDdPerspective__fadeUp mt-6 text-[16px] leading-7 text-[#35404a]">{dueDiligenceOurPerspective.body[0]}</p>
            <p className="dclDdPerspective__fadeUp mt-4 text-[16px] leading-7 text-[#35404a]">{dueDiligenceOurPerspective.body[1]}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="dclDdPerspective__imageWrap relative aspect-[5/4] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-dd-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Close-up of a sandstone building facade with fine vertical fluting and sharp shadow lines"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {dueDiligenceOurPerspective.statementLines.map((line) => (
                <p key={line} className="dclDdPerspective__statement dclHome__display text-[clamp(1.15rem,1.5vw,1.35rem)] leading-[1.3] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
