import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { termsHero } from '@/data/terms-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const TERMS_IMAGE = {
  src: '/images/home/home-approach-band.webp',
  alt: 'Office stairwell with dramatic diagonal light and shadow leading toward a bright window',
};

export function TermsHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclTermsHero__label', '.dclTermsHero__rule', '.dclTermsHero__revealLine', '.dclTermsHero__fadeUp', '.dclTermsHero__imageWrap', '.dclTermsHero__statement'], {
          clearProps: 'all',
        });
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.06 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclTermsHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclTermsHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, '-=0.2')
        .fromTo('.dclTermsHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9 }, '-=0.2')
        .fromTo('.dclTermsHero__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.4')
        .fromTo(
          '.dclTermsHero__imageWrap',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.out' },
          '-=0.6',
        )
        .to(imageRef.current, { scale: 1, duration: 1.1, ease: 'power3.out' }, '<')
        .fromTo('.dclTermsHero__statement', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, '-=0.3');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="terms-hero" ref={rootRef} aria-labelledby="terms-hero-title" className="relative overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto max-w-[1560px] px-6 pb-14 pt-32 sm:px-10 lg:px-16 lg:pb-16 lg:pt-36">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <p data-testid="text-terms-hero-label" className="dclHome__eyebrow dclTermsHero__label text-[#8bbfe8]">
              {termsHero.label}
            </p>
            <div className="dclTermsHero__rule mt-4 h-px w-12 origin-left bg-[#8bbfe8]" />
            <h1 id="terms-hero-title" data-testid="text-terms-hero-title" className="dclHome__display mt-5 text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-.025em]">
              <span className="block overflow-hidden"><span className="dclTermsHero__revealLine block">{termsHero.headline}</span></span>
            </h1>
            <p data-testid="text-terms-hero-lead" className="dclTermsHero__fadeUp mt-6 max-w-[480px] text-[18px] leading-[1.65] text-white/80">
              {termsHero.lead}
            </p>
            <p data-testid="text-terms-hero-supporting" className="dclTermsHero__fadeUp mt-4 max-w-[480px] text-[16px] leading-[1.65] text-white/60">
              {termsHero.supporting}
            </p>
            <p className="dclTermsHero__fadeUp mt-5 text-[13px] text-white/40">{termsHero.lastUpdated}</p>
          </div>

          <div className="lg:col-span-6">
            <div className="dclTermsHero__imageWrap relative aspect-[16/9] w-full overflow-hidden">
              <img ref={imageRef} data-testid="img-terms-hero" className="h-full w-full object-cover object-center" src={TERMS_IMAGE.src} alt={TERMS_IMAGE.alt} loading="eager" decoding="async" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/50 via-transparent to-transparent" />
              <div data-testid="text-terms-hero-statement" className="absolute bottom-5 right-5 text-right">
                {termsHero.statementLines.map((line) => (
                  <p key={line} className="dclTermsHero__statement text-[11px] font-semibold uppercase leading-[1.6] tracking-[.14em] text-white">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
