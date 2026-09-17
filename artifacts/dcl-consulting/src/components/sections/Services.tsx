import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { servicesSection } from '@/data/home-content';
import { serviceDirectory } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';

const PLACEHOLDER_ICON_SRC = '/images/icons/service-placeholder.svg';

function slug(text: string) {
  return text.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclServices__bg', '.dclServices__eyebrowRule', '.dclServices__revealLine', '.dclServices__fadeUp', '.dclServices__colsRule', '.dclServices__col', '.dclServices__row'],
          { clearProps: 'all' },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.dclServices__bg', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });

        tl.fromTo('.dclServices__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
          .fromTo('.dclServices__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
          .fromTo('.dclServices__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.35')
          .fromTo('.dclServices__fadeUp--body', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5')
          .fromTo('.dclServices__fadeUp--cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.35')
          .fromTo('.dclServices__colsRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1 }, '-=0.5');

        gsap.utils.toArray<HTMLElement>('.dclServices__col').forEach((col, i) => {
          const icon = col.querySelector('.service-icon');
          const rows = col.querySelectorAll('.dclServices__row');
          gsap.fromTo(icon, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.09, scrollTrigger: { trigger: col, start: 'top 85%' } });
          gsap.fromTo(
            col.querySelectorAll('.dclServices__colHeading, .dclServices__colLine'),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: i * 0.09 + 0.1, scrollTrigger: { trigger: col, start: 'top 85%' } },
          );
          gsap.fromTo(
            rows,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: i * 0.09 + 0.25, scrollTrigger: { trigger: col, start: 'top 85%' } },
          );
        });

        gsap.fromTo(
          '.dclServices__fadeUp--sideMicro, .dclServices__fadeUp--bottomMicro',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'bottom 90%' } },
        );

        gsap.to(bgRef.current, {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={rootRef} aria-labelledby="services-title" className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
      <div
        ref={bgRef}
        className="dclServices__bg absolute inset-0 bg-no-repeat"
        style={{ backgroundImage: `url(${servicesSection.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center bottom' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/85 to-white/55" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1520px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.9fr_2.2fr] lg:gap-16">
          <div className="flex flex-col lg:sticky lg:top-[140px] lg:h-fit lg:self-start">
            <div className="flex items-center gap-3">
              <span className="dclServices__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
              <p data-testid="text-services-eyebrow" className="dclHome__eyebrow dclServices__fadeUp dclServices__fadeUp--eyebrow text-[#6b737a]">
                {servicesSection.eyebrow}
              </p>
            </div>
            <h2 id="services-title" data-testid="text-services-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.03em] text-[#080a0d]">
              {servicesSection.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclServices__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="dclServices__fadeUp dclServices__fadeUp--body mt-6 max-w-[340px] text-[16px] leading-7 text-[#4b545c]">{servicesSection.supporting}</p>
            <a
              href={servicesSection.cta.href}
              data-testid="link-services-explore-all"
              className="dclServices__fadeUp dclServices__fadeUp--cta group mt-8 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#4f718c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              <span className="relative">
                {servicesSection.cta.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[#8bbfe8]" />
              </span>
              <ArrowRight size={14} strokeWidth={1.4} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
            </a>

            <div className="dclServices__fadeUp dclServices__fadeUp--sideMicro mt-14 flex items-stretch gap-4">
              <span className="h-14 w-px shrink-0 bg-[#8bbfe8]" />
              <div className="flex flex-col gap-1">
                {servicesSection.sideMicroLines.map((line) => (
                  <span key={line} className="text-[10px] font-semibold uppercase leading-[1.7] tracking-[.15em] text-[#6b737a]">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="hidden text-right text-[10px] font-semibold uppercase leading-[1.6] tracking-[.15em] text-[#9ca3aa] sm:block">{servicesSection.microLabel}</p>
            <div className="dclServices__colsRule mt-3 grid grid-cols-1 gap-x-10 gap-y-12 border-t border-[#080a0d]/12 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {serviceDirectory.families.map((family, index) => (
                <div key={family.heading} data-testid={`services-family-${slug(family.heading)}`} className="dclServices__col group/col relative">
                  {index > 0 && <div className="absolute -left-5 top-0 hidden h-full w-px bg-[#080a0d]/12 lg:block" aria-hidden="true" />}
                  <div className="service-icon flex h-20 w-20 items-center justify-center border border-[#080a0d]/15 bg-white/70 transition-colors duration-300 group-hover/col:border-[#8bbfe8] group-hover/col:bg-[#c6e3fa]/20">
                    <img
                      src={servicesSection.familyIcons[family.heading] ?? PLACEHOLDER_ICON_SRC}
                      alt=""
                      aria-hidden="true"
                      className="h-9 w-9 object-contain transition-transform duration-300 group-hover/col:scale-105"
                    />
                  </div>
                  <h3 className="dclServices__colHeading dclHome__display mt-5 text-[1.3rem] leading-[1.15] tracking-[-.015em] text-[#171714]">{family.heading}</h3>
                  <p className="dclServices__colLine mt-2 text-[13px] italic leading-5 text-[#8497a3]">{family.line}</p>

                  <div className="mt-6 border-t border-[#080a0d]/10">
                    {family.services.map((service) => (
                      <a
                        key={service.href}
                        href={service.href}
                        data-testid={`link-service-${slug(service.label)}`}
                        className="dclServices__row group/row flex items-center justify-between gap-2 border-b border-[#080a0d]/10 py-3 text-[14px] leading-5 text-[#35404a] outline-none transition-colors duration-300 hover:bg-[#8bbfe8]/5 hover:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8bbfe8]"
                      >
                        <span className="inline-block transition-transform duration-300 group-hover/row:translate-x-1">{service.label}</span>
                        <ArrowRight
                          size={13}
                          strokeWidth={1.4}
                          className="shrink-0 text-[#8bbfe8] transition-transform duration-300 group-hover/row:translate-x-1"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="dclServices__fadeUp dclServices__fadeUp--bottomMicro mt-12 flex items-center justify-end gap-3 text-right text-[10px] font-semibold uppercase leading-[1.6] tracking-[.15em] text-[#6b737a]">
          <span className="h-px w-6 bg-[#8bbfe8]" />
          {servicesSection.bottomMicroLines[0]} {servicesSection.bottomMicroLines[1]}
        </p>
      </div>
    </section>
  );
}
