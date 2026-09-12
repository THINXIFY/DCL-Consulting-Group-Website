import { useEffect, useRef, useState } from 'react';
import { whoWeAdvise } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const TINTS = ['#f2f4f6', '#eff3f7', '#edf1f6'];

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhoWeAdvise() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, whoWeAdvise.length);
          if (next !== activeIndexRef.current) {
            activeIndexRef.current = next;
            setActiveIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclAdvise__fadeUp',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="who-we-advise"
      ref={rootRef}
      aria-labelledby="advise-title"
      className="px-6 py-24 transition-colors duration-700 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
      style={{ backgroundColor: isDesktop ? TINTS[activeIndex] : TINTS[0] }}
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
        <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
          <p data-testid="text-advise-eyebrow" className="dclHome__eyebrow dclAdvise__fadeUp mb-5 text-[#6b737a]">
            Who we advise
          </p>
          <h2 id="advise-title" className="dclHome__display dclAdvise__fadeUp max-w-[480px] text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
            Perspective for decisions that carry weight.
          </h2>
          <p className="dclAdvise__fadeUp mt-8 max-w-[380px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
            DCL works with investors and businesses seeking a clearer understanding of important opportunities, risks and strategic choices before significant decisions are made.
          </p>
        </div>
        <div ref={listRef} className="border-t border-[#080a0d]/15">
          {whoWeAdvise.map((item, index) => {
            const active = isDesktop ? activeIndex === index : true;
            return (
              <div
                key={item.title}
                data-testid={`audience-${slug(item.title)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setActiveIndex(index)}
                onFocus={() => isDesktop && setActiveIndex(index)}
                className="dclAdvise__fadeUp relative overflow-hidden border-b border-[#080a0d]/15 py-10 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] sm:py-14"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif text-[16vw] uppercase leading-none text-[#080a0d] transition-opacity duration-700 lg:text-[9vw]"
                  style={{ opacity: active ? 0.045 : 0 }}
                >
                  {item.title}
                </span>
                <div className="relative transition-opacity duration-500" style={{ opacity: active ? 1 : 0.5 }}>
                  <h3 className="dclHome__display text-[clamp(1.9rem,3.2vw,3rem)] leading-[.95] tracking-[-.03em] text-[#080a0d]">{item.title}</h3>
                  <span
                    className="mt-4 block h-px bg-[#8bbfe8] transition-transform duration-500"
                    style={{ width: '64px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                  />
                  <p className="mt-5 max-w-[440px] text-[15px] leading-6 text-[#35404a] sm:text-[16px]">{item.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
