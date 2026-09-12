import { useEffect, useRef, useState } from 'react';
import { whyDcl } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhyDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclWhy__row',
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
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-dcl" ref={rootRef} aria-labelledby="why-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-why-eyebrow" className="dclHome__eyebrow mb-5 text-[#8bbfe8]">
          Why DCL
        </p>
        <h2 id="why-title" className="dclHome__display max-w-[620px] text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[.92] tracking-[-.04em]">
          A disciplined way to see <em className="text-[#c6e3fa] not-italic">the decision.</em>
        </h2>
        <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-white/58">
          DCL's approach is designed around clarity, independence and disciplined evaluation, focusing attention on the factors that matter most.
        </p>

        <div className="mt-16 border-t border-white/20" onMouseLeave={() => isDesktop && setActiveIndex(null)}>
          {whyDcl.map((item, index) => {
            const active = isDesktop ? activeIndex === index : true;
            const indent = isDesktop ? index * 28 : 0;
            return (
              <div
                key={item.title}
                data-testid={`quality-${slug(item.title)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setActiveIndex(index)}
                onFocus={() => isDesktop && setActiveIndex(index)}
                onBlur={() => isDesktop && setActiveIndex(null)}
                className="dclWhy__row border-b border-white/20 py-8 outline-none transition-[opacity,margin-left] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                style={{ marginLeft: `${indent}px`, opacity: isDesktop && activeIndex !== null && !active ? 0.5 : 1 }}
              >
                <div className="flex items-baseline gap-5 transition-transform duration-400" style={{ transform: active ? 'translateX(12px)' : 'translateX(0)' }}>
                  <h3 className="dclHome__display text-[clamp(1.8rem,3vw,2.7rem)] leading-none tracking-[-.03em]">{item.title}</h3>
                </div>
                <span
                  className="mt-4 block h-px bg-[#8bbfe8] transition-transform duration-500"
                  style={{ width: '72px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                />
                <p
                  className="overflow-hidden text-[15px] leading-6 text-white/60 transition-all duration-500 sm:text-[16px]"
                  style={{ marginTop: active ? '20px' : '0px', maxHeight: active ? '120px' : '0px', opacity: active ? 1 : 0 }}
                >
                  {item.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
