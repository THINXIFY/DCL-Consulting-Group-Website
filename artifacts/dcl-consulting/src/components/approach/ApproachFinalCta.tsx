import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { approachFinalCta } from '@/data/approach-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function ApproachFinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApproachFinal__revealLine', '.dclApproachFinal__fadeUp', '.dclApproachFinal__rule', '.dclApproachFinal__cta'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 74%' } });
      tl.fromTo('.dclApproachFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclApproachFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1.1, ease: 'power2.out' }, '-=0.4')
        .fromTo('.dclApproachFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.7')
        .fromTo('.dclApproachFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="approach-final-cta" ref={rootRef} aria-labelledby="approach-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="approach-final-title" data-testid="text-approach-final-title" className="dclHome__display max-w-[1100px] text-[clamp(2.6rem,6vw,5.4rem)] leading-[.98] tracking-[-.035em]">
          <span className="block overflow-hidden"><span className="dclApproachFinal__revealLine block">{approachFinalCta.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclApproachFinal__revealLine block text-[#8bbfe8]">{approachFinalCta.headlineLines[1]}</span></span>
        </h2>

        <div className="dclApproachFinal__rule mt-12 h-px w-full bg-[#8bbfe8] lg:mt-16" />

        <div className="mt-12 grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <p data-testid="text-approach-final-supporting" className="dclApproachFinal__fadeUp max-w-[560px] text-[17px] leading-7 text-white/65 sm:text-[18px] lg:col-span-7">
            {approachFinalCta.supporting}
          </p>

          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9 lg:items-end">
            <a
              ref={ctaRef}
              href={approachFinalCta.primaryCta.href}
              data-testid="link-approach-final-primary"
              className="dclApproachFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {approachFinalCta.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
            <a
              href={approachFinalCta.secondaryCta.href}
              data-testid="link-approach-final-secondary"
              className="dclApproachFinal__cta inline-flex items-center border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {approachFinalCta.secondaryCta.label}
            </a>
            <p data-testid="text-approach-final-closing" className="dclApproachFinal__cta mt-4 text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
              {approachFinalCta.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
