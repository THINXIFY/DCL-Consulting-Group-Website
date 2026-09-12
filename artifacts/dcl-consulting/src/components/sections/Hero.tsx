import { useEffect, useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const HERO_IMAGE = 'https://picsum.photos/seed/dcl-hero-facade/1600/2000?grayscale';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHero__reveal', '.dclHero__revealLine', '.dclHero__image', '.dclHero__imageWrap'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.dclHero__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1 },
      )
        .fromTo('.dclHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.1)
        .fromTo('.dclHero__reveal--sub', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.dclHero__reveal--cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.4');

      gsap.to('.dclHero__image', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="top"
      ref={rootRef}
      role="region"
      aria-label="Clarity before capital"
      className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white"
    >
      <Header />
      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-24 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-16">
        <div className="max-w-[620px]">
          <p data-testid="text-hero-eyebrow" className="dclHome__eyebrow dclHero__reveal dclHero__revealLine mb-7 overflow-hidden text-[#c6e3fa]">
            Independent insight. London and international.
          </p>
          <h1
            id="hero-title"
            data-testid="text-hero-title"
            className="dclHome__display text-[clamp(3.2rem,7vw,6.2rem)] leading-[.95] tracking-[-.04em]"
          >
            <span className="block overflow-hidden"><span className="dclHero__revealLine block">Clarity</span></span>
            <span className="block overflow-hidden"><span className="dclHero__revealLine block text-[#c6e3fa]">Before Capital.</span></span>
          </h1>
          <p className="dclHero__reveal dclHero__reveal--sub mt-8 max-w-[480px] text-[16px] leading-7 text-white/70 sm:text-[18px]">
            DCL Consulting helps investors evaluate opportunities with greater clarity through disciplined analysis, strategic insight, and independent perspective.
          </p>
          <div className="mt-9 flex flex-wrap gap-5">
            <a
              href="#expertise"
              data-testid="link-explore-expertise"
              className="dclHero__reveal dclHero__reveal--cta dclMagnetic group inline-flex items-center gap-4 bg-[#c6e3fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Explore Our Expertise
              <ArrowDownRight size={15} strokeWidth={1.3} className="transition-transform group-hover:translate-y-1" />
            </a>
            <a
              href="#about"
              data-testid="link-start-conversation-hero"
              className="dclHero__reveal dclHero__reveal--cta dclMagnetic inline-flex items-center border-b border-white/45 px-1 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Start a Conversation
            </a>
          </div>
        </div>
        <div className="dclHero__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full">
          <img
            className="dclHero__image h-full w-full scale-110 object-cover"
            src={HERO_IMAGE}
            alt="Modern architectural facade with strong geometric lines"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,10,13,.55)_0%,transparent_45%)]" />
        </div>
      </div>
    </section>
  );
}
