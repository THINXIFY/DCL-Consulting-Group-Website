import { useEffect, useRef, useState } from 'react';
import { sectorAgnostic } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

// Alternating inset per row - full width, indented, full width again -
// so the three principles read as art-directed rather than a repeated
// list. No frames, no diagrams: typography, rule, and tonal wash only.
const ROW_INSET = ['lg:pl-0', 'lg:pl-16', 'lg:pl-0'];

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function SectorAgnostic() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useEffect(() => {
    if (!rowsRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: rowsRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, sectorAgnostic.principles.length);
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
        gsap.set(['.dclSectorAgnostic__revealLine', '.dclSectorAgnostic__fadeUp', '.dclSectorAgnostic__row', '.dclSectorAgnostic__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclSectorAgnostic__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclSectorAgnostic__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclSectorAgnostic__row',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: rowsRef.current, start: 'top 80%' } },
      );
      gsap.fromTo(
        '.dclSectorAgnostic__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclSectorAgnostic__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="sector-agnostic-perspective" ref={rootRef} aria-labelledby="sector-agnostic-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <h2 id="sector-agnostic-title" className="dclHome__display lg:col-span-6 text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] tracking-[-.035em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclSectorAgnostic__revealLine block">{sectorAgnostic.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclSectorAgnostic__revealLine block">{sectorAgnostic.headlineLines[1]}</span></span>
          </h2>
          <p className="dclSectorAgnostic__fadeUp lg:col-span-5 lg:col-start-8 mt-1 text-[19px] leading-[1.6] text-[#35404a] lg:mt-3">{sectorAgnostic.lead}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <p className="dclSectorAgnostic__fadeUp max-w-[58ch] text-[17px] leading-[1.8] text-[#35404a]">{sectorAgnostic.body[0]}</p>
            <p className="dclSectorAgnostic__fadeUp mt-6 max-w-[58ch] text-[17px] leading-[1.8] text-[#35404a]">{sectorAgnostic.body[1]}</p>
          </div>

          <div ref={rowsRef} className="flex flex-col lg:col-span-7 lg:col-start-6">
            {sectorAgnostic.principles.map((principle, index) => {
              const active = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={principle.title}
                  data-testid={`sector-agnostic-principle-${slug(principle.title)}`}
                  data-active={active}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => isDesktop && setHoverIndex(index)}
                  onMouseLeave={() => isDesktop && setHoverIndex(null)}
                  onFocus={() => isDesktop && setHoverIndex(index)}
                  onBlur={() => isDesktop && setHoverIndex(null)}
                  className={`dclSectorAgnostic__row cursor-pointer border-t border-[#080a0d]/14 px-0 py-8 outline-none transition-colors duration-500 first:border-t-0 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-9 ${ROW_INSET[index] ?? ''}`}
                  style={{ backgroundColor: active && isDesktop ? '#f7f8f9' : 'transparent' }}
                >
                  <div className="h-px transition-all duration-500" style={{ width: active ? '48px' : '20px', backgroundColor: active ? '#8bbfe8' : 'rgba(8,10,13,.18)' }} />
                  <p className="dclHome__eyebrow mt-5 transition-colors duration-400" style={{ color: active ? '#4a8fc2' : '#8a939b' }}>
                    {principle.title}
                  </p>
                  <p
                    className="dclHome__body mt-4 max-w-[54ch] font-medium leading-[1.6] transition-colors duration-400"
                    style={{ fontSize: 'clamp(1.15rem,1.7vw,1.4rem)', color: active ? '#080a0d' : '#9aa3ab' }}
                  >
                    {principle.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div data-testid="text-sector-agnostic-closing" className="dclSectorAgnostic__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {sectorAgnostic.closingLines.map((line) => (
            <p key={line} className="dclSectorAgnostic__closingLine dclHome__display max-w-[1100px] text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.16] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
