import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { impressumHero } from '@/data/impressum-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ImpressumHero() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclImpressumHero__bg', '.dclImpressumHero__eyebrowRule', '.dclImpressumHero__revealLine', '.dclImpressumHero__fadeUp'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclImpressumHero__bg', { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.3, ease: 'power2.out' })
        .fromTo('.dclImpressumHero__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.6 }, '-=0.9')
        .fromTo('.dclImpressumHero__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.55 }, '<')
        .fromTo('.dclImpressumHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9 }, '-=0.25')
        .fromTo('.dclImpressumHero__fadeUp--body', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.4');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="impressum-hero" ref={rootRef} aria-labelledby="impressum-hero-title" className="relative overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div
        className="dclImpressumHero__bg absolute inset-0 bg-no-repeat"
        style={{ backgroundImage: `url(${impressumHero.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080a0d]/95 via-[#080a0d]/70 to-[#080a0d]/40" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1560px] px-6 pb-14 pt-32 sm:px-10 lg:px-16 lg:pb-16 lg:pt-36">
        <div className="max-w-[560px]">
          <div className="flex items-center gap-3">
            <span className="dclImpressumHero__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
            <p data-testid="text-impressum-hero-label" className="dclHome__eyebrow dclImpressumHero__fadeUp dclImpressumHero__fadeUp--eyebrow text-[#8bbfe8]">
              {impressumHero.label}
            </p>
          </div>
          <h1 id="impressum-hero-title" data-testid="text-impressum-hero-title" className="dclHome__display mt-5 text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclImpressumHero__revealLine block">{impressumHero.headline}</span></span>
          </h1>
          <p data-testid="text-impressum-hero-intro" className="dclImpressumHero__fadeUp dclImpressumHero__fadeUp--body mt-6 text-[17px] leading-[1.65] text-white/70">
            {impressumHero.intro}
          </p>
          <p className="dclImpressumHero__fadeUp dclImpressumHero__fadeUp--body mt-4 text-[13px] text-white/40">{impressumHero.lastUpdated}</p>
        </div>
      </div>
    </section>
  );
}
