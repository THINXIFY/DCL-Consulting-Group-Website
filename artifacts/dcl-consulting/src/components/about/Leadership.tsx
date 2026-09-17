import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { leadership } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Leadership() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclLeadership__revealLine', '.dclLeadership__fadeUp', '.dclLeadership__member'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });
      tl.fromTo('.dclLeadership__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclLeadership__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5');

      gsap.fromTo(
        '.dclLeadership__member',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclLeadership__members', start: 'top 85%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="leadership" ref={rootRef} aria-labelledby="leadership-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p data-testid="text-leadership-eyebrow" className="dclHome__eyebrow dclLeadership__revealLine mb-6 overflow-hidden text-[#8bbfe8]">
              {leadership.eyebrow}
            </p>
            <h2 id="leadership-title" className="dclHome__display max-w-[560px] text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.035em]">
              <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">{leadership.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">{leadership.headlineLines[1]}</span></span>
            </h2>
          </div>
          <p className="dclLeadership__fadeUp max-w-[380px] text-[16px] leading-7 text-white/55 lg:col-span-5">{leadership.intro}</p>
        </div>

        <div className="dclLeadership__members mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/12 pt-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-10">
          {leadership.members.map((member) => (
            <div key={member.name} data-testid={`leadership-member-${member.name.toLowerCase().replaceAll(' ', '-')}`} className="dclLeadership__member">
              <p className="dclHome__display text-[2.4rem] leading-none tracking-[-.02em] text-[#8bbfe8]">{member.initials}</p>
              <div className="mt-4 h-px w-8 bg-white/20" />
              <p className="mt-4 text-[16px] leading-[1.3] text-white">{member.name}</p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[.13em] text-white/45">{member.role}</p>
            </div>
          ))}
        </div>

        <Link
          href={leadership.cta.href}
          data-testid="link-leadership-meet-team"
          className="dclLeadership__fadeUp group mt-14 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] lg:mt-16"
        >
          {leadership.cta.label}
          <ArrowRight size={14} strokeWidth={1.4} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
        </Link>
      </div>
    </section>
  );
}
