import { useEffect, useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

const HERO_VIDEO = '/video/dcl-hero-background.mp4';
const HERO_POSTER = '/images/home/home-hero-architecture.webp';

// Per the approved hero brief: strong on the left where the text sits,
// fading out toward the right so the video (people, office interior,
// DCL branding) stays visible rather than being washed out.
const HORIZONTAL_OVERLAY =
  'linear-gradient(90deg, rgba(8,10,13,.88) 0%, rgba(8,10,13,.68) 42%, rgba(8,10,13,.32) 72%, rgba(8,10,13,.18) 100%)';
const VERTICAL_OVERLAY = 'linear-gradient(180deg, rgba(8,10,13,.5) 0%, transparent 18%, transparent 82%, rgba(8,10,13,.6) 100%)';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);
  const startRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(exploreRef, { strength: 0.3 });
  useMagnetic(startRef, { strength: 0.3 });

  useEffect(() => {
    if (prefersReducedMotion) videoRef.current?.pause();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHero__reveal', '.dclHero__revealLine', '.dclHero__video'], { clearProps: 'all' });
        return;
      }

      gsap.set('.dclHero__video', { scale: 1.02 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.dclHero__video', { scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
        .fromTo('.dclHero__reveal--eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.15)
        .fromTo('.dclHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, 0.3)
        .fromTo('.dclHero__reveal--sub', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.dclHero__reveal--cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.4');
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
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          ref={videoRef}
          data-testid="video-hero-background"
          className="dclHero__video pointer-events-none h-full w-full object-cover object-center"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay={!prefersReducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0" style={{ background: HORIZONTAL_OVERLAY }} />
        {/* Content spans the full width once the layout collapses to one
            column below lg, so the right-faded horizontal overlay above
            would leave text on a too-bright video there - add a uniform
            extra scrim on those breakpoints only. */}
        <div className="pointer-events-none absolute inset-0 bg-[#080a0d]/35 lg:hidden" />
        <div className="pointer-events-none absolute inset-0" style={{ background: VERTICAL_OVERLAY }} />
      </div>

      <Header />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-center px-6 pb-20 pt-28 sm:px-10 lg:px-16">
        <div className="max-w-[680px]">
          <p data-testid="text-hero-eyebrow" className="dclHome__eyebrow dclHero__reveal dclHero__reveal--eyebrow text-[#c6e3fa]">
            Independent insight. London and international.
          </p>
          <div className="dclHero__reveal dclHero__reveal--eyebrow mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1
            id="hero-title"
            data-testid="text-hero-title"
            className="dclHome__display mt-7 text-[clamp(3.2rem,7vw,6.2rem)] leading-[.95] tracking-[-.04em]"
          >
            <span className="block overflow-hidden"><span className="dclHero__revealLine block">Clarity</span></span>
            <span className="block overflow-hidden"><span className="dclHero__revealLine block text-[#c6e3fa]">Before Capital.</span></span>
          </h1>
          <p className="dclHero__reveal dclHero__reveal--sub mt-8 max-w-[480px] text-[16px] leading-7 text-white/70 sm:text-[18px]">
            DCL Consulting helps investors evaluate opportunities with greater clarity through disciplined analysis, strategic insight, and independent perspective.
          </p>
          <div className="mt-9 flex flex-wrap gap-5">
            <a
              ref={exploreRef}
              href="#expertise"
              data-testid="link-explore-expertise"
              className="dclHero__reveal dclHero__reveal--cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] hover:shadow-[0_8px_28px_rgba(139,191,232,.4)] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              Explore Our Expertise
              <ArrowDownRight
                size={15}
                strokeWidth={1.3}
                className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
              />
            </a>
            <a
              ref={startRef}
              href="#about"
              data-testid="link-start-conversation-hero"
              className="dclHero__reveal dclHero__reveal--cta inline-flex items-center border-b border-white/45 px-1 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Start a Conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
