import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { investmentConsultingHero } from '@/data/investment-consulting-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/investment-consulting-hero.webp';

export function InvestmentConsultingHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclIcHero__label', '.dclIcHero__rule', '.dclIcHero__revealLine', '.dclIcHero__fadeUp', '.dclIcHero__imageWrap', '.dclIcHero__keyword', '.dclIcHero__statement'], {
          clearProps: 'all',
        });
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.04 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclIcHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclIcHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power2.out' }, '-=0.25')
        .fromTo('.dclIcHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.09 }, '-=0.2')
        .fromTo('.dclIcHero__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo('.dclIcHero__imageWrap', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out' }, '-=0.7')
        .to(imageRef.current, { scale: 1, duration: 1.2, ease: 'power3.out' }, '<')
        .fromTo('.dclIcHero__statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.6')
        .fromTo('.dclIcHero__keyword', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.5');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.dclIcHero__textCol', {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="investment-consulting-hero" ref={rootRef} aria-labelledby="ic-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <HeroBackground rootRef={rootRef} />
      <Header />
      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <div className="dclIcHero__textCol relative z-10 flex flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:w-[40%] lg:px-16 lg:pb-20 lg:pt-28">
          <div className="flex items-center gap-4">
            <p data-testid="text-ic-hero-label" className="dclHome__eyebrow dclIcHero__label text-[#8bbfe8]">
              {investmentConsultingHero.label}
            </p>
            <div className="dclIcHero__rule h-px w-10 origin-left bg-[#8bbfe8]" />
          </div>
          <h1 id="ic-hero-title" data-testid="text-ic-hero-title" className="dclHome__display mt-6 text-[clamp(3rem,6.2vw,5.4rem)] leading-[.96] tracking-[-.03em]">
            <span className="block overflow-hidden"><span className="dclIcHero__revealLine block">{investmentConsultingHero.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclIcHero__revealLine block">{investmentConsultingHero.headlineLines[1]}</span></span>
          </h1>
          <p data-testid="text-ic-hero-intro" className="dclIcHero__fadeUp mt-7 max-w-[440px] text-[18px] leading-[1.6] text-white/70">
            {investmentConsultingHero.intro}
          </p>
          <Link
            href={investmentConsultingHero.cta.href}
            data-testid="link-ic-hero-cta"
            className="dclIcHero__fadeUp group mt-9 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            {investmentConsultingHero.cta.label}
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
          </Link>

          <div data-testid="text-ic-hero-keywords" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/12 pt-6">
            {investmentConsultingHero.keywords.map((keyword) => (
              <span key={keyword} className="dclIcHero__keyword text-[11px] font-semibold uppercase tracking-[.13em] text-white/40">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[46vh] flex-1 lg:min-h-0">
          <div className="dclIcHero__imageWrap absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              data-testid="img-ic-hero"
              className="h-full w-full object-cover object-center"
              src={SECTION_IMAGE}
              alt="Upward view of a sharp-cornered glass office tower against a pale sky with visible geometric setbacks"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080a0d]/55 via-[#080a0d]/5 to-transparent lg:from-[#080a0d]/70 lg:via-[#080a0d]/10" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
          </div>

          <div data-testid="text-ic-hero-statement" className="absolute bottom-8 right-6 max-w-[260px] text-right sm:bottom-10 sm:right-10 lg:bottom-12 lg:right-12">
            {investmentConsultingHero.imageStatementLines.map((line) => (
              <p key={line} className="dclIcHero__statement dclHome__display text-[19px] italic leading-[1.35] text-white" style={{ textShadow: '0 1px 10px rgba(0,0,0,.45)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
