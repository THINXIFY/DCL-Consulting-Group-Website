import { useEffect, useRef, useState } from 'react';
import { sectorAgnostic } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface FrameState {
  rotateY: number;
  x: number;
  scaleX: number;
}

// Three thin frames start open and differently oriented, then converge
// onto a shared axis as the visitor moves through the three principles -
// a quiet visual echo of "different contexts, disciplined perspective".
const FRAME_STATES: FrameState[] = [
  { rotateY: -18, x: -34, scaleX: 1.12 },
  { rotateY: 10, x: 14, scaleX: 0.94 },
  { rotateY: 0, x: 0, scaleX: 1 },
];

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function SectorAgnostic() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
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
    if (!isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const target = FRAME_STATES[activeIndex] ?? FRAME_STATES[0]!;
    frameRefs.current.forEach((el, i) => {
      if (!el) return;
      const depth = i * 8;
      gsap.to(el, { xPercent: -50, yPercent: -50, rotateY: target.rotateY, x: target.x + depth, scaleX: target.scaleX, duration: 0.8, ease: 'power3.out' });
    });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSectorAgnostic__revealLine', '.dclSectorAgnostic__fadeUp', '.dclSectorAgnostic__row', '.dclSectorAgnostic__frame', '.dclSectorAgnostic__closingLine'], {
          clearProps: 'all',
        });
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
      if (isDesktop) {
        gsap.set('.dclSectorAgnostic__frame', {
          xPercent: -50,
          yPercent: -50,
          rotateY: (i: number) => FRAME_STATES[0]!.rotateY - i * 4,
          x: (i: number) => FRAME_STATES[0]!.x - i * 12,
          scaleX: FRAME_STATES[0]!.scaleX,
          autoAlpha: 0,
        });
        gsap.to('.dclSectorAgnostic__frame', {
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclSectorAgnostic__frameStage', start: 'top 75%' },
        });
      }
      gsap.fromTo(
        '.dclSectorAgnostic__row',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );
      gsap.fromTo(
        '.dclSectorAgnostic__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclSectorAgnostic__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="sector-agnostic-perspective" ref={rootRef} aria-labelledby="sector-agnostic-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <h2 id="sector-agnostic-title" className="dclHome__display lg:col-span-7 text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] tracking-[-.035em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclSectorAgnostic__revealLine block">{sectorAgnostic.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclSectorAgnostic__revealLine block">{sectorAgnostic.headlineLines[1]}</span></span>
          </h2>
          <p className="dclSectorAgnostic__fadeUp lg:col-span-4 lg:col-start-9 mt-2 text-[19px] leading-[1.6] text-[#35404a] lg:mt-1">{sectorAgnostic.lead}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <p className="dclSectorAgnostic__fadeUp max-w-[62ch] text-[17px] leading-[1.8] text-[#35404a]">{sectorAgnostic.body[0]}</p>
            <p className="dclSectorAgnostic__fadeUp mt-6 max-w-[62ch] text-[17px] leading-[1.8] text-[#35404a]">{sectorAgnostic.body[1]}</p>
          </div>

          {isDesktop && (
            <div className="dclSectorAgnostic__frameStage relative col-span-4 col-start-9 hidden h-[320px] lg:block lg:[perspective:1600px]">
              <div className="relative h-full w-full [transform-style:preserve-3d]">
                {FRAME_STATES.map((_, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      frameRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="dclSectorAgnostic__frame absolute left-1/2 top-1/2 h-[220px] w-[170px] border border-[#080a0d]/15"
                    style={{ transform: 'translate(-50%,-50%)', zIndex: FRAME_STATES.length - i }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={rowsRef} className="mt-20 grid grid-cols-1 gap-y-12 border-t border-[#080a0d]/14 pt-12 lg:mt-28 lg:grid-cols-12 lg:gap-x-8">
          {sectorAgnostic.principles.map((principle, index) => {
            const active = isDesktop ? activeIndex === index : true;
            const spanClass = index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-6 lg:col-start-5' : 'lg:col-span-7 lg:col-start-6';
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
                className={`dclSectorAgnostic__row cursor-pointer border-t border-[#080a0d]/14 pt-6 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] ${spanClass}`}
              >
                <div className="h-px transition-all duration-500" style={{ width: active ? '48px' : '20px', backgroundColor: active ? '#8bbfe8' : 'rgba(8,10,13,.18)' }} />
                <p
                  className="dclHome__eyebrow mt-4 transition-colors duration-400"
                  style={{ color: active ? '#080a0d' : '#8a939b' }}
                >
                  {principle.title}
                </p>
                <p className="mt-3 max-w-[52ch] text-[16px] leading-7 transition-colors duration-400 sm:text-[17px]" style={{ color: active ? '#35404a' : '#9aa3ab' }}>
                  {principle.copy}
                </p>
              </div>
            );
          })}
        </div>

        <div data-testid="text-sector-agnostic-closing" className="dclSectorAgnostic__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {sectorAgnostic.closingLines.map((line) => (
            <p key={line} className="dclSectorAgnostic__closingLine dclHome__display max-w-[820px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
