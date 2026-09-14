import { useEffect, useRef, useState } from 'react';
import { whatWeLookFor } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

// Alternating indent per band creates the "premium institutional report"
// rhythm the brief asks for - wide, indented, wide, offset right, wide
// emphasis, indented close - rather than a mechanical repeated list.
const BAND_INSET = ['lg:pl-0', 'lg:pl-16', 'lg:pl-0', 'lg:pl-28', 'lg:pl-0', 'lg:pl-20'];
// A quiet architectural datum line nudges a few px per active band -
// never labelled, never a graph, just a subtle shift in emphasis.
const DATUM_OFFSETS = [0, 10, -6, 18, -10, 6];

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function WhatWeLookFor() {
  const rootRef = useRef<HTMLElement>(null);
  const bandsRef = useRef<HTMLDivElement>(null);
  const datumRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useEffect(() => {
    if (!bandsRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: bandsRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, whatWeLookFor.areas.length);
          if (next !== scrollIndexRef.current) {
            scrollIndexRef.current = next;
            setScrollIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!datumRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const offset = DATUM_OFFSETS[activeIndex] ?? 0;
    gsap.to(datumRef.current, { x: offset, duration: 0.8, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFundamentals__revealLine', '.dclFundamentals__fadeUp', '.dclFundamentals__band', '.dclFundamentals__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclFundamentals__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclFundamentals__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclFundamentals__band',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: bandsRef.current, start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclFundamentals__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclFundamentals__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="what-we-look-for" ref={rootRef} aria-labelledby="fundamentals-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[680px]">
          <p className="dclHome__eyebrow dclFundamentals__revealLine text-[#4a8fc2]">{whatWeLookFor.eyebrow}</p>
          <h2 id="fundamentals-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] tracking-[-.035em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclFundamentals__revealLine block">{whatWeLookFor.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclFundamentals__revealLine block">{whatWeLookFor.headlineLines[1]}</span></span>
          </h2>
          <p className="dclFundamentals__fadeUp mt-6 text-[19px] leading-[1.6] text-[#35404a]">{whatWeLookFor.intro}</p>
        </div>

        <div className="relative mt-16 lg:mt-24">
          {isDesktop && (
            <div
              ref={datumRef}
              aria-hidden="true"
              className="absolute -left-6 top-0 hidden h-full w-px bg-[#8bbfe8]/50 lg:block"
            />
          )}
          <div ref={bandsRef} className="flex flex-col">
            {whatWeLookFor.areas.map((area, index) => {
              const active = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={area.name}
                  data-testid={`fundamental-band-${slug(area.name)}`}
                  data-active={active}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => isDesktop && setHoverIndex(index)}
                  onMouseLeave={() => isDesktop && setHoverIndex(null)}
                  onFocus={() => isDesktop && setHoverIndex(index)}
                  onBlur={() => isDesktop && setHoverIndex(null)}
                  className={`dclFundamentals__band cursor-pointer border-t border-[#080a0d]/14 py-9 outline-none transition-colors duration-500 first:border-t-0 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-11 ${BAND_INSET[index] ?? ''}`}
                  style={{ backgroundColor: active && isDesktop ? '#ffffff' : 'transparent' }}
                >
                  <p className="dclHome__eyebrow transition-colors duration-400" style={{ color: active ? '#4a8fc2' : '#8a939b' }}>
                    {area.name}
                  </p>
                  <p
                    className="dclHome__display mt-4 max-w-[640px] leading-[1.12] tracking-[-.02em] transition-colors duration-400"
                    style={{ fontSize: 'clamp(1.6rem,2.6vw,2.3rem)', color: active ? '#080a0d' : '#8a939b' }}
                  >
                    {area.question}
                  </p>
                  <div className="mt-4 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '56px' : '20px' }} />
                  <p className="mt-4 max-w-[54ch] text-[16px] leading-7 transition-colors duration-400 sm:text-[17px]" style={{ color: active ? '#35404a' : '#9aa3ab' }}>
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div data-testid="text-fundamentals-closing" className="dclFundamentals__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {whatWeLookFor.closingLines.map((line) => (
            <p key={line} className="dclFundamentals__closingLine dclHome__display max-w-[900px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
