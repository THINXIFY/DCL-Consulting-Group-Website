import { useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { finalCta } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function AboutFinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclAboutFinal__revealLine', '.dclAboutFinal__fadeUp', '.dclAboutFinal__rule', '.dclAboutFinal__cta'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } });
      tl.fromTo('.dclAboutFinal__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclAboutFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.9, ease: 'power2.out' }, '-=0.5')
        .fromTo('.dclAboutFinal__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.6')
        .fromTo('.dclAboutFinal__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3');

      gsap.to('.dclAboutFinal__rule', {
        scaleX: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'top 40%', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about-final-cta" ref={rootRef} aria-labelledby="about-final-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-8">
            <h2
              id="about-final-title"
              data-testid="text-about-final-title"
              className="dclHome__display text-[clamp(2.6rem,5.6vw,5rem)] leading-[.98] tracking-[-.035em]"
            >
              <span className="block overflow-hidden"><span className="dclAboutFinal__revealLine block">{finalCta.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclAboutFinal__revealLine block text-[#8bbfe8]">{finalCta.headlineLines[1]}</span></span>
            </h2>

            <div className="dclAboutFinal__rule mt-10 h-px w-full max-w-[640px] origin-left bg-[#8bbfe8]" />

            <p data-testid="text-about-final-supporting" className="dclAboutFinal__fadeUp mt-8 max-w-[520px] text-[17px] leading-7 text-white/65 sm:text-[18px]">
              {finalCta.supporting}
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9 lg:items-end">
            <a
              ref={ctaRef}
              href={finalCta.primaryCta.href}
              data-testid="link-about-final-primary"
              className="dclAboutFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {finalCta.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
            <a
              href={finalCta.secondaryCta.href}
              data-testid="link-about-final-secondary"
              className="dclAboutFinal__cta inline-flex items-center border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {finalCta.secondaryCta.label}
            </a>
            <p data-testid="text-about-final-closing" className="dclAboutFinal__cta mt-4 text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
              {finalCta.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
