import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function FinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const startRef = useRef<HTMLAnchorElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(startRef, { strength: 0.3 });
  useMagnetic(exploreRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFinal__revealLine', '.dclFinal__fadeUp', '.dclFinal__rule', '.dclFinal__cta'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      tl.fromTo('.dclFinal__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclFinal__fadeUp', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
        .fromTo('.dclFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 }, '-=0.3')
        .fromTo('.dclFinal__cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="final-cta" ref={rootRef} aria-labelledby="final-cta-title" className="bg-[#080a0d] px-6 py-24 text-center text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[900px]">
        <h2 id="final-cta-title" data-testid="text-final-title" className="dclHome__display text-[clamp(2.6rem,6vw,5.6rem)] leading-[.95] tracking-[-.04em]">
          <span className="block overflow-hidden"><span className="dclFinal__revealLine block">Bring greater clarity</span></span>
          <span className="block overflow-hidden"><span className="dclFinal__revealLine block text-[#c6e3fa]">to the next decision.</span></span>
        </h2>
        <p className="dclFinal__fadeUp mx-auto mt-8 max-w-[560px] text-[16px] leading-7 text-white/65 sm:text-[18px]">
          Speak with DCL about an investment opportunity, strategic decision or business assessment that would benefit from independent perspective and disciplined analysis.
        </p>

        <div className="dclFinal__rule mx-auto mt-14 h-px w-full max-w-[420px] bg-white/25" />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <a
            ref={startRef}
            href="#about"
            data-testid="link-final-start-conversation"
            className="dclFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] hover:shadow-[0_8px_28px_rgba(139,191,232,.4)] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            Start a Conversation
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
          </a>
          <a
            ref={exploreRef}
            href="#expertise"
            data-testid="link-final-explore-expertise"
            className="dclFinal__cta inline-flex items-center border-b border-white/45 px-1 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
          >
            Explore Our Expertise
          </a>
        </div>

        <p className="dclFinal__cta mt-14 text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
          Independent perspective. Structured analysis. Clearer decisions.
        </p>
      </div>
    </section>
  );
}
