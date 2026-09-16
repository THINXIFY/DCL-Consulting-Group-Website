import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { riskHero } from '@/data/risk-opportunity-assessment-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/risk-opportunity-hero.webp';

// Precise vertical clip reveal - the image resolves top-to-bottom in a
// single controlled motion, matching the "analytical, balanced,
// precise" character of this page. The image is given more width than
// the text column (per the reference), letting it dominate slightly.
export function RiskHero() {
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
          ['.dclRiskHero__label', '.dclRiskHero__rule', '.dclRiskHero__revealLine', '.dclRiskHero__fadeUp', '.dclRiskHero__imageWrap', '.dclRiskHero__keyword', '.dclRiskHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.05 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclRiskHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclRiskHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, '-=0.25')
        .fromTo('.dclRiskHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.09 }, '-=0.2')
        .fromTo('.dclRiskHero__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(
          '.dclRiskHero__imageWrap',
          { clipPath: 'inset(0% 0 100% 0)' },
          { clipPath: 'inset(0% 0 0% 0)', duration: 1.1, ease: 'power4.out' },
          '-=0.65',
        )
        .to(imageRef.current, { scale: 1, duration: 1.2, ease: 'power3.out' }, '<')
        .fromTo('.dclRiskHero__statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.7')
        .fromTo('.dclRiskHero__keyword', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, '-=0.45');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="risk-hero" ref={rootRef} aria-labelledby="risk-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[42%] lg:px-14 lg:pb-20 lg:pt-28">
          <p data-testid="text-risk-hero-label" className="dclHome__eyebrow dclRiskHero__label text-[#8bbfe8]">
            {riskHero.label}
          </p>
          <div className="dclRiskHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1 id="risk-hero-title" data-testid="text-risk-hero-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.02] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclRiskHero__revealLine block">{riskHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclRiskHero__revealLine block">{riskHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-risk-hero-intro" className="dclRiskHero__fadeUp mt-7 max-w-[420px] text-[17px] leading-[1.65] text-white/65">
            {riskHero.intro}
          </p>
          <Link
            href={riskHero.cta.href}
            data-testid="link-risk-hero-cta"
            className="dclRiskHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {riskHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-risk-hero-keywords" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
            {riskHero.keywords.map((keyword) => (
              <span key={keyword} className="dclRiskHero__keyword text-[11px] font-medium uppercase tracking-[.13em] text-white/35">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[50vh] flex-1 lg:min-h-0">
          <div className="dclRiskHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-risk-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Silhouette of angled roof fins on a building against a dusk sky gradating from purple to orange"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/50 via-[#080a0d]/5 to-transparent lg:from-[#080a0d]/60 lg:via-[#080a0d]/5" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/40 via-transparent to-transparent" />
          </div>

          <div data-testid="text-risk-hero-statement" className="absolute bottom-8 right-6 max-w-[220px] text-right sm:bottom-10 sm:right-10 lg:bottom-12 lg:right-12">
            {riskHero.imageStatementLines.map((line) => (
              <p key={line} className="dclRiskHero__statement dclHome__display text-[19px] italic leading-[1.35] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.4)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
