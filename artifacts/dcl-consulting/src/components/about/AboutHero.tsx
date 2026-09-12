import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const HERO_IMAGE = 'https://picsum.photos/id/1048/1400/1400';

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclAboutHero__rule', '.dclAboutHero__reveal', '.dclAboutHero__revealLine', '.dclAboutHero__imageWrap', '.dclAboutHero__datum'], { clearProps: 'all' });
        if (highlightRef.current) highlightRef.current.style.color = '#8bbfe8';
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclAboutHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' })
        .fromTo('.dclAboutHero__reveal--eyebrow', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.25')
        .fromTo('.dclAboutHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, '-=0.1')
        .to(highlightRef.current, { color: '#8bbfe8', duration: 0.55 }, '-=0.25')
        .fromTo('.dclAboutHero__imageWrap', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.05 }, '-=0.35')
        .fromTo('.dclAboutHero__datum', { scaleY: 0 }, { scaleY: 1, duration: 0.7 }, '-=0.7')
        .fromTo('.dclAboutHero__reveal--copy', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
        .fromTo('.dclAboutHero__reveal--meta', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '-=0.2');

      gsap.to('.dclAboutHero__headline', {
        y: -18,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.dclAboutHero__image', {
        yPercent: 5,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.dclAboutHero__reveal--copy', {
        autoAlpha: 0.85,
        y: 6,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.dclAboutHero__rule', {
        scaleX: 1.6,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '35% top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about-hero" ref={rootRef} aria-labelledby="about-hero-title" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#080a0d] text-white">
      <Header />

      <div className="relative z-10 flex flex-1 flex-col justify-start px-6 pt-28 sm:px-10 lg:px-16 lg:pt-32">
        <div className="flex items-center gap-5">
          <div className="dclAboutHero__rule h-px w-14 origin-left bg-[#8bbfe8]" />
          <p data-testid="text-about-hero-eyebrow" className="dclAboutHero__reveal dclAboutHero__reveal--eyebrow dclHome__eyebrow text-[#c6e3fa]">
            About DCL
          </p>
        </div>

        <h1
          id="about-hero-title"
          data-testid="text-about-hero-title"
          className="dclAboutHero__headline dclHome__display mt-8 max-w-[1040px] text-[clamp(4.25rem,7.2vw,7.5rem)] leading-[.94] tracking-[-.04em] lg:w-[68%]"
        >
          <span className="block overflow-hidden"><span className="dclAboutHero__revealLine block">Clarity begins</span></span>
          <span className="block overflow-hidden">
            <span ref={highlightRef} className="dclAboutHero__revealLine block">with understanding.</span>
          </span>
        </h1>
      </div>

      <div className="relative z-10 flex flex-col lg:h-[52vh] lg:min-h-[420px] lg:flex-row">
        <div className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 lg:w-[36%] lg:px-16 lg:py-0">
          <p className="dclAboutHero__reveal dclAboutHero__reveal--copy max-w-[420px] text-[19px] leading-[1.55] text-white/85">
            DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support for investors and businesses navigating important opportunities and complex decisions.
          </p>
          <p className="dclAboutHero__reveal dclAboutHero__reveal--copy max-w-[400px] text-[16px] leading-7 text-white/55">
            We bring together commercial understanding, financial perspective, risk awareness and strategic judgement to help clients see the factors that matter more clearly.
          </p>
          <div className="dclAboutHero__reveal dclAboutHero__reveal--meta mt-2">
            <div className="mb-3 h-px w-8 bg-white/35" />
            <p data-testid="text-about-hero-meta" className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/50">
              Independent perspective. Disciplined analysis. Clearer decisions.
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="dclAboutHero__datum h-full w-px origin-top bg-white/15" />
        </div>

        <div className="dclAboutHero__imageWrap relative h-[42vh] min-h-[260px] w-full overflow-hidden lg:h-auto lg:flex-1">
          <img
            data-testid="img-about-hero"
            className="dclAboutHero__image h-full w-full scale-105 object-cover"
            src={HERO_IMAGE}
            alt="Upward view of contemporary financial district architecture, used as institutional context imagery"
          />
        </div>
      </div>
    </section>
  );
}
