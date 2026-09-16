import { useEffect, useRef, useState } from 'react';
import { howWeWork } from '@/data/services-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

export function HowWeWork() {
  const rootRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useEffect(() => {
    if (!stagesRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: stagesRef.current,
        start: 'top 65%',
        end: 'bottom 35%',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, howWeWork.stages.length);
          if (next !== scrollIndexRef.current) {
            scrollIndexRef.current = next;
            setScrollIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHowWeWork__revealLine', '.dclHowWeWork__fadeUp', '.dclHowWeWork__rule', '.dclHowWeWork__stage'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclHowWeWork__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclHowWeWork__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclHowWeWork__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
      );
      gsap.fromTo(
        '.dclHowWeWork__stage',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: stagesRef.current, start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="how-we-work" ref={rootRef} aria-labelledby="how-we-work-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <p className="dclHome__eyebrow dclHowWeWork__fadeUp text-[#9ca3aa]">{howWeWork.label}</p>
            <h2 id="how-we-work-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclHowWeWork__revealLine block">{howWeWork.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclHowWeWork__revealLine block">{howWeWork.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="dclHowWeWork__fadeUp max-w-[360px] text-[16px] leading-7 text-white/55">{howWeWork.supporting}</p>
          </div>
        </div>

        <div className="dclHowWeWork__rule mt-12 h-px w-full origin-left bg-white/15 lg:mt-14" />

        <div ref={stagesRef} className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/12">
          {howWeWork.stages.map((stage, index) => {
            const active = isDesktop ? activeIndex === index : true;
            return (
              <div
                key={stage.name}
                data-testid={`how-we-work-stage-${slug(stage.name)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setHoverIndex(index)}
                onMouseLeave={() => isDesktop && setHoverIndex(null)}
                onFocus={() => isDesktop && setHoverIndex(index)}
                onBlur={() => isDesktop && setHoverIndex(null)}
                className="dclHowWeWork__stage cursor-default outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:pl-8 lg:first:pl-0"
              >
                <p className="dclHome__eyebrow transition-colors duration-400" style={{ color: active ? '#ffffff' : 'rgba(255,255,255,.5)' }}>
                  {stage.name}
                </p>
                <div className="mt-3 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '40px' : '16px' }} />
                <p className="mt-4 max-w-[26ch] text-[15.5px] leading-6 transition-colors duration-400" style={{ color: active ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.4)' }}>
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 border-t border-white/12 pt-8 lg:mt-16">
          {howWeWork.statementLines.map((line) => (
            <p key={line} className="dclHome__display text-[clamp(1.1rem,1.6vw,1.35rem)] italic leading-[1.35] text-white/70">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
