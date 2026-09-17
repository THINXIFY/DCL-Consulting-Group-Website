import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
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
        gsap.set(['.dclIndustriesFinal__revealLine', '.dclIndustriesFinal__fadeUp', '.dclIndustriesFinal__rule', '.dclIndustriesFinal__cta'], { clearProps: 'all' });
        return;
      }
      // 'top bottom' rather than a fixed percentage - this is the last
      // section before the footer, and a percentage threshold like
      // 'top 74%' can be mathematically unreachable near the bottom of a
      // tall page.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclIndustriesFinal__fadeUp', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclIndustriesFinal__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, '-=0.15')
        .fromTo('.dclIndustriesFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'center', duration: 0.7 }, '-=0.3')
        .fromTo('.dclIndustriesFinal__cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="industries-final-cta" ref={rootRef} aria-labelledby="industries-final-title" className="bg-[#080a0d] px-6 py-24 text-center text-white sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[760px]">
        <p data-testid="text-industries-final-eyebrow" className="dclHome__eyebrow dclIndustriesFinal__fadeUp text-[#8bbfe8]">
          {industriesFinalCta.eyebrow}
        </p>
        <h2 id="industries-final-title" data-testid="text-industries-final-title" className="dclHome__display mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1] tracking-[-.03em]">
          {industriesFinalCta.headlineLines.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span className="dclIndustriesFinal__revealLine block">{line}</span>
            </span>
          ))}
        </h2>
        <p className="dclIndustriesFinal__fadeUp mx-auto mt-7 max-w-[480px] text-[16px] leading-7 text-white/65 sm:text-[18px]">{industriesFinalCta.copy}</p>

        <div className="dclIndustriesFinal__rule mx-auto mt-12 h-px w-full max-w-[360px] bg-white/25" />

        <Link
          ref={ctaRef}
          href={industriesFinalCta.cta.href}
          data-testid="link-industries-final-cta"
          className="dclIndustriesFinal__cta group mt-11 inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:shadow-[0_8px_28px_rgba(139,191,232,.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
        >
          {industriesFinalCta.cta.label}
          <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
        </Link>
      </div>
    </section>
  );
}
