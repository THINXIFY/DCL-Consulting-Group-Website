import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesFinalCta } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function ServicesFinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclServicesFinal__label', '.dclServicesFinal__revealLine', '.dclServicesFinal__rule', '.dclServicesFinal__fadeUp', '.dclServicesFinal__cta'], { clearProps: 'all' });
        return;
      }
      // 'top bottom' rather than a fixed percentage threshold - this is
      // the last section before the footer, and a percentage start like
      // 'top 74%' can be mathematically unreachable that near the
      // bottom of a long page.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top bottom' } });
      tl.fromTo('.dclServicesFinal__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclServicesFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.9 }, '-=0.25')
        .fromTo('.dclServicesFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.4')
        .fromTo('.dclServicesFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5')
        .fromTo('.dclServicesFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.35');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="services-final-cta" ref={rootRef} aria-labelledby="services-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-services-final-label" className="dclServicesFinal__label text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
          {servicesFinalCta.label}
        </p>
        <h2 id="services-final-title" data-testid="text-services-final-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[1] tracking-[-.03em]">
          <span className="block overflow-hidden"><span className="dclServicesFinal__revealLine block">{servicesFinalCta.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclServicesFinal__revealLine block">{servicesFinalCta.headlineLines[1]}</span></span>
        </h2>

        <div className="dclServicesFinal__rule mt-10 h-px w-full origin-left bg-white/15 lg:mt-12" />

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between lg:mt-12">
          <p data-testid="text-services-final-supporting" className="dclServicesFinal__fadeUp max-w-[480px] text-[16px] leading-7 text-white/60 sm:text-[17px]">
            {servicesFinalCta.supporting}
          </p>
          <a
            ref={ctaRef}
            href={servicesFinalCta.primaryCta.href}
            data-testid="link-services-final-primary"
            className="dclServicesFinal__cta group inline-flex shrink-0 items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {servicesFinalCta.primaryCta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </a>
        </div>
      </div>
    </section>
  );
}
