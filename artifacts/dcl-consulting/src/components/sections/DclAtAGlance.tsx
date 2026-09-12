import { useEffect, useRef } from 'react';
import { companyFacts } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function DclAtAGlance() {
  const rootRef = useRef<HTMLElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclGlance__revealLine', '.dclGlance__fadeUp', '.dclGlance__rule', '.dclGlance__rowRule', '.dclGlance__value'], { clearProps: 'all' });
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
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('.dclGlance__row').forEach((row) => {
        const rule = row.querySelector('.dclGlance__rowRule');
        const value = row.querySelector('.dclGlance__value');
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left center', duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 88%' } },
        );
        gsap.fromTo(
          value,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 88%' } },
        );
      });

      if (isDesktop && ledgerRef.current && spineRef.current) {
        ScrollTrigger.create({
          trigger: ledgerRef.current,
          start: 'top 75%',
          end: 'bottom 75%',
          scrub: true,
          onUpdate: (self) => {
            if (spineRef.current) spineRef.current.style.transform = `scaleY(${self.progress})`;
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section
      id="dcl-at-a-glance"
      ref={rootRef}
      aria-labelledby="glance-title"
      className="relative overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 select-none whitespace-nowrap font-serif text-[34vw] leading-none text-[#080a0d]/[0.025] lg:-right-10 lg:top-0 lg:text-[18vw]"
      >
        DCL
      </span>

      <div className="relative mx-auto max-w-[1280px]">
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

        <div className="dclGlance__rule mt-16 h-px w-full bg-[#8bbfe8]" />
        <div ref={ledgerRef} className="relative mt-2 lg:pl-12">
          {isDesktop && (
            <div className="absolute left-0 top-0 h-full w-px bg-[#080a0d]/8">
              <div ref={spineRef} className="h-full w-full origin-top bg-[#8bbfe8]" style={{ transform: 'scaleY(0)' }} />
            </div>
          )}
          {companyFacts.map((fact) => (
            <div key={fact.label} data-testid={`fact-${slug(fact.label)}`} className="dclGlance__row relative py-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="dclHome__eyebrow text-[#8a939b]">{fact.label}</span>
                <span className="dclGlance__value dclHome__display text-[1.4rem] leading-tight text-[#080a0d] sm:text-[1.7rem]">{fact.value}</span>
              </div>
              <span className="dclGlance__rowRule absolute inset-x-0 bottom-0 h-px origin-left bg-[#080a0d]/14" style={{ transform: 'scaleX(0)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
