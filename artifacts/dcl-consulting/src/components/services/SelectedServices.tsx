import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { selectedServices } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FadeInImage } from '@/components/ui/fade-in-image';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function SelectedServices() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSelected__revealLine', '.dclSelected__fadeUp', '.dclSelected__tile'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclSelected__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclSelected__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclSelected__tile',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclSelected__tiles', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="selected-services" ref={rootRef} aria-labelledby="selected-services-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="dclHome__eyebrow dclSelected__fadeUp text-[#6b737a]">{selectedServices.label}</p>
            <h2 id="selected-services-title" className="dclHome__display mt-4 text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclSelected__revealLine block">{selectedServices.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclSelected__revealLine block">{selectedServices.headlineLines[1]}</span></span>
            </h2>
            <p className="dclSelected__fadeUp mt-4 max-w-[440px] text-[16px] leading-7 text-[#35404a]">{selectedServices.supporting}</p>
          </div>
          <Link
            href={selectedServices.link.href}
            data-testid="link-selected-services-view-all"
            className="dclSelected__fadeUp group inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
          >
            {selectedServices.link.label}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &#8594;
            </span>
          </Link>
        </div>

        <div className="dclSelected__tiles mt-12 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-3">
          {selectedServices.featured.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`link-selected-service-${slug(item.title)}`}
              className="dclSelected__tile group relative block aspect-[4/5] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] focus-visible:ring-offset-2"
            >
              <FadeInImage
                data-testid={`img-selected-service-${slug(item.title)}`}
                className="h-full w-full scale-100 object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                src={item.image.src}
                alt={item.image.alt}
                loading="lazy"
                decoding="async"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/85 via-[#080a0d]/25 to-transparent transition-opacity duration-500 group-hover:from-[#080a0d]/92" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="dclHome__display text-[1.5rem] leading-[1.15] text-white transition-colors duration-300">{item.title}</p>
                <p className="mt-2 max-w-[26ch] text-[14px] leading-5 text-white/70">{item.supporting}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#c6e3fa]">
                  Learn More
                  <ArrowUpRight size={14} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
