import { useEffect, useRef } from 'react';
import { leadershipApproach, leadershipFacts, leadershipImage } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase();
}

export function Leadership() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclLeadership__imageWrap', '.dclLeadership__revealLine', '.dclLeadership__fadeUp', '.dclLeadership__rule', '.dclLeadership__principle'],
          { clearProps: 'all' },
        );
        return;
      }

      gsap.fromTo(
        '.dclLeadership__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );

      gsap.to('.dclLeadership__image', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclLeadership__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );

      gsap.fromTo(
        '.dclLeadership__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );

      gsap.fromTo(
        '.dclLeadership__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 55%' } },
      );

      gsap.fromTo(
        '.dclLeadership__principle',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclLeadership__principles', start: 'top 85%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="leadership" ref={rootRef} aria-labelledby="leadership-title" className="bg-white">
      <div className="grid lg:grid-cols-2">
        <div className="dclLeadership__imageWrap relative aspect-[4/3] w-full overflow-hidden bg-[#171714] lg:aspect-auto lg:min-h-[560px]">
          <img
            data-testid="img-leadership-context"
            className="dclLeadership__image h-full w-full scale-110 object-cover opacity-80"
            src={leadershipImage}
            alt="Contemporary architectural interior used as contextual imagery, not a photograph of DCL's leadership"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,10,13,.55)_0%,transparent_55%)]" />
        </div>

        <div className="flex flex-col justify-center px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-0">
          <p data-testid="text-leadership-eyebrow" className="dclHome__eyebrow dclLeadership__revealLine mb-6 overflow-hidden text-[#6b737a]">
            Leadership
          </p>
          <h2 id="leadership-title" className="dclHome__display max-w-[540px] text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.02] tracking-[-.035em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">Leadership grounded</span></span>
            <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">in considered judgement.</span></span>
          </h2>

          <div className="dclLeadership__rule mt-10 h-px w-16 bg-[#8bbfe8]" />

          <p data-testid="text-leadership-name" className="dclLeadership__fadeUp mt-10 text-[1.6rem] font-medium leading-tight text-[#080a0d]" style={{ fontFamily: 'var(--app-font-sans)' }}>
            David Christopher Lebond
          </p>
          <p data-testid="text-leadership-role" className="dclLeadership__fadeUp mt-1 text-[10px] font-semibold uppercase tracking-[.15em] text-[#6b737a] sm:text-[11px]">
            Director, DCL Consulting and Investments Limited
          </p>

          <p className="dclLeadership__fadeUp mt-8 max-w-[460px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
            DCL Consulting and Investments Limited is led by David Christopher Lebond.
          </p>
          <p className="dclLeadership__fadeUp mt-5 max-w-[460px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
            The company's approach centres on disciplined analysis, commercial understanding and clear decision support, bringing a considered perspective to investment and strategic questions.
          </p>

          <div className="dclLeadership__principles mt-14 border-t border-[#080a0d]/12">
            {leadershipApproach.map((item) => (
              <div key={item.title} className="dclLeadership__principle border-b border-[#080a0d]/12 py-6">
                <p className="dclHome__display text-[1.35rem] leading-snug text-[#080a0d]">{item.title}</p>
                <p className="mt-2 max-w-[420px] text-[15px] leading-6 text-[#35404a]">{item.copy}</p>
              </div>
            ))}
          </div>

          <div className="dclLeadership__fadeUp mt-10 flex flex-wrap gap-x-8 gap-y-2">
            {leadershipFacts.map((fact) => (
              <div key={fact.label} data-testid={`leadership-fact-${slug(fact.label)}`} className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#8a939b] sm:text-[11px]">
                {fact.label} <span className="text-[#080a0d]">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
