import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { assetFinalCta } from '@/data/asset-portfolio-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function AssetFinalCtaSection() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApFinal__smallLine', '.dclApFinal__revealLine', '.dclApFinal__fadeUp', '.dclApFinal__cta'], { clearProps: 'all' });
        gsap.set('.dclApFinal__verticalRule', { xPercent: -50, scaleY: 1 });
        return;
      }
      // 'top bottom' rather than a fixed percentage threshold - this is
      // the last section before the footer, and a percentage start like
      // 'top 74%' can be mathematically unreachable that near the
      // bottom of a long page.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclApFinal__smallLine', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclApFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, '-=0.2')
        .fromTo(
          '.dclApFinal__verticalRule',
          { xPercent: -50, scaleY: 0 },
          { xPercent: -50, scaleY: 1, transformOrigin: 'top center', duration: 1, ease: 'power2.out' },
          '-=0.4',
        )
        .fromTo('.dclApFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.7')
        .fromTo('.dclApFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="asset-final-cta" ref={rootRef} aria-labelledby="ap-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="relative mx-auto max-w-[1440px]">
        <div aria-hidden="true" className="dclApFinal__verticalRule absolute left-1/2 top-0 hidden h-full w-px bg-[#8bbfe8]/40 lg:block" />
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          <div className="lg:col-span-6">
            <p data-testid="text-ap-final-small" className="dclApFinal__smallLine text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
              {assetFinalCta.smallLine}
            </p>
            <h2 id="ap-final-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.03] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclApFinal__revealLine block">{assetFinalCta.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclApFinal__revealLine block">{assetFinalCta.headlineLines[1]}</span></span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-8 lg:col-span-6 lg:col-start-7">
            <p data-testid="text-ap-final-supporting" className="dclApFinal__fadeUp max-w-[440px] text-[16px] leading-7 text-white/65">
              {assetFinalCta.supporting}
            </p>

            <div className="flex flex-col items-start gap-6">
              <a
                ref={ctaRef}
                href={assetFinalCta.primaryCta.href}
                data-testid="link-ap-final-primary"
                className="dclApFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
              >
                {assetFinalCta.primaryCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
              </a>
              <Link
                href={assetFinalCta.secondaryCta.href}
                data-testid="link-ap-final-secondary"
                className="dclApFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {assetFinalCta.secondaryCta.label}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                  &#8594;
                </span>
              </Link>
              <p data-testid="text-ap-final-closing" className="dclApFinal__cta mt-2 text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
                {assetFinalCta.closing}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
