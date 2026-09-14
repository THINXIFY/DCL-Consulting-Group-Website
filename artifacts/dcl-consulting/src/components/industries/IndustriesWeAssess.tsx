import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { industriesWeAssess } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function IndustriesWeAssess() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSectors__revealLine', '.dclSectors__fadeUp', '.dclSectors__card', '.dclSectors__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclSectors__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclSectors__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclSectors__card',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: gridRef.current, start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclSectors__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclSectors__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="industries-we-assess" ref={rootRef} aria-labelledby="industries-we-assess-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="dclHome__eyebrow dclSectors__revealLine text-[#8bbfe8]">{industriesWeAssess.eyebrow}</p>
        <h2 id="industries-we-assess-title" className="dclHome__display mt-6 max-w-[900px] text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.03] tracking-[-.035em]">
          <span className="block overflow-hidden"><span className="dclSectors__revealLine block">{industriesWeAssess.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclSectors__revealLine block">{industriesWeAssess.headlineLines[1]}</span></span>
        </h2>
        <p className="dclSectors__fadeUp mt-6 max-w-[62ch] text-[16px] leading-7 text-white/60 sm:text-[17px]">{industriesWeAssess.intro}</p>

        <div ref={gridRef} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-7">
          {industriesWeAssess.sectors.map((sector) => (
            <div
              key={sector.name}
              data-testid={`sector-card-${slug(sector.name)}`}
              tabIndex={0}
              className="dclSectors__card group flex flex-col border border-white/14 bg-white/[.03] p-8 outline-none transition-all duration-400 hover:-translate-y-1 hover:border-[#8bbfe8]/50 hover:bg-white/[.05] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="h-px w-8 bg-white/25 transition-colors duration-400 group-hover:bg-[#8bbfe8]" />
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.4}
                  aria-hidden="true"
                  className="shrink-0 text-white/25 transition-all duration-400 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-[#8bbfe8]"
                />
              </div>
              <p className="dclHome__display mt-6 text-[1.4rem] leading-[1.18] text-white">{sector.name}</p>
              <p className="mt-3 text-[13px] font-semibold uppercase tracking-[.08em] text-[#8bbfe8]">{sector.supportingLine}</p>
              <p className="mt-4 max-w-[42ch] text-[16px] leading-7 text-white/65">{sector.description}</p>
            </div>
          ))}
        </div>

        <div data-testid="text-sectors-closing" className="dclSectors__closing mt-20 border-t border-white/12 pt-14 lg:mt-24">
          {industriesWeAssess.closingLines.map((line) => (
            <p key={line} className="dclSectors__closingLine dclHome__display max-w-[820px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] tracking-[-.025em] text-white">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
