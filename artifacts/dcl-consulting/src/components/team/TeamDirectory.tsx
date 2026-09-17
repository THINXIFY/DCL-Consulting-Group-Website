import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { teamDirectory } from '@/data/team-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function TeamDirectory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclTeamDirectory__eyebrowRule', '.dclTeamDirectory__revealLine', '.dclTeamDirectory__fadeUp', '.dclTeamDirectory__row'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });
      tl.fromTo('.dclTeamDirectory__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
        .fromTo('.dclTeamDirectory__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
        .fromTo('.dclTeamDirectory__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.35')
        .fromTo('.dclTeamDirectory__fadeUp--intro', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5');

      gsap.fromTo(
        '.dclTeamDirectory__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.dclTeamDirectory__list', start: 'top 82%' } },
      );

      gsap.fromTo(
        '.dclTeamDirectory__fadeUp--micro',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: '.dclTeamDirectory__list', start: 'bottom 90%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="team-directory" ref={rootRef} aria-labelledby="team-directory-title" className="bg-[#080a0d] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[.85fr_1fr] lg:items-end lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="dclTeamDirectory__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
              <p data-testid="text-team-directory-eyebrow" className="dclHome__eyebrow dclTeamDirectory__fadeUp dclTeamDirectory__fadeUp--eyebrow text-[#8bbfe8]">
                {teamDirectory.eyebrow}
              </p>
            </div>
            <h2 id="team-directory-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.03em]">
              {teamDirectory.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclTeamDirectory__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
          </div>
          <p className="dclTeamDirectory__fadeUp dclTeamDirectory__fadeUp--intro max-w-[420px] text-[16px] leading-7 text-white/55">{teamDirectory.intro}</p>
        </div>

        <div className="dclTeamDirectory__list mt-16 grid grid-cols-1 border-t border-white/12 sm:grid-cols-2 sm:gap-x-12 lg:mt-20">
          {teamDirectory.members.map((member) => (
            <div
              key={member.name}
              data-testid={`team-member-${slug(member.name)}`}
              tabIndex={0}
              className="dclTeamDirectory__row group flex items-center justify-between gap-4 border-b border-white/12 py-6 outline-none transition-colors duration-300 hover:border-[#8bbfe8]/50 focus-visible:border-[#8bbfe8]"
            >
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <p className="dclHome__display text-[1.3rem] leading-[1.15] tracking-[-.015em] text-white">{member.name}</p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[.13em] text-white/45">{member.role}</p>
              </div>
              <ArrowRight size={16} strokeWidth={1.4} className="shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#8bbfe8]" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="dclTeamDirectory__fadeUp dclTeamDirectory__fadeUp--micro mt-12 flex items-stretch gap-4">
          <span className="h-14 w-px shrink-0 bg-[#8bbfe8]/40" />
          <div className="flex flex-col gap-1">
            {teamDirectory.microLines.map((line) => (
              <span key={line} className="text-[10px] font-semibold uppercase leading-[1.7] tracking-[.16em] text-white/40">
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
