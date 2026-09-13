import { useEffect, useRef, useState } from 'react';
import { workingWithDcl } from '@/data/approach-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const OFFSET = ['0%', '9%', '3%', '11%'];

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WorkingWithDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
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
          const next = getActiveIndex(self.progress, workingWithDcl.principles.length);
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
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWorking__revealLine', '.dclWorking__fadeUp', '.dclWorking__row', '.dclWorking__datum', '.dclWorking__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWorking__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWorking__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclWorking__row',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
      if (isDesktop) {
        gsap.fromTo(
          '.dclWorking__datum',
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: rowsRef.current, start: 'top 70%', end: 'bottom 55%', scrub: true } },
        );
      }
      gsap.fromTo(
        '.dclWorking__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclWorking__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="working-with-dcl" ref={rootRef} aria-labelledby="working-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <h2 id="working-title" className="dclHome__display max-w-[400px] text-[clamp(2.2rem,3.8vw,3.3rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWorking__revealLine block">{workingWithDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWorking__revealLine block">{workingWithDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclWorking__fadeUp mt-6 max-w-[360px] text-[16px] leading-7 text-[#35404a]">{workingWithDcl.intro}</p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div ref={rowsRef} className="relative">
              <div className="dclWorking__datum absolute -left-6 top-1 hidden h-full w-px bg-[#8bbfe8] lg:block" aria-hidden="true" />
              {workingWithDcl.principles.map((item, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={item.title}
                    data-testid={`working-row-${slug(item.title)}`}
                    data-active={active}
                    tabIndex={isDesktop ? 0 : undefined}
                    onMouseEnter={() => isDesktop && setHoverIndex(index)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                    onFocus={() => isDesktop && setHoverIndex(index)}
                    onBlur={() => isDesktop && setHoverIndex(null)}
                    className="dclWorking__row relative cursor-pointer border-b border-[#080a0d]/14 py-9 outline-none transition-colors duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ marginLeft: isDesktop ? OFFSET[index] : undefined }}
                  >
                    <div className="h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '48px' : '20px' }} />
                    <p
                      className="dclHome__display mt-4 leading-[1.06] tracking-[-.02em] transition-colors duration-400"
                      style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)', color: active ? '#080a0d' : '#8a939b' }}
                    >
                      {item.title}
                    </p>
                    <p className="mt-3 max-w-[52ch] text-[16px] leading-7 transition-colors duration-400 sm:text-[17px]" style={{ color: active ? '#35404a' : '#9aa3ab' }}>
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div data-testid="text-working-closing" className="dclWorking__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {workingWithDcl.closingLines.map((line) => (
            <p key={line} className="dclWorking__closingLine dclHome__display max-w-[760px] text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.2] tracking-[-.02em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
