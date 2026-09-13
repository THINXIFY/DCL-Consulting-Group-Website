import { useEffect, useRef, useState } from 'react';
import { understandingDecision } from '@/data/approach-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface FrameState {
  rotateY: number;
  scaleX: number;
  z: number;
}

// Objective: open and wide. Context: narrows. Information: shifts depth.
// Priorities: aligns precisely. A single restrained frame, not a diagram.
const FRAME_STATES: FrameState[] = [
  { rotateY: -6, scaleX: 1.06, z: 0 },
  { rotateY: -2, scaleX: 0.9, z: 10 },
  { rotateY: 8, scaleX: 1, z: -20 },
  { rotateY: 0, scaleX: 1, z: 0 },
];

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function UnderstandingDecision() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
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
          const next = getActiveIndex(self.progress, understandingDecision.areas.length);
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
    if (!isDesktop || prefersReducedMotion || !frameRef.current) return;
    ensureGsapRegistered();
    const target = FRAME_STATES[activeIndex] ?? FRAME_STATES[0]!;
    gsap.to(frameRef.current, { ...target, duration: 0.75, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclUnderstand__revealLine', '.dclUnderstand__fadeUp', '.dclUnderstand__row', '.dclUnderstand__datum', '.dclUnderstand__closingLine'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclUnderstand__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclUnderstand__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclUnderstand__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
      if (isDesktop) {
        gsap.fromTo(
          '.dclUnderstand__datum',
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: rowsRef.current, start: 'top 65%', end: 'bottom 60%', scrub: true } },
        );
      }
      gsap.fromTo(
        '.dclUnderstand__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclUnderstand__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="understanding-decision" ref={rootRef} aria-labelledby="understand-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 border-b border-[#080a0d]/14 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="understand-title" className="dclHome__display max-w-[520px] text-[clamp(2.2rem,3.8vw,3.3rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclUnderstand__revealLine block">{understandingDecision.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclUnderstand__revealLine block">{understandingDecision.headlineLines[1]}</span></span>
          </h2>
          <p className="dclUnderstand__fadeUp max-w-[420px] text-[17px] leading-7 text-[#35404a] lg:text-right">{understandingDecision.intro}</p>
        </div>

        <div className="relative mt-4 lg:[perspective:1400px]">
          <div ref={frameRef} aria-hidden="true" className="pointer-events-none absolute inset-y-6 right-0 hidden w-[46%] border border-[#080a0d]/10 bg-[#f7f9fa] lg:block" />

          <div ref={rowsRef} className="relative border-t border-[#080a0d]/14">
            <div className="dclUnderstand__datum absolute -left-6 top-0 hidden h-full w-px bg-[#8bbfe8] lg:block" aria-hidden="true" />
            {understandingDecision.areas.map((area, index) => {
              const active = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={area.label}
                  data-testid={`understand-row-${slug(area.label)}`}
                  data-active={active}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => isDesktop && setHoverIndex(index)}
                  onMouseLeave={() => isDesktop && setHoverIndex(null)}
                  onFocus={() => isDesktop && setHoverIndex(index)}
                  onBlur={() => isDesktop && setHoverIndex(null)}
                  className="dclUnderstand__row relative cursor-pointer border-b border-[#080a0d]/14 py-9 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-11"
                >
                  <p className="dclHome__eyebrow transition-colors duration-400" style={{ color: active ? '#4a8fc2' : '#8a939b' }}>
                    {area.label}
                  </p>
                  <p
                    className="dclHome__display mt-3 max-w-[760px] leading-[1.08] tracking-[-.02em] transition-colors duration-400"
                    style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', color: active ? '#080a0d' : '#8a939b' }}
                  >
                    {area.question}
                  </p>
                  <div className="mt-4 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '56px' : '0px' }} />
                  <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out" style={{ maxHeight: active || !isDesktop ? '160px' : '0px', opacity: active || !isDesktop ? 1 : 0 }}>
                    <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{area.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div data-testid="text-understand-closing" className="dclUnderstand__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {understandingDecision.closingLines.map((line) => (
            <p key={line} className="dclUnderstand__closingLine dclHome__display max-w-[820px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
