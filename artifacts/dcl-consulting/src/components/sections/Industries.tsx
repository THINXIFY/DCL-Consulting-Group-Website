import { useEffect, useRef, useState } from 'react';
import { industries, industriesImage } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Industries() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const active = industries[activeIndex];

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclIndustries__heading',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );

      if (isDesktop) {
        gsap.fromTo(
          '.dclIndustries__frame',
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.dclIndustries__frame', start: 'top 80%' },
          },
        );
      }

      gsap.fromTo(
        '.dclIndustries__item',
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 65%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section
      id="industries"
      ref={rootRef}
      aria-labelledby="industries-title"
      className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-industries-eyebrow" className="dclHome__eyebrow dclIndustries__heading mb-5 text-[#8bbfe8]">
          Industries we assess
        </p>
        <h2 id="industries-title" className="dclHome__display dclIndustries__heading max-w-[760px] text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[.92] tracking-[-.04em]">
          Insight across <em className="text-[#c6e3fa] not-italic">every sector.</em>
        </h2>
        <p className="dclIndustries__heading mt-6 max-w-[520px] text-[16px] leading-7 text-white/58">
          We evaluate opportunities on their own fundamentals, not a fixed sector template, so our perspective travels wherever the work takes us.
        </p>

        <div className="mt-16 grid gap-14 border-t border-white/20 pt-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          {isDesktop && (
            <div data-testid="image-industry-sticky" className="lg:sticky lg:top-24 lg:self-start">
              <div className="dclIndustries__frame relative aspect-square w-full overflow-hidden">
                <img
                  src={industriesImage.src}
                  alt={industriesImage.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[#080a0d]/15" />
              </div>
              <div className="mt-6 flex items-start gap-4 border-t border-white/15 pt-6">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8bbfe8]" />
                <div>
                  <p className="text-[15px] font-medium text-white">{active.name}</p>
                  <p data-testid="text-industry-context" className="mt-2 max-w-[360px] text-[14px] leading-6 text-white/55">
                    {active.context}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="sm:columns-2 sm:gap-x-14">
            {industries.map((item, index) => {
              const isActive = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={item.name}
                  data-testid={`item-industry-${slug(item.name)}`}
                  data-active={isActive}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="dclIndustries__item group flex items-center gap-4 break-inside-avoid border-b border-white/20 py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-[#8bbfe8] transition-transform duration-300"
                    style={{ transform: isActive ? 'scale(1.3)' : 'scale(1)', opacity: isActive ? 1 : 0.4 }}
                  />
                  <div className="transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0.5 }}>
                    <span className="text-[17px] font-medium sm:text-[19px]">{item.name}</span>
                    {!isDesktop && <p className="mt-2 text-[14px] leading-5 text-white/50">{item.context}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
