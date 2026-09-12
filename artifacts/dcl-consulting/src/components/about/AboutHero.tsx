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
        gsap.set(['.dclAboutHero__reveal', '.dclAboutHero__revealLine', '.dclAboutHero__imageWrap', '.dclAboutHero__rule'], { clearProps: 'all' });
        if (highlightRef.current) highlightRef.current.style.color = '#8bbfe8';
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclAboutHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12 }, 0.1)
        .to(highlightRef.current, { color: '#8bbfe8', duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo(
          '.dclAboutHero__imageWrap',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.15 },
          0.35,
        )
        .fromTo('.dclAboutHero__image', { scale: 1.04 }, { scale: 1, duration: 1.3, ease: 'power3.out' }, '<')
        .fromTo('.dclAboutHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.7')
        .fromTo('.dclAboutHero__reveal--intro', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.dclAboutHero__reveal--support', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45')
        .fromTo('.dclAboutHero__reveal--meta', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, '-=0.3');

      gsap.to('.dclAboutHero__image', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.dclAboutHero__textBlock', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about-hero" ref={rootRef} aria-labelledby="about-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1520px] flex-col justify-center gap-y-10 px-6 pb-24 pt-[7.5rem] sm:px-10 lg:block lg:px-16 lg:pt-40">
        <div className="relative w-full lg:aspect-[4/5] lg:w-[44%] lg:float-right lg:mt-6 lg:ml-10">
          <div className="dclAboutHero__imageWrap aspect-[4/5] w-full overflow-hidden">
            <img
              className="dclAboutHero__image h-full w-full scale-105 object-cover"
              style={{ objectPosition: '60% 40%' }}
              src={aboutHeroImage}
              alt="Architectural facade of a contemporary commercial building, editorially cropped"
            />
          </div>
        </div>

        <div className="dclAboutHero__textBlock relative z-10">
          <p data-testid="text-about-hero-eyebrow" className="dclHome__eyebrow dclAboutHero__revealLine mb-6 overflow-hidden text-[#c6e3fa]">
            About DCL
          </p>
          <h1
            id="about-hero-title"
            data-testid="text-about-hero-title"
            className="dclHome__display max-w-[640px] text-[clamp(4rem,7vw,7.375rem)] leading-[.92] tracking-[-.045em]"
          >
            <span className="block overflow-hidden"><span className="dclAboutHero__revealLine block">Clarity begins</span></span>
            <span className="block overflow-hidden">
              <span ref={highlightRef} className="dclAboutHero__revealLine block">with understanding.</span>
            </span>
          </h1>

          <div className="dclAboutHero__rule mt-9 h-px w-24 origin-left bg-white/25" />

          <p className="dclAboutHero__reveal dclAboutHero__reveal--intro mt-9 max-w-[440px] text-[19px] leading-8 text-white/78">
            DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support for investors and businesses navigating important opportunities and complex decisions.
          </p>
          <p className="dclAboutHero__reveal dclAboutHero__reveal--support mt-6 max-w-[420px] text-[16px] leading-7 text-white/55">
            We bring together commercial understanding, financial perspective, risk awareness and strategic judgement to help clients see the factors that matter more clearly.
          </p>
        </div>
      </div>

      <p
        data-testid="text-about-hero-meta"
        className="dclAboutHero__reveal dclAboutHero__reveal--meta absolute inset-x-6 bottom-8 text-[10px] font-semibold uppercase tracking-[.16em] text-white/40 sm:inset-x-10 sm:text-[11px] lg:inset-x-16"
      >
        Independent perspective. Disciplined analysis. Clearer decisions.
      </p>
    </section>
  );
}
