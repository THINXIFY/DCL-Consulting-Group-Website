import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { transactionApproach } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function TransactionApproachSection() {
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
          const next = getActiveIndex(self.progress, transactionApproach.rows.length);
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
        gsap.set(['.dclMaApproach__revealLine', '.dclMaApproach__fadeUp', '.dclMaApproach__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMaApproach__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclMaApproach__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclMaApproach__row',
        { autoAlpha: 0, x: -18 },
        { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="transaction-approach" ref={rootRef} aria-labelledby="ma-approach-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclMaApproach__fadeUp text-[#6b737a]">{transactionApproach.label}</p>
            <h2 id="ma-approach-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclMaApproach__revealLine block">{transactionApproach.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclMaApproach__revealLine block">{transactionApproach.headlineLines[1]}</span></span>
            </h2>
            <p className="dclMaApproach__fadeUp mt-4 max-w-[400px] text-[16px] leading-7 text-[#35404a]">{transactionApproach.body}</p>
            <Link
              href={transactionApproach.cta.href}
              data-testid="link-transaction-approach-cta"
              className="dclMaApproach__fadeUp group mt-6 inline-flex items-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {transactionApproach.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div ref={rowsRef} className="lg:col-span-7">
            <div className="border-t border-[#080a0d]/14">
              {transactionApproach.rows.map((row, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={row.name}
                    data-testid={`transaction-approach-row-${slug(row.name)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclMaApproach__row cursor-pointer border-b border-[#080a0d]/14 py-6 outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ transform: active ? 'translateX(8px)' : 'none' }}
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <p className="text-[15px] font-semibold uppercase tracking-[.08em] transition-colors duration-300" style={{ color: active ? '#080a0d' : '#9ca3aa' }}>
                        {row.name}
                      </p>
                      <div className="h-px bg-[#8bbfe8] transition-all duration-300" style={{ width: active ? '44px' : '14px' }} />
                    </div>
                    <p className="mt-2 max-w-[52ch] text-[16px] leading-6 transition-colors duration-300" style={{ color: active ? '#35404a' : '#9ca3aa' }}>
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
