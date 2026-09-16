import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { whereExpertiseApplies } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FadeInImage } from '@/components/ui/fade-in-image';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function WhereExpertiseApplies() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApplies__revealLine', '.dclApplies__fadeUp', '.dclApplies__tile'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclApplies__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclApplies__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclApplies__tile',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclApplies__grid', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="where-expertise-applies" ref={rootRef} aria-labelledby="applies-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[520px]">
            <p className="dclHome__eyebrow dclApplies__fadeUp text-[#6b737a]">{whereExpertiseApplies.label}</p>
            <h2 id="applies-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclApplies__revealLine block">{whereExpertiseApplies.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclApplies__revealLine block">{whereExpertiseApplies.headlineLines[1]}</span></span>
            </h2>
            <p className="dclApplies__fadeUp mt-5 max-w-[460px] text-[16px] leading-7 text-[#35404a]">{whereExpertiseApplies.copy}</p>
          </div>
          <Link
            href={whereExpertiseApplies.link.href}
            data-testid="link-applies-view-all"
            className="dclApplies__fadeUp group inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
          >
            {whereExpertiseApplies.link.label}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &#8594;
            </span>
          </Link>
        </div>

        <div className="dclApplies__grid mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {whereExpertiseApplies.areas.map((area) => (
            <Link
              key={area.title}
              href={area.href}
              data-testid={`applies-tile-${slug(area.title)}`}
              className="dclApplies__tile group block outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <FadeInImage
                  data-testid={`img-applies-${slug(area.title)}`}
                  className="h-full w-full scale-100 object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  src={area.image.src}
                  alt={area.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="dclHome__display text-[1.15rem] leading-[1.15] text-[#080a0d]">{area.title}</p>
                  <p className="mt-1.5 max-w-[30ch] text-[14px] leading-5 text-[#6b737a]">{area.description}</p>
                </div>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.3}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[#8bbfe8] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
