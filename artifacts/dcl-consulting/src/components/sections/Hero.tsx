import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroLuxuryParticles } from './HeroLuxuryParticles';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

const HERO_VIDEO = '/video/dcl-hero-background.mp4';
const HERO_POSTER = '/images/home/home-hero-architecture.webp';

const MICRO_INFO = ['Independent Perspective', 'Strategic Analysis', 'Long-Term Thinking'];

// Strong on the left where the text sits, fading out toward the right so
// the video (people, office interior, DCL branding) stays visible.
const HORIZONTAL_OVERLAY =
  'linear-gradient(90deg, rgba(8,10,13,.93) 0%, rgba(8,10,13,.80) 38%, rgba(8,10,13,.56) 68%, rgba(8,10,13,.34) 100%)';
const VERTICAL_OVERLAY = 'linear-gradient(180deg, rgba(8,10,13,.20) 0%, transparent 30%, transparent 70%, rgba(8,10,13,.48) 100%)';
const RADIAL_ACCENT = 'radial-gradient(circle at 25% 45%, rgba(139,191,232,.07), transparent 42%)';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef<HTMLAnchorElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(startRef, { strength: 0.3 });
  useMagnetic(exploreRef, { strength: 0.25 });

  useEffect(() => {
    if (prefersReducedMotion) videoRef.current?.pause();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHero__reveal', '.dclHero__revealLine', '.dclHero__video', '.dclHero__scrollLine'], { clearProps: 'all' });
        return;
      }

      gsap.set('.dclHero__video', { scale: 1.025 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.dclHero__video', { scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
        .fromTo('.dclHero__reveal--eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
        .fromTo('.dclHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.14, ease: 'power4.out' }, 0.32)
        .fromTo('.dclHero__reveal--sub', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.55')
        .fromTo('.dclHero__reveal--cta', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, '-=0.5')
        .fromTo('.dclHero__reveal--detail', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.45')
        .fromTo('.dclHero__scrollLine', { scaleY: 0 }, { scaleY: 1, duration: 0.8, transformOrigin: 'top' }, '-=0.3')
        .fromTo('.dclHero__reveal--scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.5');

      // Extremely slow, barely-perceptible continuous "breathing" once the
      // entrance is done - not scroll-linked, just ambient depth.
      gsap.to('.dclHero__video', { scale: 1.015, duration: 42, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 });
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
        <div className="pointer-events-none absolute inset-0 bg-[#080a0d]/40 lg:hidden" />
        <div className="pointer-events-none absolute inset-0" style={{ background: VERTICAL_OVERLAY }} />
        <div className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: RADIAL_ACCENT }} />
      </div>

      <HeroLuxuryParticles />

      <Header />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:px-16 lg:pb-14 lg:pt-36">
        <div className="lg:w-[58%] lg:max-w-[760px]">
          <p data-testid="text-hero-eyebrow" className="dclHome__eyebrow dclHero__reveal dclHero__reveal--eyebrow text-[#c6e3fa]">
            Independent insight. London and international.
          </p>
          <div className="dclHero__reveal dclHero__reveal--eyebrow mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
          <h1
            id="hero-title"
            data-testid="text-hero-title"
            className="dclHome__display mt-7 text-[clamp(2.625rem,2.5rem+1.7vw,4.875rem)] leading-[.97] tracking-[-.035em]"
          >
            <span className="block overflow-hidden"><span className="dclHero__revealLine block">Clarity</span></span>
            <span className="block overflow-hidden"><span className="dclHero__revealLine block text-[#c6e3fa]">Before Capital.</span></span>
          </h1>
          <p className="dclHero__reveal dclHero__reveal--sub mt-8 max-w-[620px] text-[16px] leading-[1.65] text-white/80 sm:text-[18px] lg:text-[19px]">
            DCL Consulting helps investors evaluate opportunities with greater clarity through disciplined analysis, strategic insight, and independent perspective.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link
              ref={startRef}
              href="/contact"
              data-testid="link-start-conversation-hero"
              className="dclHero__reveal dclHero__reveal--cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] hover:shadow-[0_8px_28px_rgba(139,191,232,.35)] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              Start a Conversation
              <ArrowUpRight
                size={15}
                strokeWidth={1.3}
                className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
              />
            </Link>
            <Link
              ref={exploreRef}
              href="/services"
              data-testid="link-explore-services-hero"
              className="dclHero__reveal dclHero__reveal--cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Explore Our Services
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="dclHero__reveal dclHero__reveal--detail mt-14 h-px w-full max-w-[560px] bg-white/15 lg:mt-16" />
          <div data-testid="text-hero-micro-info" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {MICRO_INFO.map((label, index) => (
              <div key={label} className="dclHero__reveal dclHero__reveal--detail flex items-center gap-6">
                <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/45">{label}</span>
                {index < MICRO_INFO.length - 1 && <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dclHero__reveal dclHero__reveal--scroll pointer-events-none absolute bottom-10 left-6 z-10 hidden items-center gap-3 sm:left-10 lg:left-16 md:flex">
        <span className="dclHero__scrollLine h-10 w-px origin-top bg-white/35" />
        <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/45">Scroll to Explore</span>
      </div>
    </section>
  );
}
