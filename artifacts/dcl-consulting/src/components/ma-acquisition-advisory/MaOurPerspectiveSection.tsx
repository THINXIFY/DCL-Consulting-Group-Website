import { useEffect, useRef } from 'react';
import { maOurPerspective } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/ma-acquisition-secondary.webp';

export function MaOurPerspectiveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMaPerspective__revealLine', '.dclMaPerspective__fadeUp', '.dclMaPerspective__imageWrap', '.dclMaPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMaPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclMaPerspective__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      // Tight left-edge wipe rather than a soft fade - sharper than the
      // reveal used on the Strategic Advisory perspective section.
      gsap.fromTo(
        '.dclMaPerspective__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: '.dclMaPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclMaPerspective__statement',
        { autoAlpha: 0, x: 12 },
        { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclMaPerspective__statement', start: 'top 85%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="ma-our-perspective" ref={rootRef} aria-labelledby="ma-perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclMaPerspective__fadeUp text-[#6b737a]">{maOurPerspective.label}</p>
            <h2 id="ma-perspective-title" className="dclHome__display mt-5 text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.15] tracking-[-.02em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclMaPerspective__revealLine block">{maOurPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclMaPerspective__revealLine block">{maOurPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclMaPerspective__fadeUp mt-5 text-[16px] leading-7 text-[#35404a]">{maOurPerspective.body[0]}</p>
            <p className="dclMaPerspective__fadeUp mt-3 text-[16px] leading-7 text-[#35404a]">{maOurPerspective.body[1]}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="dclMaPerspective__imageWrap relative aspect-[3/2] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-ma-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Low-angle view of a cream stone building corner where two facades converge under a clear blue sky"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {maOurPerspective.statementLines.map((line) => (
                <p key={line} className="dclMaPerspective__statement dclHome__display text-[clamp(1.1rem,1.4vw,1.3rem)] leading-[1.25] tracking-[-.01em] text-[#080a0d]">
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
