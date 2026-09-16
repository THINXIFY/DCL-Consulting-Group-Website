import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { privateCapitalHero } from '@/data/private-capital-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/private-capital-hero.webp';

// Sharper, more directional than the Wealth hero: a left-to-right clip
// reveal, a growing architectural rule, and faster power3/power4
// easing rather than the calmer power2 pacing used there.
export function PrivateCapitalHero() {
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
          ['.dclPcHero__label', '.dclPcHero__rule', '.dclPcHero__revealLine', '.dclPcHero__fadeUp', '.dclPcHero__imageWrap', '.dclPcHero__keyword', '.dclPcHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclPcHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclPcHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
        .fromTo('.dclPcHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.85, stagger: 0.08 }, '-=0.15')
        .fromTo('.dclPcHero__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
        .fromTo('.dclPcHero__imageWrap', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.out' }, '-=0.6')
        .to(imageRef.current, { scale: 1, duration: 1.1, ease: 'power3.out' }, '<')
        .fromTo('.dclPcHero__statement', { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: 'power2.out' }, '-=0.5')
        .fromTo('.dclPcHero__keyword', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power2.out' }, '-=0.4');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="private-capital-hero" ref={rootRef} aria-labelledby="pc-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[42%] lg:px-14 lg:pb-20 lg:pt-28">
          <p data-testid="text-pc-hero-label" className="dclHome__eyebrow dclPcHero__label text-[#8bbfe8]">
            {privateCapitalHero.label}
          </p>
          <div className="dclPcHero__rule mt-5 h-px w-14 origin-left bg-[#8bbfe8]" />
          <h1 id="pc-hero-title" data-testid="text-pc-hero-title" className="dclHome__display mt-6 text-[clamp(2.7rem,5.4vw,4.8rem)] leading-[.98] tracking-[-.03em]">
            <span className="block overflow-hidden"><span className="dclPcHero__revealLine block">{privateCapitalHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclPcHero__revealLine block">{privateCapitalHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-pc-hero-intro" className="dclPcHero__fadeUp mt-7 max-w-[420px] text-[17px] leading-[1.6] text-white/68">
            {privateCapitalHero.intro}
          </p>
          <Link
            href={privateCapitalHero.cta.href}
            data-testid="link-pc-hero-cta"
            className="dclPcHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {privateCapitalHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-pc-hero-keywords" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/12 pt-6">
            {privateCapitalHero.keywords.map((keyword) => (
              <span key={keyword} className="dclPcHero__keyword text-[11px] font-semibold uppercase tracking-[.13em] text-white/40">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[46vh] flex-1 lg:min-h-0">
          <div className="dclPcHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-pc-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Silhouetted zigzag louvered building facade against a dusk gradient sky"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/58 via-[#080a0d]/8 to-transparent lg:from-[#080a0d]/72 lg:via-[#080a0d]/10" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
          </div>

          <div data-testid="text-pc-hero-statement" className="absolute right-6 top-8 max-w-[220px] text-right sm:right-10 sm:top-10 lg:right-12 lg:top-12">
            {privateCapitalHero.imageStatementLines.map((line) => (
              <p key={line} className="dclPcHero__statement dclHome__display text-[19px] italic leading-[1.3] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.45)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
