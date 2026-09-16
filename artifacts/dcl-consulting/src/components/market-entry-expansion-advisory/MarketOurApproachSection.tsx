import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { marketOurApproach } from '@/data/market-entry-expansion-advisory-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/market-entry-secondary.webp';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

// Three-column composition (image / text+cta / rows) - distinct from
// the Risk page's two-column approach section, and gives Market Entry
// its own visual rhythm even though the underlying row-activation
// mechanics are shared.
export function MarketOurApproachSection() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
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
          const next = getActiveIndex(self.progress, marketOurApproach.rows.length);
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
        gsap.set(['.dclMeApproach__revealLine', '.dclMeApproach__fadeUp', '.dclMeApproach__row', '.dclMeApproach__imageWrap'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclMeApproach__imageWrap',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclMeApproach__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclMeApproach__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclMeApproach__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclMeApproach__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="market-our-approach" ref={rootRef} aria-labelledby="market-approach-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-3">
            <div className="dclMeApproach__imageWrap relative aspect-[3/4] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-market-our-approach"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Symmetrical low-angle view of several glass skyscrapers converging toward a bright sky"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclMeApproach__fadeUp text-[#6b737a]">{marketOurApproach.label}</p>
            <h2 id="market-approach-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.12] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclMeApproach__revealLine block">{marketOurApproach.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclMeApproach__revealLine block">{marketOurApproach.headlineLines[1]}</span></span>
            </h2>
            <p className="dclMeApproach__fadeUp mt-5 max-w-[360px] text-[16px] leading-7 text-[#35404a]">{marketOurApproach.body}</p>
            <Link
              href={marketOurApproach.cta.href}
              data-testid="link-market-approach-cta"
              className="dclMeApproach__fadeUp group mt-7 inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {marketOurApproach.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div ref={rowsRef} className="lg:col-span-5">
            <div className="border-t border-[#080a0d]/14">
              {marketOurApproach.rows.map((row, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={row.name}
                    data-testid={`market-approach-row-${slug(row.name)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclMeApproach__row cursor-pointer border-b border-[#080a0d]/14 py-6 outline-none transition-transform duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ transform: active ? 'translateX(5px)' : 'none' }}
                  >
                    <p className="text-[14px] font-semibold uppercase tracking-[.08em] transition-colors duration-400" style={{ color: active ? '#080a0d' : '#9ca3aa' }}>
                      {row.name}
                    </p>
                    <div className="mt-3 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '40px' : '14px' }} />
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-6 transition-colors duration-400" style={{ color: active ? '#35404a' : '#9ca3aa' }}>
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
