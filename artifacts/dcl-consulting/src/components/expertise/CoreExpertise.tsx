import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { coreExpertise } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function CoreExpertise() {
  const rootRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current || !indexRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: indexRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, coreExpertise.areas.length);
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
    if (!isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    if (stageRef.current) {
      gsap.fromTo(
        stageRef.current.querySelector('.dclExpertiseStage__title'),
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.out' },
      );
      gsap.fromTo(
        stageRef.current.querySelectorAll('.dclExpertiseStage__fade'),
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      );
    }

    sheetRefs.current.forEach((el, i) => {
      if (!el) return;
      const parity = i % 2 === 0 ? 1 : -1;
      const depth = ((activeIndex + i) % 3) - 1;
      gsap.to(el, {
        rotateY: parity * (6 + activeIndex * 0.8),
        z: depth * 22,
        x: parity * (6 + i * 4),
        duration: 0.7,
        ease: 'power3.out',
      });
    });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclExpertise__intro', '.dclExpertise__indexRow', '.dclExpertise__sheet'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclExpertise__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      if (isDesktop) {
        gsap.fromTo(
          '.dclExpertise__indexRow',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
        );
        gsap.fromTo(
          '.dclExpertise__sheet',
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  const active = coreExpertise.areas[activeIndex] ?? coreExpertise.areas[0]!;

  return (
    <section id="core-expertise" ref={rootRef} aria-labelledby="core-expertise-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[680px]">
          <h2 id="core-expertise-title" className="dclHome__display dclExpertise__intro text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.02] tracking-[-.035em]">
            {coreExpertise.headlineLines[0]}
            <br />
            {coreExpertise.headlineLines[1]}
          </h2>
          <p className="dclExpertise__intro mt-6 max-w-[560px] text-[16px] leading-7 text-white/55 sm:text-[17px]">{coreExpertise.intro}</p>
        </div>

        {isDesktop ? (
          <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-[.42fr_.58fr]">
            <div ref={indexRef} className="border-t border-white/12">
              {coreExpertise.areas.map((area, index) => {
                const isActive = activeIndex === index;
                return (
                  <div
                    key={area.title}
                    data-testid={`expertise-index-${slug(area.title)}`}
                    data-active={isActive}
                    tabIndex={0}
                    aria-current={isActive ? 'true' : undefined}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onFocus={() => setHoverIndex(index)}
                    onBlur={() => setHoverIndex(null)}
                    className="dclExpertise__indexRow group flex cursor-pointer items-center justify-between gap-4 border-b border-white/12 py-7 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <div>
                      <p
                        className="dclHome__display text-[clamp(1.3rem,2.2vw,1.7rem)] leading-snug transition-[color,transform] duration-400"
                        style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,.45)', transform: isActive ? 'translateX(6px)' : 'translateX(0)' }}
                      >
                        {area.title}
                      </p>
                      <div className="mt-3 h-px bg-[#8bbfe8] transition-all duration-400" style={{ width: isActive ? '48px' : '0px' }} />
                    </div>
                    {isActive && <ArrowUpRight size={18} strokeWidth={1.4} className="shrink-0 text-[#8bbfe8]" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 hidden lg:block lg:[perspective:1600px]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      sheetRefs.current[i] = el;
                    }}
                    className="dclExpertise__sheet absolute inset-6 border border-white/10 bg-white/[.02]"
                    style={{ transform: `translateZ(${(i - 1) * 20}px)` }}
                  />
                ))}
              </div>

              <div ref={stageRef} className="relative min-h-[360px] border-l border-white/12 pl-10">
                <p className="dclExpertiseStage__fade dclHome__eyebrow text-[#8bbfe8]">{active.supportingLine}</p>
                <h3 data-testid="expertise-stage-title" className="dclExpertiseStage__title dclHome__display mt-5 text-[clamp(2.2rem,3.6vw,3.2rem)] leading-[1.05] tracking-[-.025em]">
                  {active.title}
                </h3>
                <p data-testid="expertise-stage-description" className="dclExpertiseStage__fade mt-7 max-w-[52ch] text-[17px] leading-[1.7] text-white/75">
                  {active.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 border-t border-white/12">
            {coreExpertise.areas.map((area, index) => {
              const expanded = expandedIndex === index;
              return (
                <div key={area.title} data-testid={`expertise-accordion-${slug(area.title)}`} className="border-b border-white/12">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`expertise-panel-${slug(area.title)}`}
                    onClick={() => setExpandedIndex(expanded ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <div>
                      <p className="dclHome__display text-[1.4rem] leading-snug text-white">{area.title}</p>
                      <p className="dclHome__eyebrow mt-2 text-[#8bbfe8]">{area.supportingLine}</p>
                    </div>
                    {expanded ? <Minus size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-white/70" /> : <Plus size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-white/70" />}
                  </button>
                  <div
                    id={`expertise-panel-${slug(area.title)}`}
                    className="overflow-hidden transition-[max-height] duration-500 ease-out"
                    style={{ maxHeight: expanded ? '260px' : '0px' }}
                  >
                    <p className="max-w-[60ch] pb-7 text-[16px] leading-7 text-white/70">{area.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
