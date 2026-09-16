import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { marketHero } from '@/data/market-entry-expansion-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/market-entry-hero.webp';

// Horizontal directional reveal (left to right) rather than the Risk
// page's vertical wipe - gives Market Entry a more "forward-moving"
// character, matching the international / directional brief.
export function MarketHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclMeHero__label', '.dclMeHero__rule', '.dclMeHero__revealLine', '.dclMeHero__fadeUp', '.dclMeHero__imageWrap', '.dclMeHero__keyword', '.dclMeHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.06 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclMeHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclMeHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, '-=0.25')
        .fromTo('.dclMeHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.09 }, '-=0.2')
        .fromTo('.dclMeHero__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(
          '.dclMeHero__imageWrap',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: 'power4.out' },
          '-=0.65',
        )
        .to(imageRef.current, { scale: 1, duration: 1.25, ease: 'power3.out' }, '<')
        .fromTo('.dclMeHero__statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.7')
        .fromTo('.dclMeHero__keyword', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, '-=0.45');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          xPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="market-hero" ref={rootRef} aria-labelledby="market-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[44%] lg:px-14 lg:pb-20 lg:pt-28">
          <p data-testid="text-market-hero-label" className="dclHome__eyebrow dclMeHero__label text-[#8bbfe8]">
            {marketHero.label}
          </p>
          <div className="dclMeHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1 id="market-hero-title" data-testid="text-market-hero-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5vw,4.3rem)] leading-[1.02] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclMeHero__revealLine block">{marketHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclMeHero__revealLine block">{marketHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-market-hero-intro" className="dclMeHero__fadeUp mt-7 max-w-[420px] text-[17px] leading-[1.65] text-white/65">
            {marketHero.intro}
          </p>
          <Link
            href={marketHero.cta.href}
            data-testid="link-market-hero-cta"
            className="dclMeHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {marketHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-market-hero-keywords" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
            {marketHero.keywords.map((keyword) => (
              <span key={keyword} className="dclMeHero__keyword text-[11px] font-medium uppercase tracking-[.13em] text-white/35">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[50vh] flex-1 lg:min-h-0">
          <div className="dclMeHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-market-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Low-angle view of two glass skyscrapers connected by enclosed sky bridges"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/50 via-[#080a0d]/5 to-transparent lg:from-[#080a0d]/58 lg:via-[#080a0d]/5" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/40 via-transparent to-transparent" />
          </div>

          <div data-testid="text-market-hero-statement" className="absolute bottom-8 right-6 max-w-[220px] text-right sm:bottom-10 sm:right-10 lg:bottom-12 lg:right-12">
            {marketHero.imageStatementLines.map((line) => (
              <p key={line} className="dclMeHero__statement dclHome__display text-[19px] italic leading-[1.35] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.4)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
