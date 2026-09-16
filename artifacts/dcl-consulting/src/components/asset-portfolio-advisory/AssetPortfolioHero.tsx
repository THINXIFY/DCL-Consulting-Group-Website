import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { assetPortfolioHero } from '@/data/asset-portfolio-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/asset-portfolio-hero.webp';

// Calmer, more long-term feeling than the Investment Consulting hero:
// the image is allowed more horizontal room (roughly two-thirds of the
// viewport rather than three-fifths), the text column is narrower and
// more restrained, and the headline sits a touch smaller/tighter.
export function AssetPortfolioHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApHero__label', '.dclApHero__rule', '.dclApHero__revealLine', '.dclApHero__fadeUp', '.dclApHero__imageWrap', '.dclApHero__keyword', '.dclApHero__statement'], {
          clearProps: 'all',
        });
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclApHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclApHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclApHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.25')
        .fromTo('.dclApHero__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45')
        .fromTo('.dclApHero__imageWrap', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power3.out' }, '-=0.8')
        .to(imageRef.current, { scale: 1, duration: 1.3, ease: 'power3.out' }, '<')
        .fromTo('.dclApHero__statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.7')
        .fromTo('.dclApHero__keyword', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.5');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="asset-portfolio-hero" ref={rootRef} aria-labelledby="ap-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[36%] lg:px-14 lg:pb-20 lg:pt-28">
          <div className="flex items-center gap-4">
            <p data-testid="text-ap-hero-label" className="dclHome__eyebrow dclApHero__label text-[#8bbfe8]">
              {assetPortfolioHero.label}
            </p>
          </div>
          <div className="dclApHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1 id="ap-hero-title" data-testid="text-ap-hero-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.02] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclApHero__revealLine block">{assetPortfolioHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclApHero__revealLine block">{assetPortfolioHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-ap-hero-intro" className="dclApHero__fadeUp mt-7 max-w-[380px] text-[17px] leading-[1.65] text-white/65">
            {assetPortfolioHero.intro}
          </p>
          <Link
            href={assetPortfolioHero.cta.href}
            data-testid="link-ap-hero-cta"
            className="dclApHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {assetPortfolioHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-ap-hero-keywords" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
            {assetPortfolioHero.keywords.map((keyword) => (
              <span key={keyword} className="dclApHero__keyword text-[11px] font-medium uppercase tracking-[.13em] text-white/35">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[50vh] flex-1 lg:min-h-0">
          <div className="dclApHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-ap-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Close-up of a high-rise building grey grid facade with repeating square structural bays"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/50 via-[#080a0d]/5 to-transparent lg:from-[#080a0d]/65 lg:via-[#080a0d]/5" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/45 via-transparent to-transparent" />
          </div>

          <div data-testid="text-ap-hero-statement" className="absolute left-6 top-8 max-w-[300px] sm:left-10 sm:top-10 lg:left-12 lg:top-12">
            <div className="dclApHero__statement h-px w-10 bg-[#8bbfe8]" />
            {assetPortfolioHero.imageStatementLines.map((line) => (
              <p key={line} className="dclApHero__statement dclHome__display mt-3 text-[19px] italic leading-[1.35] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.4)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
