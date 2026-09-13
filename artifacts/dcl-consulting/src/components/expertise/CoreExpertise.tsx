import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { coreExpertise } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function CoreExpertise() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rowsRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: rowsRef.current,
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
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclExpertise__intro', '.dclExpertise__row', '.dclExpertise__closing'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclExpertise__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      if (isDesktop) {
        gsap.fromTo(
          '.dclExpertise__row',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
        );
      }
      gsap.fromTo(
        '.dclExpertise__closing',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.dclExpertise__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="core-expertise" ref={rootRef} aria-labelledby="core-expertise-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
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
          <div ref={rowsRef} className="mt-16 border-t border-white/12 lg:mt-20">
            {coreExpertise.areas.map((area, index) => {
              const active = activeIndex === index;
              return (
                <div
                  key={area.title}
                  data-testid={`expertise-row-${slug(area.title)}`}
                  data-active={active}
                  tabIndex={0}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                  className="dclExpertise__row cursor-pointer border-b border-white/12 py-8 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-10"
                >
                  <div className="flex items-start justify-between gap-8">
                    <p
                      className="dclHome__display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.05] transition-[color,transform] duration-400"
                      style={{ color: active ? '#ffffff' : 'rgba(255,255,255,.4)', transform: active ? 'translateX(8px)' : 'translateX(0)' }}
                    >
                      {area.title}
                    </p>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.4}
                      aria-hidden="true"
                      className="mt-2 shrink-0 text-[#8bbfe8] transition-all duration-400"
                      style={{ opacity: active ? 1 : 0.25, transform: active ? 'translate(2px,-2px)' : 'translate(0,0)' }}
                    />
                  </div>
                  <div className="h-px transition-all duration-500" style={{ width: active ? '64px' : '0px', backgroundColor: '#8bbfe8', marginTop: '16px' }} />

                  <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out" style={{ maxHeight: active ? '220px' : '0px', opacity: active ? 1 : 0 }}>
                    <p data-testid={active ? 'expertise-supporting-active' : undefined} className="mt-4 max-w-[60ch] text-[16px] font-medium leading-6 text-[#8bbfe8]">
                      {area.supportingLine}
                    </p>
                    <p className="mt-3 max-w-[65ch] pb-2 text-[16px] leading-7 text-white/70 sm:text-[17px]">{area.description}</p>
                  </div>
                </div>
              );
            })}
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
                    className="flex w-full items-center justify-between gap-6 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <div>
                      <p className="dclHome__display text-[1.5rem] leading-snug text-white">{area.title}</p>
                      <p className="mt-2 text-[15px] font-medium text-[#8bbfe8]">{area.supportingLine}</p>
                    </div>
                    <ChevronDown
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 text-white/60 transition-transform duration-400"
                      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
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

        <div data-testid="text-expertise-closing" className="dclExpertise__closing mt-20 border-t border-white/12 pt-14 lg:mt-24">
          <p className="dclHome__display max-w-[820px] text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.18] tracking-[-.025em] text-white">
            {coreExpertise.closingLines[0]}
            <br />
            {coreExpertise.closingLines[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
