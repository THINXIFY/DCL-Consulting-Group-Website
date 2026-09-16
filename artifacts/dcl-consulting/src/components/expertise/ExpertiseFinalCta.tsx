import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { expertiseFinalCta } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function ExpertiseFinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclExpFinal__label', '.dclExpFinal__revealLine', '.dclExpFinal__rule', '.dclExpFinal__fadeUp', '.dclExpFinal__cta'], { clearProps: 'all' });
        return;
      }

      // 'top bottom' rather than a fixed percentage threshold - this is
      // the last section before the footer, and a percentage start like
      // 'top 74%' can be mathematically unreachable that near the
      // bottom of a long page.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclExpFinal__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclExpFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.3')
        .fromTo('.dclExpFinal__rule', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top center', duration: 0.8 }, '-=0.5')
        .fromTo('.dclExpFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
        .fromTo('.dclExpFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="expertise-final-cta" ref={rootRef} aria-labelledby="expertise-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-expertise-final-label" className="dclExpFinal__label text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
          {expertiseFinalCta.label}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-5">
            <h2 id="expertise-final-title" data-testid="text-expertise-final-title" className="dclHome__display text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclExpFinal__revealLine block">{expertiseFinalCta.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclExpFinal__revealLine block">{expertiseFinalCta.headlineLines[1]}</span></span>
            </h2>
          </div>

          <div className="flex gap-6 lg:col-span-3">
            <div className="dclExpFinal__rule w-px shrink-0 origin-top bg-[#8bbfe8]" />
            <p data-testid="text-expertise-final-supporting" className="dclExpFinal__fadeUp text-[15px] leading-7 text-white/60">
              {expertiseFinalCta.supporting}
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
            <a
              ref={ctaRef}
              href={expertiseFinalCta.primaryCta.href}
              data-testid="link-expertise-final-primary"
              className="dclExpFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {expertiseFinalCta.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
            <Link
              href={expertiseFinalCta.secondaryCta.href}
              data-testid="link-expertise-final-secondary"
              className="dclExpFinal__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {expertiseFinalCta.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div data-testid="text-expertise-final-closing" className="mt-14 flex flex-wrap gap-x-2 border-t border-white/12 pt-8">
          {expertiseFinalCta.closingLines.map((line) => (
            <span key={line} className="dclExpFinal__cta text-[11px] font-semibold uppercase tracking-[.15em] text-white/35">
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
