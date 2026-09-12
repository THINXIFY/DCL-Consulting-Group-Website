import { useEffect, useRef, useState } from 'react';
import { howWeThink } from '@/data/about-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const TONES = ['#171714', '#191813', '#151510', '#1a1815'];

export function HowWeThink() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
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
          if (progressRef.current) progressRef.current.style.transform = `scaleY(${self.progress})`;
          const next = getActiveIndex(self.progress, howWeThink.length);
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
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclHowWeThink__intro',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclHowWeThink__chapter',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
      gsap.fromTo(
        '.dclHowWeThink__closing',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.dclHowWeThink__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="how-we-think"
      ref={rootRef}
      aria-labelledby="think-title"
      className="px-6 py-24 text-white transition-colors duration-700 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
      style={{ backgroundColor: isDesktop ? TONES[activeIndex] : TONES[0] }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
          <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
            <p data-testid="text-think-eyebrow" className="dclHome__eyebrow dclHowWeThink__intro mb-6 text-[#8bbfe8]">
              How we think
            </p>
            <h2 id="think-title" className="dclHome__display dclHowWeThink__intro max-w-[480px] text-[clamp(2.6rem,5.2vw,4.4rem)] leading-[.94] tracking-[-.04em]">
              Better decisions begin with better questions.
            </h2>
            <p className="dclHowWeThink__intro mt-6 max-w-[440px] text-[16px] leading-7 text-white/55 sm:text-[17px]">
              Before forming a view, DCL considers an opportunity from multiple perspectives, establishing the context, examining the fundamentals, challenging assumptions and focusing attention on the factors most likely to influence the outcome.
            </p>

            {isDesktop && (
              <div className="dclHowWeThink__intro mt-14 border-t border-white/12 pt-10">
                <p
                  key={activeIndex}
                  data-testid="text-think-active-question"
                  className="max-w-[420px] font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] italic leading-[1.3] text-[#c6e3fa] transition-opacity duration-500"
                >
                  {howWeThink[activeIndex].question}
                </p>
              </div>
            )}
          </div>

          <div ref={listRef} className="relative lg:pl-10">
            {isDesktop && (
              <div className="absolute left-0 top-0 hidden h-full w-px bg-white/10 lg:block">
                <div ref={progressRef} className="h-full w-full origin-top bg-[#8bbfe8]" style={{ transform: 'scaleY(0)' }} />
              </div>
            )}
            <div className="flex flex-col">
              {howWeThink.map((chapter, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={chapter.title}
                    data-testid={`think-chapter-${chapter.title.toLowerCase()}`}
                    data-active={active}
                    className="dclHowWeThink__chapter min-h-[240px] border-b border-white/12 py-10 transition-opacity duration-500 lg:min-h-[70vh] lg:py-0"
                    style={{ opacity: active ? 1 : 0.35 }}
                  >
                    <div className="flex h-full flex-col justify-center">
                      <h3 className="dclHome__display text-[clamp(2rem,3.6vw,3.4rem)] leading-none tracking-[-.03em]">{chapter.title}</h3>
                      <span
                        className="mt-5 block h-px bg-[#8bbfe8] transition-transform duration-500"
                        style={{ width: '72px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                      />
                      {!isDesktop && (
                        <p className="mt-5 max-w-[420px] font-serif text-[1.3rem] italic leading-snug text-[#c6e3fa]">{chapter.question}</p>
                      )}
                      <p className="mt-5 max-w-[460px] text-[16px] leading-7 text-white/60 sm:text-[17px]">{chapter.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="dclHowWeThink__closing dclHome__display mt-24 max-w-[900px] text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.15] tracking-[-.02em] text-white">
          Information creates value when it leads to clearer judgement.
        </p>
      </div>
    </section>
  );
}
