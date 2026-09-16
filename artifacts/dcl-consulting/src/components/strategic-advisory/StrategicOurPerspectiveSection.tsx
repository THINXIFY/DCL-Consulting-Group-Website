import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { strategicOurPerspective } from '@/data/strategic-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/strategic-advisory-secondary.webp';

export function StrategicOurPerspectiveSection() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclStPerspective__revealLine', '.dclStPerspective__fadeUp', '.dclStPerspective__imageWrap', '.dclStPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclStPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclStPerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclStPerspective__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclStPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclStPerspective__statement',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclStPerspective__statement', start: 'top 85%' } },
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
    <section id="strategic-our-perspective" ref={rootRef} aria-labelledby="st-perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:items-center lg:gap-x-12">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclStPerspective__fadeUp text-[#6b737a]">{strategicOurPerspective.label}</p>
            <h2 id="st-perspective-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclStPerspective__revealLine block">{strategicOurPerspective.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclStPerspective__revealLine block">{strategicOurPerspective.headlineLines[1]}</span></span>
            </h2>
            <p className="dclStPerspective__fadeUp mt-6 max-w-[380px] text-[16px] leading-7 text-[#35404a]">{strategicOurPerspective.body[0]}</p>
            <p className="dclStPerspective__fadeUp mt-4 max-w-[380px] text-[16px] leading-7 text-[#35404a]">{strategicOurPerspective.body[1]}</p>
          </div>

          <div className="lg:col-span-5 lg:col-start-6">
            <div className="dclStPerspective__imageWrap relative aspect-[4/3] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-strategic-our-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Elevated wide view of a city skyline and river at sunset with clusters of office towers among older rooftops"
              />
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-11">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {strategicOurPerspective.statementLines.map((line) => (
                <p key={line} className="dclStPerspective__statement dclHome__display text-[clamp(1.15rem,1.4vw,1.35rem)] leading-[1.3] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
            </div>
            <Link
              href={strategicOurPerspective.link.href}
              data-testid="link-strategic-our-perspective"
              className="dclStPerspective__statement group mt-5 inline-flex items-center gap-2 pl-6 text-[13px] font-semibold uppercase tracking-[.1em] text-[#4a8fc2] outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              {strategicOurPerspective.link.label}
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
