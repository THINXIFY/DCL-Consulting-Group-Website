import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { strategicHero } from '@/data/strategic-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/strategic-advisory-hero.webp';

// Broader, more confident pacing than the transaction-led pages: a
// wider text column, generous spacing and a calm bottom-to-top image
// reveal rather than a sharp directional clip.
export function StrategicHero() {
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
          ['.dclStHero__label', '.dclStHero__rule', '.dclStHero__revealLine', '.dclStHero__fadeUp', '.dclStHero__imageWrap', '.dclStHero__keyword', '.dclStHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclStHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclStHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, '-=0.3')
        .fromTo('.dclStHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.25')
        .fromTo('.dclStHero__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.45')
        .fromTo('.dclStHero__imageWrap', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.out' }, '-=0.8')
        .to(imageRef.current, { scale: 1, duration: 1.3, ease: 'power3.out' }, '<')
        .fromTo('.dclStHero__statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.7')
        .fromTo('.dclStHero__keyword', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, '-=0.5');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1.3 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="strategic-hero" ref={rootRef} aria-labelledby="st-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[40%] lg:px-14 lg:pb-20 lg:pt-28">
          <p data-testid="text-st-hero-label" className="dclHome__eyebrow dclStHero__label text-[#8bbfe8]">
            {strategicHero.label}
          </p>
          <div className="dclStHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1 id="st-hero-title" data-testid="text-st-hero-title" className="dclHome__display mt-6 text-[clamp(2.7rem,5.2vw,4.6rem)] leading-[1] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclStHero__revealLine block">{strategicHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclStHero__revealLine block">{strategicHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-st-hero-intro" className="dclStHero__fadeUp mt-7 max-w-[420px] text-[17px] leading-[1.7] text-white/65">
            {strategicHero.intro}
          </p>
          <Link
            href={strategicHero.cta.href}
            data-testid="link-st-hero-cta"
            className="dclStHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {strategicHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-st-hero-keywords" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
            {strategicHero.keywords.map((keyword) => (
              <span key={keyword} className="dclStHero__keyword text-[11px] font-medium uppercase tracking-[.13em] text-white/35">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[50vh] flex-1 lg:min-h-0">
          <div className="dclStHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-st-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Low-angle view of a diagrid glass facade catching warm evening light with a crescent moon visible"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/50 via-[#080a0d]/5 to-transparent lg:from-[#080a0d]/62 lg:via-[#080a0d]/5" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/40 via-transparent to-transparent" />
          </div>

          <div data-testid="text-st-hero-statement" className="absolute bottom-8 right-6 max-w-[240px] text-right sm:bottom-10 sm:right-10 lg:bottom-12 lg:right-12">
            {strategicHero.imageStatementLines.map((line) => (
              <p key={line} className="dclStHero__statement dclHome__display text-[19px] italic leading-[1.35] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.4)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
