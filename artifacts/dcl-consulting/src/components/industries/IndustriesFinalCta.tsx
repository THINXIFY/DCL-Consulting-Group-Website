import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { industriesFinalCta } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function IndustriesFinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclIndustriesFinal__revealLine', '.dclIndustriesFinal__fadeUp', '.dclIndustriesFinal__rule', '.dclIndustriesFinal__cta'],
          { clearProps: 'all' },
        );
        // The vertical divider centers itself via GSAP's xPercent rather
        // than a static CSS transform, so it needs an explicit reset
        // here instead of clearProps (there is nothing else to clear it
        // back to).
        gsap.set('.dclIndustriesFinal__verticalRule', { xPercent: -50, scaleY: 1 });
        return;
      }

      // 'top bottom' rather than a fixed percentage - this is the last
      // section before the footer, and a percentage threshold like
      // 'top 74%' can be mathematically unreachable near the bottom of
      // a tall page (there may not be enough remaining scroll distance
      // to push the trigger element that far up the viewport), which
      // silently leaves the entrance animation stuck at its initial
      // hidden state forever.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclIndustriesFinal__smallStatement', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06 })
        .fromTo('.dclIndustriesFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, '-=0.25')
        .fromTo(
          '.dclIndustriesFinal__verticalRule',
          { xPercent: -50, scaleY: 0 },
          { xPercent: -50, scaleY: 1, transformOrigin: 'top center', duration: 1, ease: 'power2.out' },
          '-=0.4',
        )
        .fromTo('.dclIndustriesFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out' }, '<')
        .fromTo('.dclIndustriesFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.6')
        .fromTo('.dclIndustriesFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="industries-final-cta" ref={rootRef} aria-labelledby="industries-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="relative mx-auto max-w-[1440px]">
        <div
          aria-hidden="true"
          className="dclIndustriesFinal__verticalRule absolute left-1/2 top-0 hidden h-full w-px bg-[#8bbfe8] lg:block"
        />
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          <div className="lg:col-span-5">
            <div data-testid="text-industries-final-statement" className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
              {industriesFinalCta.smallStatementLines.map((line) => (
                <p key={line} className="dclIndustriesFinal__smallStatement">
                  {line}
                </p>
              ))}
            </div>
            <h2 id="industries-final-title" data-testid="text-industries-final-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[.98] tracking-[-.035em]">
              <span className="block overflow-hidden"><span className="dclIndustriesFinal__revealLine block">{industriesFinalCta.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIndustriesFinal__revealLine block">{industriesFinalCta.headlineLines[1]}</span></span>
            </h2>
            <div className="dclIndustriesFinal__rule mt-10 h-px w-full bg-[#8bbfe8] lg:hidden" />
          </div>

          <div className="flex flex-col items-start gap-8 lg:col-span-6 lg:col-start-7">
            <p data-testid="text-industries-final-supporting" className="dclIndustriesFinal__fadeUp max-w-[520px] text-[17px] leading-7 text-white/65 sm:text-[18px]">
              {industriesFinalCta.supporting}
            </p>

            <div className="flex flex-col items-start gap-6">
              <a
                ref={ctaRef}
                href={industriesFinalCta.primaryCta.href}
                data-testid="link-industries-final-primary"
                className="dclIndustriesFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
              >
                {industriesFinalCta.primaryCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
              </a>
              <a
                href={industriesFinalCta.secondaryCta.href}
                data-testid="link-industries-final-secondary"
                className="dclIndustriesFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {industriesFinalCta.secondaryCta.label}
                <ArrowUpRight size={13} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
              <p data-testid="text-industries-final-closing" className="dclIndustriesFinal__cta mt-2 text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
                {industriesFinalCta.closing}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
