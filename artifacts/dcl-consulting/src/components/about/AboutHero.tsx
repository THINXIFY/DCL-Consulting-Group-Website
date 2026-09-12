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
}

const PLANE_CONFIG: PlaneConfig[] = [
  { z: 70, x: 0, y: -36, rotateY: -3, rotateX: 1 },
  { z: 38, x: 44, y: 8, rotateY: -1.4, rotateX: 0.6 },
  { z: 8, x: 88, y: 54, rotateY: 0.2, rotateX: 0 },
  { z: -22, x: 132, y: 100, rotateY: 1.6, rotateX: -0.6 },
  { z: -52, x: 176, y: 146, rotateY: 2.8, rotateX: -1 },
];

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
      const magnitude = isDesktop ? 1 : isMobile ? 0.35 : 0.6;
      const settledPosition = {
        xPercent: -50,
        yPercent: -50,
        z: (i: number) => (PLANE_CONFIG[i]?.z ?? 0) * magnitude,
        x: (i: number) => (PLANE_CONFIG[i]?.x ?? 0) * magnitude,
        y: (i: number) => (PLANE_CONFIG[i]?.y ?? 0) * magnitude,
        rotateY: (i: number) => (PLANE_CONFIG[i]?.rotateY ?? 0) * magnitude,
        rotateX: (i: number) => (PLANE_CONFIG[i]?.rotateX ?? 0) * magnitude,
      };

      if (prefersReducedMotion) {
        gsap.set(['.dclAboutHero__revealLine', '.dclAboutHero__fadeUp', '.dclAboutHero__rule', '.dclAboutHero__closing'], { clearProps: 'all' });
        gsap.set(planeEls, { ...settledPosition, opacity: 1 });
        return;
      }

      gsap.set(planeEls, { ...settledPosition, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclAboutHero__eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclAboutHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclAboutHero__revealLine', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.4')
        .fromTo('.dclAboutHero__emphasis', { color: '#ffffff' }, { color: '#8bbfe8', duration: 0.5 }, '-=0.3')
        .to(planeEls, { opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.7')
        .fromTo('.dclAboutHero__intro', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .fromTo('.dclAboutHero__supporting', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.35')
        .fromTo('.dclAboutHero__closing', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

      if (!isMobile && planeEls.length) {
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        const separation = isDesktop ? 1.4 : 1.15;
        scrollTl
          .to(
            planeEls,
            {
              z: (i) => (PLANE_CONFIG[i]?.z ?? 0) * separation,
              y: (i) => (PLANE_CONFIG[i]?.y ?? 0) * 1.2,
              duration: 1,
            },
            0,
          )
          .to('.dclAboutHero__headline', { yPercent: -12 }, 0)
          .to(planeEls[1] ?? planeEls[0], { rotateY: '+=4', duration: 1 }, 0.15)
          .to(planeEls, { z: 0, x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1 }, 0.55);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop, isMobile, planeCount]);

  const { before, match, after } = splitEmphasis(aboutHero.headlineLines[0], aboutHero.headlineEmphasis);

  return (
    <section id="about-hero" ref={rootRef} aria-labelledby="about-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1560px] flex-col px-6 pb-8 pt-28 sm:px-10 lg:px-16">
        <div className="relative grid flex-1 grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="relative z-10 lg:col-span-7">
            <div className="flex items-center gap-5">
              <p data-testid="text-about-hero-eyebrow" className="dclHome__eyebrow dclAboutHero__eyebrow text-[#9ca3aa]">
                {aboutHero.eyebrow}
              </p>
              <div className="dclAboutHero__rule h-px w-16 origin-left bg-[#8bbfe8]" />
            </div>

            <h1
              id="about-hero-title"
              data-testid="text-about-hero-title"
              className="dclHome__display dclAboutHero__headline mt-8 text-[clamp(4rem,7vw,7.4rem)] leading-[.94] tracking-[-.03em]"
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

            <p data-testid="text-about-hero-intro" className="dclAboutHero__intro mt-9 max-w-[520px] text-[19px] leading-[1.6] text-white/75 sm:text-[21px]">
              {aboutHero.intro}
            </p>
            <p data-testid="text-about-hero-supporting" className="dclAboutHero__supporting mt-6 max-w-[480px] text-[16px] leading-7 text-white/55">
              {aboutHero.supporting}
            </p>
          </div>

          <div className="relative lg:col-span-7 lg:col-start-6 lg:-ml-[6%]">
            <div className="relative mx-auto h-[320px] w-[260px] sm:h-[380px] sm:w-[300px] lg:mx-0 lg:h-[520px] lg:w-full lg:[perspective:1800px]">
              <div ref={stageRef} className="relative h-full w-full lg:[transform-style:preserve-3d]">
                {planes.map((plane, index) => (
                  <div
                    key={plane.label}
                    data-testid={`hero-document-plane-${index}`}
                    className="dclAboutHero__plane absolute left-1/2 top-1/2 flex h-[240px] w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col justify-between border border-white/12 bg-[#12151a] p-5 shadow-[0_30px_70px_rgba(0,0,0,.45)] sm:h-[270px] sm:w-[210px] lg:h-[300px] lg:w-[230px]"
                  >
                    <div className="h-[3px] w-8 bg-[#8bbfe8]" />
                    <div>
                      <p className="dclHome__eyebrow text-white/40">Document</p>
                      <p className="dclHome__display mt-2 text-[1.15rem] leading-tight text-white/90">{plane.label}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-px w-full bg-white/12" />
                      <div className="h-px w-4/5 bg-white/12" />
                      <div className="h-px w-3/5 bg-white/12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div data-testid="text-about-hero-closing" className="dclAboutHero__closing mt-10 flex flex-wrap items-center gap-4 border-t border-white/12 pt-6 lg:mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/60">{aboutHero.closing}</p>
        </div>
      </div>
    </section>
  );
}
