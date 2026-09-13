import { useEffect, useRef, useState } from 'react';
import { howWeThink } from '@/data/about-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CompassSpot {
  x: number;
  y: number;
}

// Four rest positions arranged around the centre point, compass-style, so
// the inactive planes read as a quiet radial backdrop behind the copy.
const COMPASS: CompassSpot[] = [
  { x: 0, y: -168 },
  { x: 176, y: 0 },
  { x: 0, y: 168 },
  { x: -176, y: 0 },
];

export function HowWeThink() {
  const rootRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);
  const planeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current || !driverRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: driverRef.current,
        start: 'top top',
        end: 'bottom bottom',
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
    planeRefs.current.forEach((el, i) => {
      if (!el) return;
      const active = i === activeIndex;
      const spot = COMPASS[i] ?? { x: 0, y: 0 };
      gsap.to(el, {
        x: active ? 0 : spot.x,
        y: active ? 0 : spot.y,
        z: active ? 60 : -50,
        scale: active ? 1.1 : 0.78,
        opacity: active ? 0.3 : 0.55,
        filter: active ? 'blur(0px)' : 'blur(2px)',
        duration: 0.9,
        ease: 'power3.out',
      });
    });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  function goToChapter(index: number) {
    if (!driverRef.current) return;
    const segment = driverRef.current.offsetHeight / howWeThink.chapters.length;
    const target = driverRef.current.offsetTop + segment * index + segment * 0.4;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHowWeThink__intro', '.dclHowWeThink__mobileChapter'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclHowWeThink__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );

      if (!isDesktop) {
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
    <section id="how-we-think" ref={rootRef} aria-labelledby="think-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-[720px] text-center">
          <p data-testid="text-think-eyebrow" className="dclHome__eyebrow dclHowWeThink__intro mb-6 text-[#8bbfe8]">
            How we think
          </p>
          <h2 id="think-title" className="dclHome__display dclHowWeThink__intro text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-.035em]">
            {howWeThink.headlineLines[0]}
            <br />
            {howWeThink.headlineLines[1]}
          </h2>
          <p className="dclHowWeThink__intro mx-auto mt-6 max-w-[540px] text-[16px] leading-7 text-white/55 sm:text-[17px]">{howWeThink.intro}</p>
        </div>

        {isDesktop ? (
          <div ref={driverRef} className="relative mt-8" style={{ height: `${howWeThink.chapters.length * 100}vh` }}>
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:2000px]">
                <div className="relative h-[420px] w-[420px] [transform-style:preserve-3d]">
                  {howWeThink.chapters.map((chapter, index) => (
                    <div
                      key={chapter.title}
                      ref={(el) => {
                        planeRefs.current[index] = el;
                      }}
                      data-testid={`think-plane-${index}`}
                      data-active={activeIndex === index}
                      className="absolute left-1/2 top-1/2 flex h-[130px] w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col justify-between border border-white/25 bg-[#1c2028] p-4"
                    >
                      <div className="h-px w-6 bg-[#8bbfe8]" />
                      <p className="dclHome__eyebrow text-white/50">{chapter.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 min-h-[300px] w-full max-w-[640px] px-6 text-center lg:min-h-[340px]">
                {howWeThink.chapters.map((chapter, index) => (
                  <div key={chapter.title} className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 transition-opacity duration-500" style={{ opacity: activeIndex === index ? 1 : 0 }}>
                    <p data-testid={activeIndex === index ? 'text-think-active-label' : undefined} className="dclHome__eyebrow text-[#8bbfe8]">
                      {chapter.title}
                    </p>
                    <p
                      data-testid={activeIndex === index ? 'text-think-active-question' : undefined}
                      className="dclHome__display mx-auto mt-5 max-w-[560px] text-[clamp(2.1rem,3.4vw,3rem)] leading-[1.08] tracking-[-.02em] text-white"
                    >
                      {chapter.question}
                    </p>
                    <p className="mx-auto mt-6 max-w-[46ch] text-[17px] leading-[1.65] text-white/70">{chapter.copy}</p>
                  </div>
                ))}
              </div>

              <div className="relative z-10 mt-14 flex items-center gap-3">
                {howWeThink.chapters.map((chapter, index) => (
                  <button
                    key={chapter.title}
                    type="button"
                    data-testid={`think-dot-${index}`}
                    aria-label={`Go to ${chapter.title}`}
                    aria-current={activeIndex === index}
                    onClick={() => goToChapter(index)}
                    className="h-1.5 rounded-none transition-[width,background-color] duration-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                    style={{ width: activeIndex === index ? '32px' : '10px', backgroundColor: activeIndex === index ? '#8bbfe8' : 'rgba(255,255,255,.22)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 flex flex-col gap-14">
            {howWeThink.chapters.map((chapter) => (
              <div key={chapter.title} data-testid={`think-mobile-${chapter.title.toLowerCase()}`} className="dclHowWeThink__mobileChapter border-t border-white/12 pt-8 text-center">
                <div className="mx-auto mb-6 h-[70px] w-[150px] border border-white/14 bg-[#101215] p-3 text-left">
                  <div className="h-px w-6 bg-[#8bbfe8]" />
                  <p className="dclHome__eyebrow mt-2 text-white/50">{chapter.title}</p>
                </div>
                <p className="dclHome__eyebrow text-[#8bbfe8]">{chapter.title}</p>
                <p className="dclHome__display mx-auto mt-3 max-w-[420px] text-[clamp(1.8rem,7vw,2.3rem)] leading-[1.1] text-white">{chapter.question}</p>
                <p className="mx-auto mt-4 max-w-[420px] text-[16px] leading-7 text-white/70">{chapter.copy}</p>
              </div>
            ))}
          </div>
        )}

        <div data-testid="text-think-closing" className="dclHowWeThink__closing mx-auto mt-20 max-w-[900px] border-t border-white/12 pt-14 text-center lg:mt-8">
          <p className="dclHome__display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.18] tracking-[-.025em] text-white">{howWeThink.closing}</p>
        </div>
      </div>
    </section>
  );
}
