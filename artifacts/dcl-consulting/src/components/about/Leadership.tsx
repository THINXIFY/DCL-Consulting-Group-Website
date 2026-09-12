import { useEffect, useRef } from 'react';
import { leadershipApproach, leadershipFacts, leadershipImage } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase();
}

const ROW_ALIGN = [
  'lg:max-w-[720px]',
  'lg:max-w-[600px] lg:ml-[12%]',
  'lg:max-w-none',
];

export function Leadership() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclLeadership__revealLine', '.dclLeadership__fadeUp', '.dclLeadership__rule', '.dclLeadership__principle', '.dclLeadership__imageWrap'],
          { clearProps: 'all' },
        );
        return;
      }

      gsap.fromTo(
        '.dclLeadership__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );

      gsap.fromTo(
        '.dclLeadership__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );

      gsap.fromTo(
        '.dclLeadership__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: '.dclLeadership__body', start: 'top 78%' } },
      );

      gsap.fromTo(
        '.dclLeadership__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclLeadership__imageWrap', start: 'top 85%' } },
      );
      gsap.to('.dclLeadership__image', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: '.dclLeadership__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclLeadership__principle',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out', scrollTrigger: { trigger: '.dclLeadership__principles', start: 'top 82%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="leadership" ref={rootRef} aria-labelledby="leadership-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-leadership-eyebrow" className="dclHome__eyebrow dclLeadership__revealLine mb-7 overflow-hidden text-[#6b737a]">
          Leadership
        </p>

        <h2 id="leadership-title" className="dclHome__display max-w-[640px] text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.035em] text-[#080a0d]">
          <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">Leadership grounded</span></span>
          <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">in considered judgement.</span></span>
        </h2>

        {/* Name is the major typographic anchor; role sits precisely alongside it, not stacked below as a caption. */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[#080a0d]/15 pt-10 lg:flex-row lg:items-baseline lg:justify-between lg:gap-10">
          <p
            data-testid="text-leadership-name"
            className="dclLeadership__revealLine overflow-hidden text-[clamp(2.6rem,5.4vw,4.6rem)] font-medium leading-[.96] tracking-[-.03em] text-[#080a0d]"
            style={{ fontFamily: 'var(--app-font-sans)' }}
          >
            David Christopher Lebond
          </p>
          <p data-testid="text-leadership-role" className="dclLeadership__fadeUp shrink-0 text-[11px] font-semibold uppercase tracking-[.15em] text-[#6b737a] lg:text-right">
            Director
            <br /> DCL Consulting and Investments Limited
          </p>
        </div>

        <div className="dclLeadership__body mt-16 grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <p className="dclLeadership__fadeUp text-[19px] leading-8 text-[#171714]">
              DCL Consulting and Investments Limited is led by David Christopher Lebond.
            </p>
            <p className="dclLeadership__fadeUp mt-6 max-w-[440px] text-[16px] leading-7 text-[#35404a]">
              The company's approach centres on disciplined analysis, commercial understanding and clear decision support, bringing a considered perspective to investment and strategic questions.
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <div className="dclLeadership__fadeUp flex flex-col gap-6 border-l border-[#080a0d]/12 pl-6">
              {leadershipFacts.map((fact) => (
                <div key={fact.label} data-testid={`leadership-fact-${slug(fact.label)}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#8a939b]">{fact.label}</p>
                  <p className="mt-1 text-[15px] leading-6 text-[#080a0d]">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <div className="dclLeadership__imageWrap aspect-[3/4] w-full overflow-hidden bg-[#171714] lg:mt-3">
              <img
                data-testid="img-leadership-context"
                className="dclLeadership__image h-full w-full scale-110 object-cover opacity-90"
                src={leadershipImage}
                alt="Contemporary architectural facade used as contextual imagery for the leadership section"
              />
            </div>
          </div>
        </div>

        {/* Deliberately unequal widths and alignment, not a three-column feature triptych. */}
        <div className="dclLeadership__principles mt-24 border-t border-[#080a0d]/15 pt-12 lg:mt-32">
          {leadershipApproach.map((item, index) => (
            <div
              key={item.title}
              data-testid={`leadership-principle-${index}`}
              className={`dclLeadership__principle border-b border-[#080a0d]/12 py-9 ${ROW_ALIGN[index] ?? ''}`}
            >
              <div className="dclLeadership__rule h-px w-10 bg-[#8bbfe8]" />
              <p className="dclHome__display mt-5 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-snug text-[#080a0d]">{item.title}</p>
              <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-[#35404a]">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
