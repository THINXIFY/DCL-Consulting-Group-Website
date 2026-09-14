import { useEffect, useRef, useState } from 'react';
import { sectorPerspectiveMatters } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ContextPlacement {
  span: string;
  size: string;
}

// Six large typographic objects placed as alternating left / centre /
// right zones rather than a list or a grid - varying spans and type
// scale so each reads as a distinct editorial weight, not a repeated
// row. Spans are kept no narrower than 5 columns so descriptions stay
// comfortable at 1024-1366 laptop widths, not just on large desktop.
const PLACEMENTS: ContextPlacement[] = [
  { span: 'lg:col-span-7 lg:col-start-1', size: 'clamp(1.9rem,3.4vw,2.9rem)' },
  { span: 'lg:col-span-5 lg:col-start-8 lg:mt-16', size: 'clamp(1.5rem,2.4vw,2.1rem)' },
  { span: 'lg:col-span-6 lg:col-start-4 lg:mt-10', size: 'clamp(1.7rem,2.8vw,2.4rem)' },
  { span: 'lg:col-span-8 lg:col-start-5 lg:mt-16', size: 'clamp(1.8rem,3vw,2.6rem)' },
  { span: 'lg:col-span-5 lg:col-start-1 lg:mt-10', size: 'clamp(1.6rem,2.6vw,2.2rem)' },
  { span: 'lg:col-span-9 lg:col-start-3 lg:mt-16', size: 'clamp(2.1rem,3.8vw,3.2rem)' },
];

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function SectorPerspectiveMatters() {
  const rootRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useEffect(() => {
    if (!fieldRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: fieldRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, sectorPerspectiveMatters.contexts.length);
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
    // Plain gsap.to() + killTweensOf on cleanup, not gsap.context().revert()
    // - this effect re-runs on every scroll-driven activeIndex change, and
    // context.revert() resets the animated property back to its
    // pre-effect value each time, which would flash the depth back to
    // flat before every re-tween. killTweensOf only stops further
    // progress, leaving the element at its current value.
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { z: i === activeIndex ? 12 : -8, duration: 0.7, ease: 'power3.out' });
    });
    return () => {
      itemRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  // Cursor-tracked glow on the active item - fine pointers only, skipped
  // under reduced motion. Reuses the same pattern already proven on the
  // Industries We Assess cards elsewhere on this page, for a consistent
  // "premium interactive" feel rather than a one-off effect.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (prefersReducedMotion) return;

    const cleanups: Array<() => void> = [];
    itemRefs.current.forEach((item) => {
      if (!item) return;
      function handleMove(event: MouseEvent) {
        const rect = item!.getBoundingClientRect();
        item!.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        item!.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      }
      item.addEventListener('pointermove', handleMove);
      cleanups.push(() => item.removeEventListener('pointermove', handleMove));
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDecision__revealLine', '.dclDecision__fadeUp', '.dclDecision__item', '.dclDecision__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclDecision__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclDecision__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclDecision__item',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: fieldRef.current, start: 'top bottom' } },
      );
      gsap.fromTo(
        '.dclDecision__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclDecision__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="sector-perspective-matters" ref={rootRef} aria-labelledby="decision-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[680px]">
          <h2 id="decision-title" className="dclHome__display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] tracking-[-.035em]">
            <span className="block overflow-hidden"><span className="dclDecision__revealLine block">{sectorPerspectiveMatters.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclDecision__revealLine block">{sectorPerspectiveMatters.headlineLines[1]}</span></span>
          </h2>
          <p className="dclDecision__fadeUp mt-6 text-[19px] leading-[1.6] text-white/65">{sectorPerspectiveMatters.intro}</p>
        </div>

        <div ref={fieldRef} className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:[perspective:1400px]">
          {sectorPerspectiveMatters.contexts.map((context, index) => {
            const active = isDesktop ? activeIndex === index : true;
            const placement = PLACEMENTS[index] ?? PLACEMENTS[0]!;
            return (
              <div
                key={context.name}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                data-testid={`decision-context-${slug(context.name)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setHoverIndex(index)}
                onMouseLeave={() => isDesktop && setHoverIndex(null)}
                onFocus={() => isDesktop && setHoverIndex(index)}
                onBlur={() => isDesktop && setHoverIndex(null)}
                className={`dclDecision__item group relative cursor-pointer overflow-hidden border-t border-white/14 pt-6 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] ${placement.span}`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(139,191,232,.14), transparent 60%)' }}
                />
                <div className="relative h-px w-6 bg-white/25 transition-colors duration-400 group-hover:bg-[#8bbfe8]" />
                <p
                  className="dclHome__display relative mt-4 leading-[1.12] tracking-[-.02em] transition-colors duration-400"
                  style={{ fontSize: placement.size, color: active ? '#ffffff' : 'rgba(255,255,255,.4)' }}
                >
                  {context.name}
                </p>
                <div className="relative mt-4 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '48px' : '18px' }} />
                <p
                  className="relative mt-4 max-w-[46ch] text-[16px] leading-7 transition-colors duration-400 sm:text-[17px]"
                  style={{ color: active ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.32)' }}
                >
                  {context.description}
                </p>
              </div>
            );
          })}
        </div>

        <div data-testid="text-decision-closing" className="dclDecision__closing mt-20 border-t border-white/12 pt-14 lg:mt-24">
          {sectorPerspectiveMatters.closingLines.map((line) => (
            <p key={line} className="dclDecision__closingLine dclHome__display max-w-[820px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] tracking-[-.025em] text-white">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
