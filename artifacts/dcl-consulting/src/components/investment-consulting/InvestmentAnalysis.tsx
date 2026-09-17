import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { investmentAnalysis } from '@/data/investment-consulting-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/investment-consulting-secondary.webp';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

export function InvestmentAnalysis() {
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
          const next = getActiveIndex(self.progress, investmentAnalysis.rows.length);
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
        gsap.set(['.dclIaAnalysis__revealLine', '.dclIaAnalysis__fadeUp', '.dclIaAnalysis__imageWrap', '.dclIaAnalysis__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclIaAnalysis__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclIaAnalysis__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclIaAnalysis__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclIaAnalysis__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclIaAnalysis__row',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="investment-analysis" ref={rootRef} aria-labelledby="analysis-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclIaAnalysis__fadeUp text-[#9ca3aa]">{investmentAnalysis.label}</p>
            <h2 id="analysis-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.08] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclIaAnalysis__revealLine block">{investmentAnalysis.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIaAnalysis__revealLine block">{investmentAnalysis.headlineLines[1]}</span></span>
            </h2>
            <p className="dclIaAnalysis__fadeUp mt-5 max-w-[380px] text-[16px] leading-7 text-white/60">{investmentAnalysis.intro}</p>
            <Link
              href={investmentAnalysis.cta.href}
              data-testid="link-investment-analysis-cta"
              className="dclIaAnalysis__fadeUp group mt-7 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[13px] font-semibold uppercase tracking-[.1em] text-white outline-none transition-colors duration-300 hover:border-[#8bbfe8] hover:text-[#8bbfe8] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              {investmentAnalysis.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div ref={rowsRef} className="lg:col-span-5">
            <div className="border-t border-white/14">
              {investmentAnalysis.rows.map((row, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={row.name}
                    data-testid={`analysis-row-${slug(row.name)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclIaAnalysis__row cursor-pointer border-b border-white/14 py-6 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[15px] font-semibold uppercase tracking-[.1em] transition-colors duration-400" style={{ color: active ? '#8bbfe8' : 'rgba(255,255,255,.4)' }}>
                        {row.name}
                      </p>
                      <span aria-hidden="true" className="text-[13px] transition-transform duration-400" style={{ color: active ? '#8bbfe8' : 'rgba(255,255,255,.3)', transform: active ? 'translateX(2px)' : 'none' }}>
                        &#8594;
                      </span>
                    </div>
                    <div
                      className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
                      style={{ maxHeight: active || !isDesktop ? '80px' : '0px', opacity: active || !isDesktop ? 1 : 0 }}
                    >
                      <p className="mt-3 max-w-[42ch] text-[16px] leading-6 text-white/70">{row.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="dclIaAnalysis__imageWrap relative aspect-[3/5] w-full overflow-hidden lg:sticky lg:top-28">
              <img loading="lazy" decoding="async"
                data-testid="img-investment-analysis"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Minimalist curved glass office tower corner against a clear blue sky"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#080a0d]/25" />
              <p
                className="pointer-events-none absolute bottom-6 left-6 text-[11px] font-semibold uppercase tracking-[.15em] text-white"
                style={{ writingMode: 'vertical-rl', textShadow: '0 1px 8px rgba(0,0,0,.5)' }}
              >
                {investmentAnalysis.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
