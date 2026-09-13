import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { aboutHero, heroDocumentPlanes } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePointerTilt } from '@/hooks/use-pointer-tilt';

interface PlaneConfig {
  z: number;
  x: number;
  y: number;
  rotateY: number;
  rotateX: number;
  opacity: number;
}

// Planes fan out symmetrically from a centred spine (index 2 of 5), so the
// whole composition reads as one centred object rather than a side stack.
function planeConfig(index: number, count: number): PlaneConfig {
  const center = (count - 1) / 2;
  const offset = index - center;
  return {
    z: -Math.abs(offset) * 40,
    x: offset * 152,
    y: Math.abs(offset) * -14,
    rotateY: offset * -8,
    rotateX: 2,
    opacity: offset === 0 ? 1 : Math.max(0.62, 1 - Math.abs(offset) * 0.14),
  };
}

function splitEmphasis(line: string, emphasis: string) {
  const index = line.indexOf(emphasis);
  if (index === -1) return { before: line, match: '', after: '' };
  return { before: line.slice(0, index), match: emphasis, after: line.slice(index + emphasis.length) };
}

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  usePointerTilt(stageRef, { maxRotateX: 2, maxRotateY: 3 });

  const planeCount = isMobile ? 3 : isDesktop ? 5 : 4;
  const planes = heroDocumentPlanes.slice(0, planeCount);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const planeEls = gsap.utils.toArray<HTMLElement>('.dclAboutHero__plane');
      const magnitude = isDesktop ? 1 : isMobile ? 0.5 : 0.75;
      const configs = planes.map((_, i) => planeConfig(i, planeCount));
      const settledPosition = {
        xPercent: -50,
        yPercent: -50,
        z: (i: number) => (configs[i]?.z ?? 0) * magnitude,
        x: (i: number) => (configs[i]?.x ?? 0) * magnitude,
        y: (i: number) => (configs[i]?.y ?? 0) * magnitude,
        rotateY: (i: number) => (configs[i]?.rotateY ?? 0) * magnitude,
        rotateX: (i: number) => configs[i]?.rotateX ?? 0,
      };

      if (prefersReducedMotion) {
        gsap.set(['.dclAboutHero__revealLine', '.dclAboutHero__fadeUp', '.dclAboutHero__rule', '.dclAboutHero__closing'], { clearProps: 'all' });
        gsap.set(planeEls, { ...settledPosition, opacity: (i: number) => configs[i]?.opacity ?? 1 });
        return;
      }

      gsap.set(planeEls, { ...settledPosition, opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclAboutHero__eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclAboutHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclAboutHero__revealLine', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.35')
        .fromTo('.dclAboutHero__emphasis', { color: '#ffffff' }, { color: '#8bbfe8', duration: 0.5 }, '-=0.3')
        .fromTo('.dclAboutHero__intro', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .fromTo('.dclAboutHero__supporting', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
        .to(
          planeEls,
          {
            opacity: (i: number) => configs[i]?.opacity ?? 1,
            scale: 1,
            duration: 0.9,
            stagger: { each: 0.07, from: 'center' },
            ease: 'power3.out',
          },
          '-=0.5',
        )
        .fromTo('.dclAboutHero__closing', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

      if (!isMobile && planeEls.length) {
        gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        }).to(planeEls, { z: 0, x: 0, y: 0, rotateX: 0, rotateY: 0, opacity: 1, duration: 1 }, 0);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop, isMobile, planeCount]);

  const { before, match, after } = splitEmphasis(aboutHero.headlineLines[0], aboutHero.headlineEmphasis);

  return (
    <section id="about-hero" ref={rootRef} aria-labelledby="about-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1100px] flex-col items-center justify-center px-6 py-28 text-center sm:px-10">
        <div className="flex items-center gap-4">
          <div className="dclAboutHero__rule h-px w-10 origin-right bg-[#8bbfe8]" />
          <p data-testid="text-about-hero-eyebrow" className="dclHome__eyebrow dclAboutHero__eyebrow text-[#9ca3aa]">
            {aboutHero.eyebrow}
          </p>
          <div className="dclAboutHero__rule h-px w-10 origin-left bg-[#8bbfe8]" />
        </div>

        <h1
          id="about-hero-title"
          data-testid="text-about-hero-title"
          className="dclHome__display mt-8 text-[clamp(2.8rem,7vw,6.4rem)] leading-[.98] tracking-[-.03em]"
        >
          <span className="block overflow-hidden">
            <span className="dclAboutHero__revealLine block">
              {before}
              <span className="dclAboutHero__emphasis">{match}</span>
              {after}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="dclAboutHero__revealLine block">{aboutHero.headlineLines[1]}</span>
          </span>
        </h1>

        <p data-testid="text-about-hero-intro" className="dclAboutHero__intro mx-auto mt-8 max-w-[620px] text-[19px] leading-[1.6] text-white/75 sm:text-[21px]">
          {aboutHero.intro}
        </p>
        <p data-testid="text-about-hero-supporting" className="dclAboutHero__supporting mx-auto mt-5 max-w-[560px] text-[16px] leading-7 text-white/55">
          {aboutHero.supporting}
        </p>

        <div className="relative mt-16 h-[150px] w-full max-w-[860px] sm:h-[190px] lg:h-[230px] lg:[perspective:2000px]">
          <div ref={stageRef} className="relative h-full w-full lg:[transform-style:preserve-3d]">
            {planes.map((plane, index) => (
              <div
                key={plane.label}
                data-testid={`hero-document-plane-${index}`}
                className="dclAboutHero__plane absolute left-1/2 top-1/2 flex h-[130px] w-[104px] -translate-x-1/2 -translate-y-1/2 flex-col justify-between border border-white/20 bg-[#181c22] p-3 shadow-[0_20px_50px_rgba(0,0,0,.45)] sm:h-[164px] sm:w-[130px] sm:p-4 lg:h-[190px] lg:w-[150px]"
              >
                <div className="h-[2px] w-5 bg-[#8bbfe8]" />
                <p className="dclHome__display text-[.72rem] leading-tight text-white/90 sm:text-[.85rem]">{plane.label}</p>
                <div className="flex flex-col gap-1.5">
                  <div className="h-px w-full bg-white/12" />
                  <div className="h-px w-3/5 bg-white/12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-testid="text-about-hero-closing" className="dclAboutHero__closing mt-14 border-t border-white/12 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/60">{aboutHero.closing}</p>
        </div>
      </div>
    </section>
  );
}
