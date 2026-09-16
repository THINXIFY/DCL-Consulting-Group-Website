import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { marketFinalCta } from '@/data/market-entry-expansion-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

// Full-width stacked headline (no two-column split) with the CTA row
// placed directly beneath it - a more direct, forward-moving
// composition than the Risk page's split headline/supporting layout.
export function MarketFinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMeFinal__smallLine', '.dclMeFinal__rule', '.dclMeFinal__revealLine', '.dclMeFinal__fadeUp', '.dclMeFinal__cta', '.dclMeFinal__keyword'], { clearProps: 'all' });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclMeFinal__smallLine', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclMeFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.75 }, '-=0.2')
        .fromTo('.dclMeFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.85, stagger: 0.08 }, '-=0.35')
        .fromTo('.dclMeFinal__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, '-=0.3')
        .fromTo('.dclMeFinal__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, '-=0.25')
        .fromTo('.dclMeFinal__keyword', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, '-=0.15');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="market-final-cta" ref={rootRef} aria-labelledby="market-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-market-final-small" className="dclMeFinal__smallLine text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
          {marketFinalCta.smallLine}
        </p>
        <div className="dclMeFinal__rule mt-6 h-px w-16 origin-left bg-[#8bbfe8]" />

        <h2 id="market-final-title" className="dclHome__display mt-8 max-w-[820px] text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.03] tracking-[-.025em]">
          <span className="block overflow-hidden"><span className="dclMeFinal__revealLine block">{marketFinalCta.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclMeFinal__revealLine block">{marketFinalCta.headlineLines[1]}</span></span>
        </h2>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <a
            ref={ctaRef}
            href={marketFinalCta.primaryCta.href}
            data-testid="link-market-final-primary"
            className="dclMeFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {marketFinalCta.primaryCta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </a>
          <Link
            href={marketFinalCta.secondaryCta.href}
            data-testid="link-market-final-secondary"
            className="dclMeFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
          >
            {marketFinalCta.secondaryCta.label}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
              &#8594;
            </span>
          </Link>
        </div>

        <p data-testid="text-market-final-supporting" className="dclMeFinal__fadeUp mt-8 max-w-[480px] border-t border-white/14 pt-8 text-[16px] leading-7 text-white/65">
          {marketFinalCta.supporting}
        </p>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p data-testid="text-market-final-closing" className="dclMeFinal__cta text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
            {marketFinalCta.closing}
          </p>
          <div data-testid="text-market-final-keywords" className="flex flex-wrap gap-x-6 gap-y-2">
            {marketFinalCta.closingKeywords.map((keyword) => (
              <span key={keyword} className="dclMeFinal__keyword text-[11px] font-semibold uppercase tracking-[.15em] text-white/30">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
