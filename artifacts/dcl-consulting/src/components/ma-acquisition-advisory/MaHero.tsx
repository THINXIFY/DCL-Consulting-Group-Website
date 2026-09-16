import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { maHero } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/ma-acquisition-hero.webp';

// Tighter, sharper than the Strategic Advisory hero: a narrower text
// column, a left-to-right clip reveal and faster power4 easing to give
// the page a more decisive transaction rhythm.
export function MaHero() {
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
          ['.dclMaHero__label', '.dclMaHero__rule', '.dclMaHero__revealLine', '.dclMaHero__fadeUp', '.dclMaHero__imageWrap', '.dclMaHero__keyword', '.dclMaHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclMaHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45 })
        .fromTo('.dclMaHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.out' }, '-=0.15')
        .fromTo('.dclMaHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.8, stagger: 0.07 }, '-=0.1')
        .fromTo('.dclMaHero__fadeUp', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclMaHero__imageWrap', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power4.out' }, '-=0.55')
        .to(imageRef.current, { scale: 1, duration: 1, ease: 'power3.out' }, '<')
        .fromTo('.dclMaHero__statement', { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.45')
        .fromTo('.dclMaHero__keyword', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' }, '-=0.35');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.7 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="ma-hero" ref={rootRef} aria-labelledby="ma-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[38%] lg:px-12 lg:pb-20 lg:pt-28">
          <p data-testid="text-ma-hero-label" className="dclHome__eyebrow dclMaHero__label text-[#8bbfe8]">
            {maHero.label}
          </p>
          <div className="dclMaHero__rule mt-4 h-px w-10 origin-left bg-[#8bbfe8]" />
          <h1 id="ma-hero-title" data-testid="text-ma-hero-title" className="dclHome__display mt-5 text-[clamp(2.5rem,4.8vw,4.2rem)] leading-[.98] tracking-[-.025em]">
            <span className="block overflow-hidden"><span className="dclMaHero__revealLine block">{maHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclMaHero__revealLine block">{maHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-ma-hero-intro" className="dclMaHero__fadeUp mt-6 max-w-[400px] text-[16px] leading-[1.6] text-white/65">
            {maHero.intro}
          </p>
          <Link
            href={maHero.cta.href}
            data-testid="link-ma-hero-cta"
            className="dclMaHero__fadeUp group mt-8 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {maHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-ma-hero-keywords" className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/12 pt-5">
            {maHero.keywords.map((keyword) => (
              <span key={keyword} className="dclMaHero__keyword text-[11px] font-semibold uppercase tracking-[.13em] text-white/40">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[46vh] flex-1 lg:min-h-0">
          <div className="dclMaHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-ma-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Low-angle view of a building corner where a dark tiled facade and a light stone facade meet at a sharp vertical edge"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/58 via-[#080a0d]/8 to-transparent lg:from-[#080a0d]/72 lg:via-[#080a0d]/10" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
          </div>

          <div data-testid="text-ma-hero-statement" className="absolute right-6 top-8 max-w-[220px] text-right sm:right-10 sm:top-10 lg:right-12 lg:top-12">
            {maHero.imageStatementLines.map((line) => (
              <p key={line} className="dclMaHero__statement dclHome__display text-[18px] italic leading-[1.3] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.45)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
