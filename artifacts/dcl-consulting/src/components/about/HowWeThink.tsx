import { useEffect, useRef, useState } from 'react';
import { howWeThink } from '@/data/about-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface PlaneState {
  z: number;
  x: number;
  y: number;
  rotateY: number;
  rotateX: number;
  opacity: number;
}

// Indexed [activeChapter][planeIndex]. Planes stay in a fixed reading
// order (Context, Fundamentals, Risk, Judgement); only their depth,
// offset and prominence change as the active chapter changes, so the
// composition itself narrates information -> analysis -> clarity.
const PLANE_STATES: PlaneState[][] = [
  [
    { z: 60, x: -8, y: -64, rotateY: -3, rotateX: 1.5, opacity: 1 },
    { z: 10, x: 14, y: -16, rotateY: -1, rotateX: 0.5, opacity: 0.5 },
    { z: -35, x: -10, y: 30, rotateY: 1.5, rotateX: -0.8, opacity: 0.4 },
    { z: -75, x: 16, y: 76, rotateY: 3, rotateX: -1.5, opacity: 0.3 },
  ],
  [
    { z: -10, x: -6, y: -48, rotateY: -1, rotateX: 0.5, opacity: 0.5 },
    { z: 50, x: 10, y: -14, rotateY: -2, rotateX: 1, opacity: 1 },
    { z: -5, x: -8, y: 22, rotateY: 1, rotateX: -0.5, opacity: 0.55 },
    { z: -25, x: 12, y: 56, rotateY: 2, rotateX: -1, opacity: 0.42 },
  ],
  [
    { z: -20, x: -8, y: -40, rotateY: -1, rotateX: 0.5, opacity: 0.4 },
    { z: -5, x: 6, y: -12, rotateY: -0.5, rotateX: 0.3, opacity: 0.5 },
    { z: 65, x: 34, y: 16, rotateY: 6, rotateX: -3, opacity: 1 },
    { z: -40, x: 6, y: 50, rotateY: 1.5, rotateX: -0.8, opacity: 0.45 },
  ],
  [
    { z: 0, x: 0, y: -30, rotateY: 0, rotateX: 0, opacity: 0.7 },
    { z: 0, x: 0, y: -10, rotateY: 0, rotateX: 0, opacity: 0.82 },
    { z: 0, x: 0, y: 10, rotateY: 0, rotateX: 0, opacity: 0.92 },
    { z: 0, x: 0, y: 30, rotateY: 0, rotateX: 0, opacity: 1 },
  ],
];

