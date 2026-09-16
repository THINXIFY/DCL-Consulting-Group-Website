import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { realEstateHero } from '@/data/real-estate-investment-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/real-estate-hero.webp';

export function RealEstateHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclReHero__label', '.dclReHero__revealLine', '.dclReHero__fadeUp', '.dclReHero__imageWrap', '.dclReHero__keyword', '.dclReHero__statement'], {
          clearProps: 'all',
        });
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclReHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclReHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.09 }, '-=0.25')
        .fromTo('.dclReHero__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo(
          '.dclReHero__imageWrap',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out' },
          '-=0.7',
        )
        .to(imageRef.current, { scale: 1, duration: 1.2, ease: 'power3.out' }, '<')
        .fromTo('.dclReHero__statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.6')
        .fromTo('.dclReHero__keyword', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.5');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="real-estate-hero" ref={rootRef} aria-labelledby="real-estate-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[42%] lg:px-16 lg:pb-20 lg:pt-28">
          <p data-testid="text-real-estate-hero-label" className="dclHome__eyebrow dclReHero__label text-[#8bbfe8]">
            {realEstateHero.label}
          </p>
          <h1
            id="real-estate-hero-title"
            data-testid="text-real-estate-hero-title"
            className="dclHome__display mt-6 text-[clamp(2.8rem,5.6vw,4.6rem)] leading-[.98] tracking-[-.03em]"
          >
            <span className="block overflow-hidden"><span className="dclReHero__revealLine block">{realEstateHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclReHero__revealLine block">{realEstateHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-real-estate-hero-supporting" className="dclReHero__fadeUp mt-7 max-w-[420px] text-[18px] leading-[1.6] text-white/70">
            {realEstateHero.supporting}
          </p>
          <Link
            href={realEstateHero.cta.href}
            data-testid="link-real-estate-hero-cta"
            className="dclReHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {realEstateHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-real-estate-hero-keywords" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/12 pt-6">
            {realEstateHero.keywords.map((keyword) => (
              <span key={keyword} className="dclReHero__keyword text-[11px] font-semibold uppercase tracking-[.13em] text-white/40">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[46vh] flex-1 lg:min-h-0">
          <div className="dclReHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-real-estate-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Low-angle view of a tall blue-glass high-rise building against a cloudy sky, with an older building beside it"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/55 via-[#080a0d]/5 to-transparent lg:from-[#080a0d]/70 lg:via-[#080a0d]/10" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/50 via-transparent to-transparent" />
          </div>

          <div data-testid="text-real-estate-hero-statement" className="absolute right-6 top-8 max-w-[280px] text-right sm:right-10 sm:top-10 lg:right-12 lg:top-12">
            <div className="dclReHero__statement h-px w-10 origin-right bg-[#8bbfe8]" />
            {realEstateHero.imageStatementLines.map((line) => (
              <p key={line} className="dclReHero__statement dclHome__display mt-3 text-[19px] italic leading-[1.35] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.4)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
