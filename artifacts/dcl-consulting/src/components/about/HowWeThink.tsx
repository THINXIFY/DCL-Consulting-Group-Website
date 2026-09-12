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
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclHowWeThink__row',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
      gsap.fromTo(
        '.dclHowWeThink__closing',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.dclHowWeThink__closing', start: 'top 88%' } },
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
        {isDesktop ? (
          <div className="grid gap-16 lg:grid-cols-[.58fr_.06fr_1.36fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p data-testid="text-think-eyebrow" className="dclHome__eyebrow dclHowWeThink__intro mb-6 text-[#8bbfe8]">
                How we think
              </p>
              <h2 id="think-title" className="dclHome__display dclHowWeThink__intro max-w-[420px] text-[clamp(2.6rem,4.4vw,3.6rem)] leading-[.96] tracking-[-.035em]">
                Better decisions begin with better questions.
              </h2>
              <p className="dclHowWeThink__intro mt-6 max-w-[400px] text-[16px] leading-7 text-white/50">
                Before forming a view, DCL considers an opportunity from multiple perspectives, establishing the context, examining the fundamentals, challenging assumptions and focusing attention on the factors most likely to influence the outcome.
              </p>

              <div className="dclHowWeThink__intro relative mt-16 min-h-[360px] border-t border-white/12 pt-10">
                {howWeThink.map((chapter, index) => (
                  <div key={chapter.title} className="absolute inset-x-0 top-10 transition-opacity duration-500" style={{ opacity: activeIndex === index ? 1 : 0 }}>
                    <p data-testid={activeIndex === index ? 'text-think-active-label' : undefined} className="dclHome__eyebrow text-[#8bbfe8]">
                      {chapter.title}
                    </p>
                    <p
                      data-testid={activeIndex === index ? 'text-think-active-question' : undefined}
                      className="dclHome__display mt-5 max-w-[480px] text-[clamp(2.4rem,4vw,4.25rem)] leading-[1.05] tracking-[-.03em] text-white"
                    >
                      {chapter.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="h-full w-px bg-white/10">
                <div ref={progressRef} className="h-full w-full origin-top bg-[#8bbfe8]" style={{ transform: 'scaleY(0)' }} />
              </div>
            </div>

            <div ref={listRef} className="flex flex-col">
              {howWeThink.map((chapter, index) => {
                const active = activeIndex === index;
                return (
                  <div
                    key={chapter.title}
                    data-testid={`think-reading-${index}`}
                    data-active={active}
                    className="dclHowWeThink__row flex min-h-[62vh] flex-col justify-center border-b border-white/10 py-10 transition-opacity duration-500"
                    style={{ opacity: active ? 1 : 0.32 }}
                  >
                    <p className="max-w-[46ch] text-[19px] leading-[1.65] text-white/85 sm:text-[21px]">{chapter.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <p data-testid="text-think-eyebrow" className="dclHome__eyebrow dclHowWeThink__intro mb-6 text-[#8bbfe8]">
              How we think
            </p>
            <h2 id="think-title" className="dclHome__display dclHowWeThink__intro max-w-[420px] text-[clamp(2.4rem,7vw,3rem)] leading-[.98] tracking-[-.03em]">
              Better decisions begin with better questions.
            </h2>
            <p className="dclHowWeThink__intro mt-6 max-w-[440px] text-[16px] leading-7 text-white/50">
              Before forming a view, DCL considers an opportunity from multiple perspectives, establishing the context, examining the fundamentals, challenging assumptions and focusing attention on the factors most likely to influence the outcome.
            </p>

            <div className="mt-14 flex flex-col gap-14">
              {howWeThink.map((chapter) => (
                <div key={chapter.title} data-testid={`think-mobile-${chapter.title.toLowerCase()}`} className="dclHowWeThink__row border-t border-white/12 pt-8">
                  <p className="dclHome__eyebrow text-[#8bbfe8]">{chapter.title}</p>
                  <p className="dclHome__display mt-4 text-[clamp(1.8rem,7vw,2.4rem)] leading-[1.1] text-white">{chapter.question}</p>
                  <p className="mt-4 max-w-[520px] text-[16px] leading-7 text-white/70">{chapter.copy}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dclHowWeThink__closing mt-24 border-t border-white/12 pt-14 lg:mt-32">
          <p className="dclHome__display max-w-[1040px] text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.15] tracking-[-.025em] text-white">
            Information creates value when it leads to clearer judgement.
          </p>
        </div>
      </div>
    </section>
  );
}
