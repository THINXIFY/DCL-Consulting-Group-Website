import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ourIndustries } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FadeInImage } from '@/components/ui/fade-in-image';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function OurIndustries() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclOurIndustries__revealLine', '.dclOurIndustries__fadeUp', '.dclOurIndustries__tile', '.dclOurIndustries__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclOurIndustries__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclOurIndustries__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclOurIndustries__tile',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclOurIndustries__featuredGrid', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclOurIndustries__row',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclOurIndustries__compactGrid', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="our-industries" ref={rootRef} aria-labelledby="our-industries-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <p className="dclHome__eyebrow dclOurIndustries__fadeUp text-[#6b737a]">{ourIndustries.label}</p>
            <h2 id="our-industries-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclOurIndustries__revealLine block">{ourIndustries.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclOurIndustries__revealLine block">{ourIndustries.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="dclOurIndustries__fadeUp max-w-[420px] text-[16px] leading-7 text-[#35404a]">{ourIndustries.supporting}</p>
          </div>
        </div>

        <div className="dclOurIndustries__featuredGrid mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {ourIndustries.featured.map((sector) => (
            <div key={sector.name} data-testid={`sector-featured-${slug(sector.name)}`} className="dclOurIndustries__tile group">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <FadeInImage
                  data-testid={`img-sector-${slug(sector.name)}`}
                  className="h-full w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  src={sector.image?.src}
                  alt={sector.image?.alt ?? ''}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="dclHome__display mt-5 text-[1.25rem] leading-[1.15] text-[#080a0d] transition-transform duration-300 group-hover:translate-x-1">{sector.name}</p>
              <p className="mt-2 max-w-[34ch] text-[15px] leading-6 text-[#6b737a]">{sector.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px w-6 bg-[#8bbfe8] transition-all duration-300 group-hover:w-10" />
                <ArrowUpRight size={14} strokeWidth={1.3} className="text-[#8bbfe8] opacity-0 transition-all duration-300 group-hover:translate-x-[2px] group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="dclOurIndustries__compactGrid mt-16 grid grid-cols-1 divide-y divide-[#080a0d]/12 border-t border-[#080a0d]/12 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 lg:divide-x">
          {ourIndustries.compact.map((sector) => (
            <div
              key={sector.name}
              data-testid={`sector-compact-${slug(sector.name)}`}
              tabIndex={0}
              className="dclOurIndustries__row group cursor-default py-7 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] sm:pr-8 lg:py-8 lg:pl-8 lg:first:pl-0"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="dclHome__display text-[1.05rem] leading-[1.2] text-[#080a0d]">{sector.name}</p>
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.3}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[#8bbfe8] opacity-0 transition-all duration-300 group-hover:translate-x-[2px] group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </div>
              <p className="mt-2 max-w-[32ch] text-[14px] leading-6 text-[#6b737a]">{sector.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
