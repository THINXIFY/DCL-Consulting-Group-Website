import { useEffect, useRef } from 'react';
import { crossSectorPerspective } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

interface TermConfig {
  top: string;
  left: string;
  speed: number;
}

// Two or three quiet reference words drifting at different, slow speeds
// behind the copy - never a diagram, never labelled, just a reminder
// that the same underlying themes recur across sectors.
const TERM_CONFIG: TermConfig[] = [
  { top: '12%', left: '58%', speed: -30 },
  { top: '48%', left: '8%', speed: 20 },
  { top: '78%', left: '62%', speed: -16 },
];

export function CrossSectorPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const termRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclCrossSector__revealLine', '.dclCrossSector__fadeUp', '.dclCrossSector__closingLine'], { clearProps: 'all' });
        // Decorative only (aria-hidden) - shown as a static quiet layer
        // rather than drifting, instead of leaving the initial opacity-0
        // class in place with nothing to ever clear it.
        gsap.set('.dclCrossSector__term', { autoAlpha: 0.08 });
        return;
      }
      gsap.fromTo(
        '.dclCrossSector__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclCrossSector__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      if (isDesktop) {
        gsap.fromTo(
          '.dclCrossSector__term',
          { autoAlpha: 0 },
          { autoAlpha: 0.08, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
        );
        // A plain onUpdate + gsap.set drift (no `scrub`) - matches the
        // scroll-linked pattern used everywhere else on this site. GSAP's
        // `scrub` smoothing keeps its own ticker alive between renders,
        // which is what caused an intermittent post-teardown
        // "requestAnimationFrame is not defined" failure under jsdom;
        // onUpdate sets values synchronously with no ticker involved.
        // gsap.context() auto-tracks and reverts ScrollTrigger instances
        // created here, so no manual kill() is needed.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            termRefs.current.forEach((el, i) => {
              if (!el) return;
              gsap.set(el, { yPercent: self.progress * (TERM_CONFIG[i]?.speed ?? 0) });
            });
          },
        });
        gsap.to('.dclCrossSector__term', {
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclCrossSector__closing', start: 'top 85%' },
        });
      }
      gsap.fromTo(
        '.dclCrossSector__closingLine',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclCrossSector__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="cross-sector-perspective" ref={rootRef} aria-labelledby="cross-sector-title" className="relative overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      {isDesktop && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {crossSectorPerspective.backgroundTerms.map((term, index) => {
            const config = TERM_CONFIG[index] ?? TERM_CONFIG[0]!;
            return (
              <p
                key={term}
                ref={(el) => {
                  termRefs.current[index] = el;
                }}
                className="dclCrossSector__term dclHome__display absolute text-[5rem] text-[#080a0d] opacity-0"
                style={{ top: config.top, left: config.left }}
              >
                {term}
              </p>
            );
          })}
        </div>
      )}

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <h2 id="cross-sector-title" className="dclHome__display lg:col-span-5 text-[clamp(2.4rem,4.4vw,3.7rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclCrossSector__revealLine block">{crossSectorPerspective.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclCrossSector__revealLine block">{crossSectorPerspective.headlineLines[1]}</span></span>
          </h2>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="dclCrossSector__fadeUp text-[19px] leading-[1.6] text-[#35404a]">{crossSectorPerspective.lead}</p>
            <p className="dclCrossSector__fadeUp mt-6 text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{crossSectorPerspective.body[0]}</p>
            <p className="dclCrossSector__fadeUp mt-5 text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{crossSectorPerspective.body[1]}</p>
          </div>
        </div>

        <div data-testid="text-cross-sector-closing" className="dclCrossSector__closing mt-16 border-t border-[#080a0d]/15 pt-10 lg:mt-20">
          {crossSectorPerspective.closingLines.map((line) => (
            <p key={line} className="dclCrossSector__closingLine dclHome__display max-w-[900px] text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.2] tracking-[-.02em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
