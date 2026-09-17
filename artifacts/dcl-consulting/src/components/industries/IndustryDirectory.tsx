import { useEffect, useRef } from 'react';
import { FadeInImage } from '@/components/ui/fade-in-image';
import { industryDirectory, type Sector } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

function FeaturedSector({ sector }: { sector: Sector }) {
  return (
    <article data-testid={`sector-featured-${slug(sector.name)}`} className="dclIndustryDirectory__tile group">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
        <FadeInImage
          data-testid={`img-sector-${slug(sector.name)}`}
          className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          src={sector.image?.src}
          alt={sector.image?.alt ?? ''}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h3 className="dclHome__display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.12] tracking-[-.015em] text-[#080a0d]">{sector.name}</h3>
          <p className="mt-3 max-w-[46ch] text-[16px] leading-[1.6] text-[#6b737a]">{sector.description}</p>
        </div>
        <span aria-hidden="true" className="mt-2 shrink-0 text-[15px] text-[#8497a3] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#4f718c]">
          &#8594;
        </span>
      </div>
    </article>
  );
}

function MediumSector({ sector }: { sector: Sector }) {
  return (
    <article data-testid={`sector-featured-${slug(sector.name)}`} className="dclIndustryDirectory__tile group flex-1">
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <FadeInImage
          data-testid={`img-sector-${slug(sector.name)}`}
          className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          src={sector.image?.src}
          alt={sector.image?.alt ?? ''}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="dclHome__display text-[clamp(1.25rem,1.8vw,1.55rem)] leading-[1.15] tracking-[-.01em] text-[#080a0d]">{sector.name}</h3>
          <p className="mt-2 max-w-[38ch] text-[15px] leading-[1.55] text-[#6b737a]">{sector.description}</p>
        </div>
        <span aria-hidden="true" className="mt-1.5 shrink-0 text-[14px] text-[#8497a3] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#4f718c]">
          &#8594;
        </span>
      </div>
    </article>
  );
}

function CompactImageSector({ sector }: { sector: Sector }) {
  return (
    <article data-testid={`sector-compact-${slug(sector.name)}`} className="dclIndustryDirectory__tile group">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <FadeInImage
          data-testid={`img-sector-${slug(sector.name)}`}
          className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          src={sector.image?.src}
          alt={sector.image?.alt ?? ''}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="dclHome__display text-[1.1rem] leading-[1.2] tracking-[-.005em] text-[#080a0d]">{sector.name}</h3>
          <p className="mt-1.5 max-w-[32ch] text-[14px] leading-[1.5] text-[#6b737a]">{sector.description}</p>
        </div>
        <span aria-hidden="true" className="mt-1 shrink-0 text-[13px] text-[#8497a3] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#4f718c]">
          &#8594;
        </span>
      </div>
    </article>
  );
}

function TextRowSector({ sector }: { sector: Sector }) {
  return (
    <div
      data-testid={`sector-text-${slug(sector.name)}`}
      tabIndex={0}
      className="dclIndustryDirectory__row group grid grid-cols-1 gap-2 border-b border-[#080a0d]/12 py-7 outline-none transition-colors duration-300 hover:border-[#8bbfe8] focus-visible:border-[#8bbfe8] sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
    >
      <div className="transition-transform duration-300 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
        <p className="dclHome__display text-[1.15rem] leading-[1.2] tracking-[-.01em] text-[#080a0d]">{sector.name}</p>
        <p className="mt-1.5 max-w-[52ch] text-[15px] leading-[1.55] text-[#6b737a]">{sector.description}</p>
      </div>
      <span
        aria-hidden="true"
        className="text-[15px] text-[#8497a3] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#4f718c] group-focus-visible:translate-x-1 group-focus-visible:text-[#4f718c]"
      >
        &#8594;
      </span>
    </div>
  );
}

export function IndustryDirectory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclIndustryDirectory__tile', '.dclIndustryDirectory__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclIndustryDirectory__tile',
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclIndustryDirectory__row',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclIndustryDirectory__rows', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="industry-directory" ref={rootRef} aria-label="Industry directory" className="bg-[#f2f4f6] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <FeaturedSector sector={industryDirectory.featured} />
          </div>
          <div className="flex flex-col gap-10 lg:col-span-5">
            {industryDirectory.medium.map((sector) => (
              <MediumSector key={sector.name} sector={sector} />
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-[#080a0d]/10 pt-14 sm:grid-cols-3 lg:mt-16 lg:pt-16">
          {industryDirectory.compactImage.map((sector) => (
            <CompactImageSector key={sector.name} sector={sector} />
          ))}
        </div>

        <div className="dclIndustryDirectory__rows mt-14 lg:mt-16">
          {industryDirectory.textRows.map((sector) => (
            <TextRowSector key={sector.name} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  );
}
