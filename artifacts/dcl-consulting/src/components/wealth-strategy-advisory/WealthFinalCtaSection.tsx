import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { wealthFinalCta } from '@/data/wealth-strategy-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function WealthFinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWealthFinal__smallLine', '.dclWealthFinal__rule', '.dclWealthFinal__revealLine', '.dclWealthFinal__fadeUp', '.dclWealthFinal__cta', '.dclWealthFinal__keyword'], {
          clearProps: 'all',
        });
        return;
      }
      // 'top bottom' rather than a fixed percentage threshold - this is
      // the last section before the footer, and a percentage start like
      // 'top 74%' can be mathematically unreachable that near the
      // bottom of a long page.
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclWealthFinal__smallLine', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclWealthFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.9 }, '-=0.25')
        .fromTo('.dclWealthFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.11 }, '-=0.4')
        .fromTo('.dclWealthFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 }, '-=0.55')
        .fromTo('.dclWealthFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.35')
        .fromTo('.dclWealthFinal__keyword', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.06 }, '-=0.2');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="wealth-final-cta" ref={rootRef} aria-labelledby="wealth-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-wealth-final-small" className="dclWealthFinal__smallLine text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
          {wealthFinalCta.smallLine}
        </p>
        <div className="dclWealthFinal__rule mt-6 h-px w-16 origin-left bg-[#8bbfe8]" />

        <div className="mt-8 grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <h2 id="wealth-final-title" className="dclHome__display text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.05] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclWealthFinal__revealLine block">{wealthFinalCta.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWealthFinal__revealLine block">{wealthFinalCta.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p data-testid="text-wealth-final-supporting" className="dclWealthFinal__fadeUp max-w-[420px] text-[16px] leading-7 text-white/65">
              {wealthFinalCta.supporting}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-6 border-t border-white/14 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <a
              ref={ctaRef}
              href={wealthFinalCta.primaryCta.href}
              data-testid="link-wealth-final-primary"
              className="dclWealthFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {wealthFinalCta.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
            <Link
              href={wealthFinalCta.secondaryCta.href}
              data-testid="link-wealth-final-secondary"
              className="dclWealthFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {wealthFinalCta.secondaryCta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>
          <p data-testid="text-wealth-final-closing" className="dclWealthFinal__cta text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
            {wealthFinalCta.closing}
          </p>
        </div>

        <div data-testid="text-wealth-final-keywords" className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {wealthFinalCta.closingKeywords.map((keyword) => (
            <span key={keyword} className="dclWealthFinal__keyword text-[11px] font-semibold uppercase tracking-[.15em] text-white/30">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
