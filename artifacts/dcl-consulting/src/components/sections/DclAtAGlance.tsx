import { useEffect, useRef } from 'react';
import { companyFacts } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function DclAtAGlance() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclGlance__revealLine', '.dclGlance__fadeUp', '.dclGlance__rule'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclGlance__revealLine',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );

      gsap.fromTo(
        '.dclGlance__fadeUp',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 65%' },
        },
      );

      gsap.fromTo(
        '.dclGlance__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="dcl-at-a-glance" ref={rootRef} aria-labelledby="glance-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1200px]">
        <p data-testid="text-glance-eyebrow" className="dclHome__eyebrow dclGlance__fadeUp mb-6 text-[#6b737a]">
          DCL at a glance
        </p>
        <h2 id="glance-title" className="dclHome__display max-w-[720px] text-[clamp(2.4rem,5vw,4.4rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
          <span className="block overflow-hidden"><span className="dclGlance__revealLine block">Established structure.</span></span>
          <span className="block overflow-hidden"><span className="dclGlance__revealLine block">Independent perspective.</span></span>
        </h2>
        <p className="dclGlance__fadeUp mt-8 max-w-[540px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
          DCL Consulting and Investments Limited is a private limited company registered in England and Wales, providing investment consulting and strategic decision support.
        </p>

        <div className="dclGlance__rule mt-16 h-px w-full bg-[#080a0d]/20" />
        <div className="mt-2">
          {companyFacts.map((fact) => (
            <div
              key={fact.label}
              data-testid={`fact-${slug(fact.label)}`}
              className="dclGlance__fadeUp flex flex-col gap-1 border-b border-[#080a0d]/12 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="dclHome__eyebrow text-[#8a939b]">{fact.label}</span>
              <span className="dclHome__display text-[1.35rem] leading-tight text-[#080a0d] sm:text-[1.6rem]">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
