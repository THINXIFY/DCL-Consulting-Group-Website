import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { expertiseHero } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePointerTilt } from '@/hooks/use-pointer-tilt';

interface StackConfig {
  z: number;
  x: number;
  y: number;
  rotateY: number;
  rotateX: number;
}

// A diagonal, cascading depth field rather than the About page's
// symmetric radial fan - each lens sits further back and further along
// the diagonal than the one before it.
const STACK_CONFIG: StackConfig[] = [
  { z: 64, x: 0, y: 0, rotateY: -4, rotateX: 1.4 },
  { z: 22, x: 58, y: 46, rotateY: -1.4, rotateX: 0.6 },
  { z: -20, x: 40, y: 100, rotateY: 3, rotateX: -1 },
  { z: -62, x: 96, y: 156, rotateY: 1.2, rotateX: -1.6 },
];

export function ExpertiseHero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  usePointerTilt(stageRef, { maxRotateX: 1.6, maxRotateY: 2.4 });

  const lensCount = isMobile ? 2 : isDesktop ? 4 : 3;
  const lenses = expertiseHero.lenses.slice(0, lensCount);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const planeEls = gsap.utils.toArray<HTMLElement>('.dclExpHero__plane');
      const magnitude = isDesktop ? 1 : isMobile ? 0.4 : 0.7;
      const settled = {
        z: (i: number) => (STACK_CONFIG[i]?.z ?? 0) * magnitude,
        x: (i: number) => (STACK_CONFIG[i]?.x ?? 0) * magnitude,
        y: (i: number) => (STACK_CONFIG[i]?.y ?? 0) * magnitude,
        rotateY: (i: number) => (STACK_CONFIG[i]?.rotateY ?? 0) * magnitude,
        rotateX: (i: number) => STACK_CONFIG[i]?.rotateX ?? 0,
      };

      if (prefersReducedMotion) {
        gsap.set(['.dclExpHero__revealLine', '.dclExpHero__fadeUp', '.dclExpHero__rule', '.dclExpHero__closing'], { clearProps: 'all' });
        gsap.set(planeEls, { ...settled, opacity: 1 });
        return;
      }

      gsap.set(planeEls, { ...settled, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclExpHero__eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclExpHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclExpHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.35')
        .fromTo('.dclExpHero__intro', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to(planeEls, { opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
        .fromTo('.dclExpHero__supporting', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo('.dclExpHero__closing', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06 }, '-=0.25');

      if (!isMobile && planeEls.length) {
        gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        }).to(planeEls, { z: 0, x: 0, y: (i: number) => i * 10, rotateX: 0, rotateY: 0, duration: 1 }, 0);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop, isMobile, lensCount]);

  return (
    <section id="expertise-hero" ref={rootRef} aria-labelledby="expertise-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1560px] flex-col px-6 pb-8 pt-28 sm:px-10 lg:px-16">
        <div className="grid flex-1 grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5">
              <p data-testid="text-expertise-hero-eyebrow" className="dclHome__eyebrow dclExpHero__eyebrow text-[#9ca3aa]">
                {expertiseHero.eyebrow}
              </p>
              <div className="dclExpHero__rule h-px w-16 origin-left bg-[#8bbfe8]" />
            </div>

            <h1
              id="expertise-hero-title"
              data-testid="text-expertise-hero-title"
              className="dclHome__display mt-8 text-[clamp(3rem,6.4vw,6.2rem)] leading-[.98] tracking-[-.03em]"
            >
              <span className="block overflow-hidden"><span className="dclExpHero__revealLine block">{expertiseHero.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclExpHero__revealLine block">{expertiseHero.headlineLines[1]}</span></span>
            </h1>

            <p data-testid="text-expertise-hero-intro" className="dclExpHero__intro mt-8 max-w-[560px] text-[19px] leading-[1.6] text-white/75 sm:text-[21px]">
              {expertiseHero.intro}
            </p>
          </div>

          <div className="relative lg:col-span-5 lg:flex lg:items-end lg:justify-end">
            <div className="relative mx-auto h-[280px] w-[280px] [perspective:1900px] sm:h-[340px] sm:w-[340px] lg:mx-0 lg:h-[380px] lg:w-[420px]">
              <div ref={stageRef} className="relative h-full w-full [transform-style:preserve-3d]">
                {lenses.map((lens, index) => (
                  <div
                    key={lens.category}
                    data-testid={`hero-lens-${index}`}
                    className="dclExpHero__plane absolute left-0 top-0 flex h-[168px] w-[240px] flex-col justify-between border border-white/22 bg-[#14171d] p-5 shadow-[0_24px_56px_rgba(0,0,0,.5)] sm:h-[190px] sm:w-[270px]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-[2px] w-6 bg-[#8bbfe8]" />
                      <p className="dclHome__eyebrow text-white/40">{lens.category}</p>
                    </div>
                    <p className="dclHome__display text-[1rem] leading-snug text-white/90 sm:text-[1.1rem]">{lens.phrase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-6">
          <p data-testid="text-expertise-hero-supporting" className="dclExpHero__supporting max-w-[640px] text-[16px] leading-7 text-white/55">
            {expertiseHero.supporting}
          </p>
          <div data-testid="text-expertise-hero-closing" className="shrink-0 text-right">
            {expertiseHero.closingLines.map((line) => (
              <p key={line} className="dclExpHero__closing text-[11px] font-semibold uppercase tracking-[.15em] text-white/60">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
