import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { dueDiligenceFinalCta } from '@/data/due-diligence-support-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function DueDiligenceFinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDdFinal__smallLine', '.dclDdFinal__rule', '.dclDdFinal__revealLine', '.dclDdFinal__fadeUp', '.dclDdFinal__cta', '.dclDdFinal__keyword'], { clearProps: 'all' });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclDdFinal__smallLine', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclDdFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.85 }, '-=0.25')
        .fromTo('.dclDdFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.08 }, '-=0.4')
        .fromTo('.dclDdFinal__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, '-=0.5')
        .fromTo('.dclDdFinal__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07 }, '-=0.3')
        .fromTo('.dclDdFinal__keyword', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.06 }, '-=0.2');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="dd-final-cta" ref={rootRef} aria-labelledby="dd-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-dd-final-small" className="dclDdFinal__smallLine text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
          {dueDiligenceFinalCta.smallLine}
        </p>
        <div className="dclDdFinal__rule mt-6 h-px w-16 origin-left bg-[#8bbfe8]" />

        <div className="mt-10 grid grid-cols-1 border-t border-white/14 lg:grid-cols-12">
          <div className="py-8 lg:col-span-6 lg:border-r lg:border-white/14 lg:py-10 lg:pr-10">
            <h2 id="dd-final-title" className="dclHome__display text-[clamp(2.2rem,4.2vw,3.4rem)] leading-[1.08] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclDdFinal__revealLine block">{dueDiligenceFinalCta.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclDdFinal__revealLine block">{dueDiligenceFinalCta.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="flex flex-col justify-center py-8 lg:col-span-6 lg:py-10 lg:pl-10">
            <p data-testid="text-dd-final-supporting" className="dclDdFinal__fadeUp max-w-[420px] text-[16px] leading-7 text-white/65">
              {dueDiligenceFinalCta.supporting}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-start gap-6 border-t border-white/14 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <a
              ref={ctaRef}
              href={dueDiligenceFinalCta.primaryCta.href}
              data-testid="link-dd-final-primary"
              className="dclDdFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {dueDiligenceFinalCta.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
            <Link
              href={dueDiligenceFinalCta.secondaryCta.href}
              data-testid="link-dd-final-secondary"
              className="dclDdFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {dueDiligenceFinalCta.secondaryCta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>
          <p data-testid="text-dd-final-closing" className="dclDdFinal__cta text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
            {dueDiligenceFinalCta.closing}
          </p>
        </div>

        <div data-testid="text-dd-final-keywords" className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {dueDiligenceFinalCta.closingKeywords.map((keyword) => (
            <span key={keyword} className="dclDdFinal__keyword text-[11px] font-semibold uppercase tracking-[.15em] text-white/30">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
