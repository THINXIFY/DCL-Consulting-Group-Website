import { useEffect, useRef, useState } from 'react';
import { howWeWorkWithPartners } from '@/data/partners-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function HowWeWorkWithPartners() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => setActiveIndex(getActiveIndex(self.progress, howWeWorkWithPartners.stages.length)),
      });

      gsap.fromTo(
        '.dclHowWeWork__progressRule',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: listRef.current, start: 'top center', end: 'bottom center', scrub: true } },
      );

      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section id="how-we-work-with-partners" ref={rootRef} aria-labelledby="how-we-work-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.85fr_1.4fr] lg:gap-28">
        <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
          <p data-testid="text-how-we-work-eyebrow" className="dclHome__eyebrow mb-5 text-[#8bbfe8]">
            {howWeWorkWithPartners.eyebrow}
          </p>
          <h2 id="how-we-work-title" className="dclHome__display max-w-[430px] text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.04] tracking-[-.03em]">
            {howWeWorkWithPartners.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-[340px] text-[16px] leading-7 text-white/60">{howWeWorkWithPartners.intro}</p>
        </div>

        <div ref={listRef} className="relative border-l border-white/15 pl-10" onMouseLeave={() => setHoveredIndex(null)}>
          <div className="dclHowWeWork__progressRule absolute left-0 top-0 h-full w-px bg-[#8bbfe8]" />
          <div className="flex flex-col gap-14">
            {howWeWorkWithPartners.stages.map((stage, index) => {
              const active = isDesktop ? (hoveredIndex ?? activeIndex) === index : true;
              return (
                <div
                  key={stage.label}
                  data-testid={`how-we-work-stage-${slug(stage.label)}`}
                  data-active={active}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => isDesktop && setHoveredIndex(index)}
                  onFocus={() => isDesktop && setHoveredIndex(index)}
                  onBlur={() => isDesktop && setHoveredIndex(null)}
                  className="outline-none transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  style={{ opacity: active ? 1 : 0.4 }}
                >
                  <p className="dclHome__eyebrow text-[#8bbfe8]">{stage.label}</p>
                  <h3 className="dclHome__display mt-3 text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.05] tracking-[-.02em]">{stage.headline}</h3>
                  <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-white/60">{stage.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
