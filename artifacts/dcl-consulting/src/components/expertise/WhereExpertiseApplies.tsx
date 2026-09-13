import { useEffect, useRef, useState } from 'react';
import { whereExpertiseApplies } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const PLACEHOLDER_IMAGE = 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp';

interface RowLayout {
  width: string;
  indent: string;
  size: string;
}

// An asymmetric editorial rhythm - dominant / medium / wide / narrower /
// medium / large-closing - rather than six equal rows.
const ROW_LAYOUT: RowLayout[] = [
  { width: '100%', indent: '0%', size: 'clamp(2rem,3.4vw,2.9rem)' },
  { width: '78%', indent: '6%', size: 'clamp(1.7rem,2.6vw,2.3rem)' },
  { width: '100%', indent: '0%', size: 'clamp(2rem,3.4vw,2.9rem)' },
  { width: '60%', indent: '14%', size: 'clamp(1.5rem,2.1vw,1.9rem)' },
  { width: '82%', indent: '4%', size: 'clamp(1.7rem,2.6vw,2.3rem)' },
  { width: '100%', indent: '0%', size: 'clamp(2.1rem,3.6vw,3.1rem)' },
];

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function WhereExpertiseApplies() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
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
          const next = getActiveIndex(self.progress, whereExpertiseApplies.contexts.length);
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
    const count = whereExpertiseApplies.contexts.length;
    const y = (activeIndex - (count - 1) / 2) * 5;
    const scale = 1 + activeIndex * 0.006;
    gsap.to(imageRef.current, { y, scale, duration: 0.8, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclApplies__revealLine', '.dclApplies__fadeUp', '.dclApplies__row', '.dclApplies__imageWrap', '.dclApplies__closingLine'], {
          clearProps: 'all',
        });
        return;
      }

      gsap.fromTo(
        '.dclApplies__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclApplies__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclApplies__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclApplies__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclApplies__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
      gsap.fromTo(
        '.dclApplies__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclApplies__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="where-expertise-applies" ref={rootRef} aria-labelledby="applies-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 border-b border-[#080a0d]/14 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[480px]">
            <p data-testid="text-applies-eyebrow" className="dclHome__eyebrow dclApplies__revealLine mb-6 overflow-hidden text-[#6b737a]">
              {whereExpertiseApplies.eyebrow}
            </p>
            <h2 id="applies-title" className="dclHome__display text-[clamp(2.2rem,3.8vw,3.3rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclApplies__revealLine block">{whereExpertiseApplies.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclApplies__revealLine block">{whereExpertiseApplies.headlineLines[1]}</span></span>
            </h2>
          </div>
          <p className="dclApplies__fadeUp max-w-[420px] text-[17px] leading-7 text-[#35404a] lg:text-right">{whereExpertiseApplies.intro}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5 lg:col-start-8 lg:order-2">
            <div className="dclApplies__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:sticky lg:top-28">
              <div ref={imageRef} className="h-full w-full">
                <img
                  data-testid="img-applies"
                  className="h-full w-full scale-105 object-cover object-center"
                  src={PLACEHOLDER_IMAGE}
                  alt="Placeholder institutional image, to be replaced"
                />
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#080a0d]/10" />
            </div>
          </div>

          <div ref={rowsRef} className="lg:col-span-7 lg:col-start-1 lg:order-1">
            <div className="border-t border-[#080a0d]/14">
              {whereExpertiseApplies.contexts.map((context, index) => {
                const active = isDesktop ? activeIndex === index : true;
                const layout = ROW_LAYOUT[index] ?? ROW_LAYOUT[0]!;
                return (
                  <div
                    key={context.title}
                    data-testid={`context-row-${slug(context.title)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclApplies__row cursor-pointer border-b border-[#080a0d]/14 py-8 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-9"
                  >
                    <div style={{ width: isDesktop ? layout.width : '100%', marginLeft: isDesktop ? layout.indent : '0' }}>
                      <p
                        className="dclHome__display leading-[1.06] tracking-[-.02em] transition-[color,transform] duration-400"
                        style={{ fontSize: isDesktop ? layout.size : 'clamp(1.8rem,7vw,2.3rem)', color: active ? '#080a0d' : '#8a939b', transform: active && isDesktop ? 'translateX(6px)' : 'translateX(0)' }}
                      >
                        {context.title}
                      </p>
                      <p className="mt-2 text-[15px] font-medium transition-colors duration-400" style={{ color: active ? '#4a8fc2' : '#8a939b' }}>
                        {context.supportingLine}
                      </p>
                      <div className="mt-4 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '56px' : '0px' }} />
                      <div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out" style={{ maxHeight: active || !isDesktop ? '160px' : '0px', opacity: active || !isDesktop ? 1 : 0 }}>
                        <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{context.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div data-testid="text-applies-closing" className="dclApplies__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {whereExpertiseApplies.closingLines.map((line) => (
            <p key={line} className="dclApplies__closingLine dclHome__display max-w-[820px] text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.18] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
