import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { privacySupportCta } from '@/data/privacy-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function PrivacySupportCta() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.dclPrivacySupport__fadeUp', { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPrivacySupport__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="privacy-support-cta" ref={rootRef} aria-labelledby="privacy-support-title" className="bg-[#c6e3fa] px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="dclPrivacySupport__fadeUp text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d]/60">{privacySupportCta.label}</p>
          <h2 id="privacy-support-title" data-testid="text-privacy-support-title" className="dclHome__display dclPrivacySupport__fadeUp mt-3 text-[1.7rem] leading-[1.1] text-[#080a0d]">
            {privacySupportCta.headline}
          </h2>
          <p className="dclPrivacySupport__fadeUp mt-3 max-w-[480px] text-[15px] leading-6 text-[#080a0d]/70">{privacySupportCta.copy}</p>
        </div>
        <Link
          href={privacySupportCta.cta.href}
          data-testid="link-privacy-support-cta"
          className="dclPrivacySupport__fadeUp group inline-flex shrink-0 items-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#080a0d]"
        >
          {privacySupportCta.cta.label}
          <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
        </Link>
      </div>
    </section>
  );
}
