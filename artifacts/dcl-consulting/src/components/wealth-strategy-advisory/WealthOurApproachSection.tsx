import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { wealthOurApproach } from '@/data/wealth-strategy-advisory-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

export function WealthOurApproachSection() {
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
          const next = getActiveIndex(self.progress, wealthOurApproach.rows.length);
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
        gsap.set(['.dclWealthApproach__revealLine', '.dclWealthApproach__fadeUp', '.dclWealthApproach__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWealthApproach__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWealthApproach__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclWealthApproach__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="wealth-our-approach" ref={rootRef} aria-labelledby="wealth-approach-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclWealthApproach__fadeUp text-[#6b737a]">{wealthOurApproach.label}</p>
            <h2 id="wealth-approach-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWealthApproach__revealLine block">{wealthOurApproach.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWealthApproach__revealLine block">{wealthOurApproach.headlineLines[1]}</span></span>
            </h2>
            <p className="dclWealthApproach__fadeUp mt-5 max-w-[420px] text-[16px] leading-7 text-[#35404a]">{wealthOurApproach.body}</p>
            <Link
              href={wealthOurApproach.cta.href}
              data-testid="link-wealth-approach-cta"
              className="dclWealthApproach__fadeUp group mt-7 inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {wealthOurApproach.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div ref={rowsRef} className="lg:col-span-7">
            <div className="border-t border-[#080a0d]/14">
              {wealthOurApproach.rows.map((row, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={row.name}
                    data-testid={`wealth-approach-row-${slug(row.name)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclWealthApproach__row cursor-pointer border-b border-[#080a0d]/14 py-6 outline-none transition-[transform,color] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ transform: active ? 'translateX(4px)' : 'none' }}
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <p className="text-[15px] font-semibold uppercase tracking-[.08em] transition-colors duration-400" style={{ color: active ? '#080a0d' : '#9ca3aa' }}>
                        {row.name}
                      </p>
                      <span aria-hidden="true" className="shrink-0 text-[15px] transition-[color,transform] duration-400" style={{ color: active ? '#8bbfe8' : '#c3c9ce', transform: active ? 'translateX(2px)' : 'none' }}>
                        &#8594;
                      </span>
                    </div>
                    <p className="mt-2 max-w-[52ch] text-[16px] leading-6 transition-colors duration-400" style={{ color: active ? '#35404a' : '#9ca3aa' }}>
                      {row.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
