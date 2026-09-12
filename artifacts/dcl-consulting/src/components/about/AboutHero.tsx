import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { aboutHeroImage } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclAboutHero__reveal', '.dclAboutHero__revealLine', '.dclAboutHero__imageWrap'], { clearProps: 'all' });
        if (highlightRef.current) highlightRef.current.style.color = '#8bbfe8';
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclAboutHero__imageWrap', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2 })
        .fromTo('.dclAboutHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.15)
        .to(highlightRef.current, { color: '#8bbfe8', duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclAboutHero__reveal--intro', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo('.dclAboutHero__reveal--support', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45')
        .fromTo('.dclAboutHero__reveal--meta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.35');

      gsap.to('.dclAboutHero__image', {
        yPercent: 8,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.dclAboutHero__textBlock', {
        y: -24,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about-hero" ref={rootRef} aria-labelledby="about-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="dclAboutHero__imageWrap absolute inset-x-0 bottom-0 top-[38%] overflow-hidden lg:top-[42%]">
        <img className="dclAboutHero__image h-full w-full scale-110 object-cover" src={aboutHeroImage} alt="Architectural facade of a contemporary commercial building" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,13,.85)_0%,rgba(8,10,13,.25)_35%,rgba(8,10,13,.55)_100%)]" />
      </div>

      <div className="dclAboutHero__textBlock relative z-10 mx-auto max-w-[1440px] px-6 pt-40 sm:px-10 lg:px-16">
        <p data-testid="text-about-hero-eyebrow" className="dclHome__eyebrow dclAboutHero__revealLine mb-6 overflow-hidden text-[#c6e3fa]">
          About DCL
        </p>
        <h1
          id="about-hero-title"
          data-testid="text-about-hero-title"
          className="dclHome__display max-w-[820px] text-[clamp(3rem,7.5vw,6.6rem)] leading-[.92] tracking-[-.045em]"
        >
          <span className="block overflow-hidden"><span className="dclAboutHero__revealLine block">Clarity begins</span></span>
          <span className="block overflow-hidden">
            <span ref={highlightRef} className="dclAboutHero__revealLine block">with understanding.</span>
          </span>
        </h1>
        <p className="dclAboutHero__reveal dclAboutHero__reveal--intro mt-9 max-w-[560px] text-[18px] leading-8 text-white/78 sm:text-[20px]">
          DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support for investors and businesses navigating important opportunities and complex decisions.
        </p>
        <p className="dclAboutHero__reveal dclAboutHero__reveal--support mt-6 max-w-[520px] text-[16px] leading-7 text-white/58 sm:text-[17px]">
          We bring together commercial understanding, financial perspective, risk awareness and strategic judgement to help clients see the factors that matter more clearly.
        </p>
        <p className="dclAboutHero__reveal dclAboutHero__reveal--meta mt-10 text-[10px] font-semibold uppercase tracking-[.16em] text-white/45 sm:text-[11px]">
          Independent perspective. Disciplined analysis. Clearer decisions.
        </p>
      </div>
    </section>
  );
}
