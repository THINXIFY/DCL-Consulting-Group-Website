import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { serviceDirectory } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(text: string) {
  return text.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclServices__rule', '.dclServices__fadeUp', '.dclServices__col'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclServices__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      );

      gsap.fromTo(
        '.dclServices__fadeUp',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      );

      gsap.fromTo(
        '.dclServices__col',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclServices__grid', start: 'top 78%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="services" ref={rootRef} aria-labelledby="services-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 lg:grid-cols-[.86fr_2.14fr] lg:gap-16">
          <div>
            <p data-testid="text-services-eyebrow" className="dclHome__eyebrow dclServices__fadeUp mb-5 text-[#4f718c]">
              Our services
            </p>
            <h2 id="services-title" className="dclHome__display dclServices__fadeUp max-w-[360px] text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[.96] tracking-[-.04em] text-[#080a0d]">
              Expertise for what's next.
            </h2>
            <div className="dclServices__rule mt-8 h-px w-16 bg-[#4f718c]" />
            <p className="dclServices__fadeUp mt-8 max-w-[320px] text-[15px] leading-6 text-[#4b545c]">
              Independent advisory perspective across investment, real assets, corporate strategy and complex decision-making.
            </p>
            <a
              href="/services"
              data-testid="link-services-explore-all"
              className="dclServices__fadeUp group mt-10 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors hover:text-[#4f718c]"
            >
              Explore All Services
              <ArrowUpRight size={14} strokeWidth={1.3} className="text-[#4f718c] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </a>
          </div>

          <div className="dclServices__grid grid grid-cols-2 gap-x-8 gap-y-14 border-t border-[#080a0d]/12 pt-10 lg:grid-cols-4">
            {serviceDirectory.families.map((family) => (
              <div key={family.heading} className="dclServices__col">
                <h3 className="dclHome__display text-[1.35rem] leading-tight tracking-[-.02em] text-[#080a0d]">{family.heading}</h3>
                <p className="mt-2 text-[12px] italic leading-5 text-[#8497a3]">{family.line}</p>
                <ul className="mt-6 border-t border-[#080a0d]/12">
                  {family.services.map((service) => (
                    <li key={service.href} className="border-b border-[#080a0d]/12">
                      <a
                        href={service.href}
                        data-testid={`link-service-${slug(service.label)}`}
                        className="group flex items-center justify-between gap-2 py-3.5 text-[14px] leading-5 text-[#35404a] transition-colors hover:text-[#080a0d]"
                      >
                        {service.label}
                        <ArrowUpRight
                          size={13}
                          strokeWidth={1.3}
                          className="shrink-0 text-[#8bbfe8] opacity-0 transition-all duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
