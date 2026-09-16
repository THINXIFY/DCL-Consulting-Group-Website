import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { partnersHero } from '@/data/partners-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function PartnersHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclPartnersHero__label', '.dclPartnersHero__rule', '.dclPartnersHero__revealLine', '.dclPartnersHero__fadeUp', '.dclPartnersHero__imageWrap', '.dclPartnersHero__statement', '.dclPartnersHero__cta'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.08 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclPartnersHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclPartnersHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, '-=0.2')
        .fromTo('.dclPartnersHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, '-=0.2')
        .fromTo('.dclPartnersHero__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.5')
        .fromTo('.dclPartnersHero__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.3')
        .fromTo(
          '.dclPartnersHero__imageWrap',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power4.out' },
          '-=0.8',
        )
        .to(imageRef.current, { scale: 1, duration: 1.2, ease: 'power3.out' }, '<')
        .fromTo('.dclPartnersHero__statement', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, '-=0.3');

      if (rootRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="partners-hero" ref={rootRef} aria-labelledby="partners-hero-title" className="relative overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-32 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-16 lg:pb-20 lg:pt-40">
        <div className="max-w-[560px]">
          <p data-testid="text-partners-hero-label" className="dclHome__eyebrow dclPartnersHero__label text-[#8bbfe8]">
            {partnersHero.eyebrow}
          </p>
          <div className="dclPartnersHero__rule mt-4 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1 id="partners-hero-title" data-testid="text-partners-hero-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5.2vw,4.4rem)] leading-[1.02] tracking-[-.03em]">
            {partnersHero.headlineLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="dclPartnersHero__revealLine block">{line}</span>
              </span>
            ))}
          </h1>
          <p data-testid="text-partners-hero-lead" className="dclPartnersHero__fadeUp mt-7 max-w-[460px] text-[19px] leading-[1.6] text-white/85">
            {partnersHero.lead}
          </p>
          <p data-testid="text-partners-hero-body" className="dclPartnersHero__fadeUp mt-4 max-w-[460px] text-[16px] leading-7 text-white/60">
            {partnersHero.body}
          </p>
          <div className="mt-9 flex flex-wrap gap-5">
            <a
              ref={ctaRef}
              href={partnersHero.primaryCta.href}
              data-testid="link-partners-hero-primary"
              className="dclPartnersHero__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] hover:shadow-[0_8px_28px_rgba(139,191,232,.4)] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {partnersHero.primaryCta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </a>
            <Link
              href={partnersHero.secondaryCta.href}
              data-testid="link-partners-hero-secondary"
              className="dclPartnersHero__cta inline-flex items-center border-b border-white/45 px-1 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {partnersHero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="dclPartnersHero__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-[560px]">
          <img
            ref={imageRef}
            data-testid="img-partners-hero"
            className="h-full w-full object-cover"
            src={partnersHero.image.src}
            alt={partnersHero.image.alt}
            loading="eager"
            decoding="async"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
          <div data-testid="text-partners-hero-statement" className="absolute bottom-6 right-6 text-right">
            {partnersHero.statementLines.map((line) => (
              <p key={line} className="dclPartnersHero__statement text-[11px] font-semibold uppercase leading-[1.6] tracking-[.14em] text-white">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
