import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { serviceDirectory, serviceDirectoryIntro } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FadeInImage } from '@/components/ui/fade-in-image';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function ServiceDirectory() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclServiceDir__revealLine', '.dclServiceDir__fadeUp', '.dclServiceDir__family'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclServiceDir__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclServiceDir__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclServiceDir__family',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclServiceDir__families', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="service-directory" ref={rootRef} aria-labelledby="service-directory-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <p className="dclHome__eyebrow dclServiceDir__fadeUp text-[#6b737a]">{serviceDirectoryIntro.label}</p>
            <h2 id="service-directory-title" className="dclHome__display mt-5 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclServiceDir__revealLine block">{serviceDirectoryIntro.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclServiceDir__revealLine block">{serviceDirectoryIntro.headlineLines[1]}</span></span>
            </h2>
            <p className="dclServiceDir__fadeUp mt-6 max-w-[640px] text-[17px] leading-7 text-[#35404a]">{serviceDirectoryIntro.supporting}</p>
          </div>
          <div className="lg:col-span-4">
            <div className="border-l-2 border-[#8bbfe8] pl-6">
              {serviceDirectoryIntro.statementLines.map((line) => (
                <p key={line} className="dclServiceDir__fadeUp dclHome__display text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.3] tracking-[-.01em] text-[#080a0d]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="dclServiceDir__families mt-16 grid grid-cols-1 gap-x-10 gap-y-14 border-t border-[#080a0d]/14 pt-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:divide-x lg:divide-[#080a0d]/14 lg:pt-0">
          {serviceDirectory.families.map((family) => (
            <div key={family.heading} data-testid={`service-family-${slug(family.heading)}`} className="dclServiceDir__family lg:pl-9 lg:first:pl-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <FadeInImage
                  data-testid={`img-service-family-${slug(family.heading)}`}
                  className="h-full w-full scale-105 object-cover object-center"
                  src={family.image.src}
                  alt={family.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="dclHome__display mt-6 text-[1.5rem] leading-[1.15] tracking-[-.01em] text-[#080a0d]">{family.heading}</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#6b737a]">{family.line}</p>

              <div className="mt-5 border-t border-[#080a0d]/14">
                {family.services.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    data-testid={`link-service-directory-${slug(service.label)}`}
                    className="group block border-b border-[#080a0d]/14 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-[15px] font-medium text-[#35404a] transition-colors duration-300 group-hover:text-[#080a0d]">{service.label}</span>
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.3}
                        className="shrink-0 text-[#8bbfe8] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                      />
                    </span>
                    <span className="mt-2 block h-px w-0 bg-[#8bbfe8] transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
