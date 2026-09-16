import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { maFinalCta } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function MaFinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclMaFinal__smallLine', '.dclMaFinal__revealLine', '.dclMaFinal__rule', '.dclMaFinal__fadeUp', '.dclMaFinal__cta', '.dclMaFinal__keyword'], { clearProps: 'all' });
        return;
      }
      // 'top bottom' rather than a fixed percentage threshold - this is
      // the last section before the footer, and a percentage start like
      // 'top 74%' can be mathematically unreachable that near the
      // bottom of a long page.
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclMaFinal__smallLine', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45 })
        .fromTo('.dclMaFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.8, stagger: 0.07 }, '-=0.15')
        .fromTo('.dclMaFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.65, ease: 'power3.out' }, '-=0.3')
        .fromTo('.dclMaFinal__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, '-=0.25')
        .fromTo('.dclMaFinal__fadeUp', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, '-=0.3')
        .fromTo('.dclMaFinal__keyword', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, stagger: 0.04 }, '-=0.15');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="ma-final-cta" ref={rootRef} aria-labelledby="ma-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-ma-final-small" className="dclMaFinal__smallLine text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
          {maFinalCta.smallLine}
        </p>
        <h2 id="ma-final-title" className="dclHome__display mt-4 max-w-[720px] text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-.02em]">
          <span className="block overflow-hidden"><span className="dclMaFinal__revealLine block">{maFinalCta.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclMaFinal__revealLine block">{maFinalCta.headlineLines[1]}</span></span>
        </h2>
        <div className="dclMaFinal__rule mt-7 h-px w-20 origin-left bg-[#8bbfe8]" />

        <div className="mt-9 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <a
              ref={ctaRef}
              href={maFinalCta.primaryCta.href}
              data-testid="link-ma-final-primary"
              className="dclMaFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {maFinalCta.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
            <Link
              href={maFinalCta.secondaryCta.href}
              data-testid="link-ma-final-secondary"
              className="dclMaFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {maFinalCta.secondaryCta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <p data-testid="text-ma-final-supporting" className="dclMaFinal__fadeUp max-w-[360px] text-[16px] leading-7 text-white/60">
            {maFinalCta.supporting}
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/14 pt-5">
          <p data-testid="text-ma-final-closing" className="dclMaFinal__cta text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
            {maFinalCta.closing}
          </p>
          <div data-testid="text-ma-final-keywords" className="flex flex-wrap gap-x-5 gap-y-2">
            {maFinalCta.closingKeywords.map((keyword) => (
              <span key={keyword} className="dclMaFinal__keyword text-[11px] font-semibold uppercase tracking-[.15em] text-white/30">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
