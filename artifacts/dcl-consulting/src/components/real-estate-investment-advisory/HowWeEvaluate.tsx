import { useEffect, useRef, useState } from 'react';
import { howWeEvaluate } from '@/data/real-estate-investment-advisory-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/real-estate-secondary-1.webp';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function HowWeEvaluate() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useEffect(() => {
    if (!rowsRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: rowsRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, howWeEvaluate.rows.length);
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
    if (!isDesktop || prefersReducedMotion || !imageRef.current) return;
    ensureGsapRegistered();
    const count = howWeEvaluate.rows.length;
    const y = (activeIndex - (count - 1) / 2) * 3;
    const scale = 1.04 + activeIndex * 0.006;
    gsap.to(imageRef.current, { y, scale, duration: 0.8, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclEvaluate__revealLine', '.dclEvaluate__fadeUp', '.dclEvaluate__imageWrap', '.dclEvaluate__row'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclEvaluate__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclEvaluate__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclEvaluate__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclEvaluate__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclEvaluate__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="how-we-evaluate" ref={rootRef} aria-labelledby="evaluate-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-3">
            <p className="dclHome__eyebrow dclEvaluate__fadeUp text-[#9ca3aa]">{howWeEvaluate.label}</p>
            <h2 id="evaluate-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.4vw,2.8rem)] leading-[1.08] tracking-[-.02em]">
              <span className="block overflow-hidden"><span className="dclEvaluate__revealLine block">{howWeEvaluate.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclEvaluate__revealLine block">{howWeEvaluate.headlineLines[1]}</span></span>
              <span className="block overflow-hidden"><span className="dclEvaluate__revealLine block">{howWeEvaluate.headlineLines[2]}</span></span>
            </h2>
            <p className="dclEvaluate__fadeUp mt-5 text-[16px] leading-7 text-white/60">{howWeEvaluate.intro}</p>
          </div>

          <div className="lg:col-span-4">
            <div className="dclEvaluate__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:sticky lg:top-28">
              <img
                ref={imageRef}
                data-testid="img-how-we-evaluate"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Low-angle view of a dark curved glass office building with horizontal banding and rooftop greenery"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#080a0d]/20" />
            </div>
          </div>

          <div ref={rowsRef} className="lg:col-span-5">
            <div className="border-t border-white/14">
              {howWeEvaluate.rows.map((row, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={row.name}
                    data-testid={`evaluate-row-${slug(row.name)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclEvaluate__row cursor-pointer border-b border-white/14 py-6 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <p
                      className="text-[13px] font-semibold uppercase tracking-[.1em] transition-colors duration-400"
                      style={{ color: active ? '#8bbfe8' : 'rgba(255,255,255,.4)' }}
                    >
                      {row.name}
                    </p>
                    <div className="mt-3 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '40px' : '16px' }} />
                    <p
                      className="mt-3 max-w-[42ch] text-[16px] leading-6 transition-colors duration-400"
                      style={{ color: active ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.4)' }}
                    >
                      {row.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
