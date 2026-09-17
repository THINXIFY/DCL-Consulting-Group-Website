import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { teamHero } from '@/data/team-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function TeamHero() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclTeamHero__bg', '.dclTeamHero__eyebrowRule', '.dclTeamHero__revealLine', '.dclTeamHero__fadeUp'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclTeamHero__bg', { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.out' })
        .fromTo('.dclTeamHero__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.6 }, '-=1')
        .fromTo('.dclTeamHero__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.55 }, '<')
        .fromTo('.dclTeamHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.3')
        .fromTo('.dclTeamHero__fadeUp--intro', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5')
        .fromTo('.dclTeamHero__fadeUp--statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06 }, '-=0.35');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="team-hero" ref={rootRef} aria-labelledby="team-hero-title" className="relative overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div
        className="dclTeamHero__bg absolute inset-0 bg-no-repeat"
        style={{ backgroundImage: `url(${teamHero.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080a0d]/95 via-[#080a0d]/55 to-[#080a0d]/25" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-32 sm:px-10 lg:px-16 lg:pb-24 lg:pt-40">
        <div className="flex items-center gap-3">
          <span className="dclTeamHero__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
          <p data-testid="text-team-hero-eyebrow" className="dclHome__eyebrow dclTeamHero__fadeUp dclTeamHero__fadeUp--eyebrow text-[#8bbfe8]">
            {teamHero.eyebrow}
          </p>
        </div>
        <h1 id="team-hero-title" data-testid="text-team-hero-title" className="dclHome__display mt-6 max-w-[640px] text-[clamp(2.6rem,5.2vw,4.4rem)] leading-[1.02] tracking-[-.03em]">
          {teamHero.headlineLines.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span className="dclTeamHero__revealLine block">{line}</span>
            </span>
          ))}
        </h1>
        <p data-testid="text-team-hero-intro" className="dclTeamHero__fadeUp dclTeamHero__fadeUp--intro mt-6 max-w-[520px] text-[17px] leading-[1.65] text-white/70">
          {teamHero.intro}
        </p>

        <div data-testid="text-team-hero-statement" className="dclTeamHero__fadeUp dclTeamHero__fadeUp--statement mt-14 flex items-stretch gap-4">
          <span className="h-14 w-px shrink-0 bg-[#8bbfe8]/40" />
          <div className="flex flex-col gap-1">
            {teamHero.statementLines.map((line) => (
              <span key={line} className="text-[10px] font-semibold uppercase leading-[1.7] tracking-[.16em] text-white/45">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
