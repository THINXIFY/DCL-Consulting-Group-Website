import { useEffect, useRef, useState } from 'react';
import { approach } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Approach() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => setActiveIndex(getActiveIndex(self.progress, approach.length)),
      });

      gsap.fromTo(
        '.dclApproach__progressRule',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: listRef.current, start: 'top center', end: 'bottom center', scrub: true },
        },
      );

      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section
      id="approach"
      ref={rootRef}
      aria-labelledby="approach-title"
      className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
      style={{ backgroundColor: '#edeef0' }}
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.85fr_1.4fr] lg:gap-28">
        <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
          <h2 id="approach-title" className="dclHome__display max-w-[430px] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[.93] tracking-[-.04em] text-[#080a0d]">
            From information to informed judgement.
          </h2>
          <p className="mt-8 max-w-[320px] text-[16px] leading-7 text-[#35536a]">
            We make the complex legible: a process designed to move from the right question to a decision you can stand behind.
          </p>
        </div>
        <div ref={listRef} className="relative border-l border-[#080a0d]/15 pl-10">
          <div className="dclApproach__progressRule absolute left-0 top-0 h-full w-px bg-[#8bbfe8]" />
          <div className="flex flex-col gap-14">
            {approach.map((stage, index) => {
              const active = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={stage.title}
                  data-testid={`text-stage-${stage.title.toLowerCase()}`}
                  data-active={active}
                  className="transition-opacity duration-500"
                  style={{ opacity: active ? 1 : 0.35 }}
                >
                  <h3 className="dclHome__display text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-.03em] text-[#080a0d]">{stage.title}</h3>
                  <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-[#35536a]">{stage.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
