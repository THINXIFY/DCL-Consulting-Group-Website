import { useEffect, useRef } from 'react';
import { teamLeadership } from '@/data/team-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function TeamLeadership() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclTeamLeadership__eyebrowRule', '.dclTeamLeadership__revealLine', '.dclTeamLeadership__fadeUp', '.dclTeamLeadership__member'],
          { clearProps: 'all' },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });
      tl.fromTo('.dclTeamLeadership__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
        .fromTo('.dclTeamLeadership__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
        .fromTo('.dclTeamLeadership__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.35')
        .fromTo('.dclTeamLeadership__fadeUp--intro', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5');

      gsap.utils.toArray<HTMLElement>('.dclTeamLeadership__member').forEach((member, i) => {
        const rule = member.querySelector('.dclTeamLeadership__memberRule');
        const name = member.querySelector('.dclTeamLeadership__memberName');
        const role = member.querySelector('.dclTeamLeadership__memberRole');
        const description = member.querySelector('.dclTeamLeadership__memberDescription');
        const base = i * 0.09;
        const memberTl = gsap.timeline({ scrollTrigger: { trigger: '.dclTeamLeadership__members', start: 'top 82%' } });
        memberTl
          .fromTo(member, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, base)
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.5, ease: 'power2.out' }, base + 0.15)
          .fromTo(name, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, base + 0.25)
          .fromTo(role, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, base + 0.35)
          .fromTo(description, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, base + 0.45);
      });
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="team-leadership" ref={rootRef} aria-labelledby="team-leadership-title" className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[.85fr_1fr] lg:items-end lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="dclTeamLeadership__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
              <p data-testid="text-team-leadership-eyebrow" className="dclHome__eyebrow dclTeamLeadership__fadeUp dclTeamLeadership__fadeUp--eyebrow text-[#6b737a]">
                {teamLeadership.eyebrow}
              </p>
            </div>
            <h2 id="team-leadership-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.03em] text-[#080a0d]">
              {teamLeadership.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclTeamLeadership__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
          </div>
          <p className="dclTeamLeadership__fadeUp dclTeamLeadership__fadeUp--intro max-w-[420px] text-[16px] leading-7 text-[#4b545c]">{teamLeadership.intro}</p>
        </div>

        <div className="dclTeamLeadership__members mt-16 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-[#080a0d]/12 pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-x-10">
          {teamLeadership.members.map((member) => (
            <div key={member.name} data-testid={`team-leader-${slug(member.name)}`} className="dclTeamLeadership__member group/leader">
              <p className="dclHome__display text-[2.4rem] leading-none tracking-[-.02em] text-[#8bbfe8] transition-colors duration-300 group-hover/leader:text-[#4f718c]">{member.initials}</p>
              <div className="dclTeamLeadership__memberRule mt-4 h-px w-8 origin-left bg-[#080a0d]/15 transition-all duration-300 group-hover/leader:w-12 group-hover/leader:bg-[#8bbfe8]" />
              <p className="dclTeamLeadership__memberName mt-4 text-[16px] leading-[1.3] text-[#080a0d]">{member.name}</p>
              <p className="dclTeamLeadership__memberRole mt-1.5 text-[11px] font-semibold uppercase tracking-[.13em] text-[#6b737a]">{member.role}</p>
              <p className="dclTeamLeadership__memberDescription mt-3 max-w-[320px] text-[16px] leading-6 text-[#4b545c] lg:max-w-[280px] lg:text-[14px] lg:leading-[1.55]">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