export function HowWeThink() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const planeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, howWeThink.chapters.length);
          if (next !== activeIndexRef.current) {
            activeIndexRef.current = next;
            setActiveIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const states = PLANE_STATES[activeIndex] ?? PLANE_STATES[0]!;
    planeRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = states[i];
      if (!target) return;
      gsap.to(el, { ...target, duration: 0.9, ease: 'power3.out' });
    });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHowWeThink__intro', '.dclHowWeThink__row', '.dclHowWeThink__closing', '.dclHowWeThink__plane', '.dclHowWeThink__mobileChapter'], {
          clearProps: 'all',
        });
        return;
      }

      gsap.fromTo(
        '.dclHowWeThink__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );

      if (isDesktop) {
        gsap.fromTo(
          '.dclHowWeThink__plane',
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
        );
        gsap.fromTo(
          '.dclHowWeThink__row',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
        );
      } else {
        gsap.utils.toArray<HTMLElement>('.dclHowWeThink__mobileChapter').forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
      }

      gsap.fromTo(
        '.dclHowWeThink__closing',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.dclHowWeThink__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="how-we-think" ref={rootRef} aria-labelledby="think-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[680px]">
          <p data-testid="text-think-eyebrow" className="dclHome__eyebrow dclHowWeThink__intro mb-6 text-[#8bbfe8]">
            How we think
          </p>
          <h2 id="think-title" className="dclHome__display dclHowWeThink__intro text-[clamp(2.6rem,5vw,4.2rem)] leading-[.98] tracking-[-.035em]">
            {howWeThink.headlineLines[0]}
            <br />
            {howWeThink.headlineLines[1]}
          </h2>
          <p className="dclHowWeThink__intro mt-6 max-w-[560px] text-[16px] leading-7 text-white/55 sm:text-[17px]">{howWeThink.intro}</p>
        </div>

        {isDesktop ? (
          <div className="mt-20 grid gap-16 lg:mt-24 lg:grid-cols-[.42fr_.58fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative h-[360px] w-full lg:h-[440px] lg:[perspective:1600px]">
                <div className="relative h-full w-full lg:[transform-style:preserve-3d]">
                  {howWeThink.chapters.map((chapter, index) => (
                    <div
                      key={chapter.title}
                      ref={(el) => {
                        planeRefs.current[index] = el;
                      }}
                      data-testid={`think-plane-${index}`}
                      data-active={activeIndex === index}
                      className="dclHowWeThink__plane absolute left-1/2 top-1/2 flex h-[132px] w-[280px] -translate-x-1/2 -translate-y-1/2 flex-col justify-between border p-5 transition-[border-color] duration-500"
                      style={{
                        borderColor: activeIndex === index ? '#8bbfe8' : 'rgba(255,255,255,.14)',
                        background: activeIndex === index ? '#171714' : '#101215',
                      }}
                    >
                      <div className="h-px w-8 bg-[#8bbfe8]" />
                      <div>
                        <p className="dclHome__eyebrow text-white/45">{chapter.title}</p>
                        <p className="dclHome__display mt-1 text-[1.15rem] leading-tight text-white">{chapter.planePhrase}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-12 min-h-[150px]">
                {howWeThink.chapters.map((chapter, index) => (
                  <div key={chapter.title} className="absolute inset-x-0 top-0 transition-opacity duration-500" style={{ opacity: activeIndex === index ? 1 : 0 }}>
                    <p data-testid={activeIndex === index ? 'text-think-active-label' : undefined} className="dclHome__eyebrow text-[#8bbfe8]">
                      {chapter.title}
                    </p>
                    <p
                      data-testid={activeIndex === index ? 'text-think-active-question' : undefined}
                      className="dclHome__display mt-4 max-w-[420px] text-[clamp(2rem,3vw,2.6rem)] leading-[1.08] tracking-[-.02em] text-white"
                    >
                      {chapter.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div ref={listRef} className="flex flex-col">
              {howWeThink.chapters.map((chapter, index) => {
                const active = activeIndex === index;
                return (
                  <div
                    key={chapter.title}
                    data-testid={`think-reading-${index}`}
                    data-active={active}
                    className="dclHowWeThink__row flex min-h-[64vh] flex-col justify-center border-b border-white/10 py-10 transition-opacity duration-500"
                    style={{ opacity: active ? 1 : 0.3 }}
                  >
                    <p className="max-w-[46ch] text-[19px] leading-[1.65] text-white/85 sm:text-[21px]">{chapter.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-14 flex flex-col gap-12">
            {howWeThink.chapters.map((chapter) => (
              <div key={chapter.title} data-testid={`think-mobile-${chapter.title.toLowerCase()}`} className="dclHowWeThink__mobileChapter border-t border-white/12 pt-8">
                <div className="mb-6 h-[64px] w-[140px] -rotate-2 border border-white/14 bg-[#101215] p-3">
                  <div className="h-px w-6 bg-[#8bbfe8]" />
                  <p className="dclHome__eyebrow mt-2 text-white/50">{chapter.title}</p>
                </div>
                <p className="dclHome__eyebrow text-[#8bbfe8]">{chapter.title}</p>
                <p className="dclHome__display mt-3 text-[clamp(1.8rem,7vw,2.3rem)] leading-[1.1] text-white">{chapter.question}</p>
                <p className="mt-4 max-w-[520px] text-[16px] leading-7 text-white/70">{chapter.copy}</p>
              </div>
            ))}
          </div>
        )}

        <div data-testid="text-think-closing" className="dclHowWeThink__closing mt-24 border-t border-white/12 pt-14 lg:mt-32">
          <p className="dclHome__display max-w-[1040px] text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.15] tracking-[-.025em] text-white">{howWeThink.closing}</p>
        </div>
      </div>
    </section>
  );
}
