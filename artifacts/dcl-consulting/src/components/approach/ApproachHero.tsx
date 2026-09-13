import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { approachHero } from '@/data/approach-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePointerTilt } from '@/hooks/use-pointer-tilt';

interface PlaneState {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  rotateX: number;
}

// Planes start misaligned - offset, tilted, at different depths - and
// settle into a precise aligned stack as the user scrolls, representing
// unstructured information becoming structured judgement.
const START_STATES: PlaneState[] = [
  { x: -34, y: -110, z: 44, rotateY: -8, rotateX: 3 },
  { x: 26, y: -66, z: -12, rotateY: 6, rotateX: -2 },
  { x: -18, y: -22, z: 22, rotateY: -4, rotateX: 2 },
  { x: 34, y: 22, z: -26, rotateY: 7, rotateX: -3 },
  { x: -22, y: 66, z: 16, rotateY: -5, rotateX: 1 },
  { x: 18, y: 110, z: -16, rotateY: 4, rotateX: -1 },
];

function alignedState(index: number, count: number): PlaneState {
  const center = (count - 1) / 2;
  return { x: 0, y: (index - center) * 48, z: 0, rotateY: 0, rotateX: 0 };
}

export function ApproachHero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  usePointerTilt(stageRef, { maxRotateX: 1.4, maxRotateY: 2 });

  const termCount = isMobile ? 3 : isDesktop ? 6 : 4;
  const terms = approachHero.informationTerms.slice(0, termCount);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const planeEls = gsap.utils.toArray<HTMLElement>('.dclApproachHero__plane');
      const magnitude = isDesktop ? 1 : isMobile ? 0.4 : 0.7;

      const startFor = (i: number) => {
        const s = START_STATES[i] ?? START_STATES[0]!;
        return { x: s.x * magnitude, y: s.y * magnitude, z: s.z * magnitude, rotateY: s.rotateY * magnitude, rotateX: s.rotateX };
      };
      const endFor = (i: number) => {
        const s = alignedState(i, planeEls.length);
        return { x: s.x, y: s.y * magnitude, z: s.z, rotateY: s.rotateY, rotateX: s.rotateX };
      };

      if (prefersReducedMotion) {
        gsap.set(['.dclApproachHero__revealLine', '.dclApproachHero__fadeUp', '.dclApproachHero__rule', '.dclApproachHero__closing'], { clearProps: 'all' });
        planeEls.forEach((el, i) => gsap.set(el, { xPercent: -50, yPercent: -50, ...endFor(i), opacity: 1 }));
        return;
      }

      planeEls.forEach((el, i) => gsap.set(el, { xPercent: -50, yPercent: -50, ...startFor(i), opacity: 0 }));

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclApproachHero__eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclApproachHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclApproachHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.35')
        .fromTo('.dclApproachHero__intro', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to(planeEls, { opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.5')
        .fromTo('.dclApproachHero__supporting', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo('.dclApproachHero__closing', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.25');

      if (planeEls.length) {
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        planeEls.forEach((el, i) => {
          scrollTl.to(el, { ...endFor(i), duration: 1, ease: 'none' }, 0);
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop, isMobile, termCount]);

  return (
    <section id="approach-hero" ref={rootRef} aria-labelledby="approach-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1560px] flex-col px-6 pb-8 pt-28 sm:px-10 lg:px-16">
        <div className="grid flex-1 grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5">
              <p data-testid="text-approach-hero-eyebrow" className="dclHome__eyebrow dclApproachHero__eyebrow text-[#9ca3aa]">
                {approachHero.eyebrow}
              </p>
              <div className="dclApproachHero__rule h-px w-16 origin-left bg-[#8bbfe8]" />
            </div>

            <h1
              id="approach-hero-title"
              data-testid="text-approach-hero-title"
              className="dclHome__display mt-8 text-[clamp(3rem,6.4vw,6.2rem)] leading-[.98] tracking-[-.03em]"
            >
              <span className="block overflow-hidden"><span className="dclApproachHero__revealLine block">{approachHero.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclApproachHero__revealLine block">{approachHero.headlineLines[1]}</span></span>
            </h1>

            <p data-testid="text-approach-hero-intro" className="dclApproachHero__intro mt-8 max-w-[560px] text-[19px] leading-[1.6] text-white/75 sm:text-[21px]">
              {approachHero.intro}
            </p>
          </div>

          <div className="relative lg:col-span-5 lg:flex lg:items-center lg:justify-end">
            <div className="relative mx-auto h-[300px] w-[260px] [perspective:1900px] sm:h-[360px] sm:w-[300px] lg:mx-0 lg:h-[420px] lg:w-[300px]">
              <div ref={stageRef} className="relative h-full w-full [transform-style:preserve-3d]">
                {terms.map((term, index) => (
                  <div
                    key={term.label}
                    data-testid={`hero-information-plane-${index}`}
                    className="dclApproachHero__plane absolute left-1/2 top-1/2 flex h-[42px] w-[240px] -translate-x-1/2 -translate-y-1/2 items-center gap-4 border-b border-white/25 px-1"
                  >
                    <div className="h-px w-8 shrink-0 bg-[#8bbfe8]" />
                    <p className="dclHome__display text-[1.05rem] leading-none text-white/90">{term.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-6">
          <p data-testid="text-approach-hero-supporting" className="dclApproachHero__supporting max-w-[640px] text-[16px] leading-7 text-white/55">
            {approachHero.supporting}
          </p>
          <p data-testid="text-approach-hero-closing" className="dclApproachHero__closing shrink-0 text-[11px] font-semibold uppercase tracking-[.15em] text-white/60">
            {approachHero.closingLines.join(' ')}
          </p>
        </div>
      </div>
    </section>
  );
}
