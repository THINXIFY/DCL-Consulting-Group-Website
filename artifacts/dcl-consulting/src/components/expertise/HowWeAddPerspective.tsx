import { useEffect, useRef, useState } from 'react';
import { howWeAddPerspective } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface FrameState {
  rotateY: number;
  x: number;
  z: number;
  scaleX: number;
}

// One precision frame reorients per chapter instead of the Hero's plane
// stack - Commercial widens it, Financial tightens it, Risk shifts its
// depth and exposes an edge, Strategic settles it back into alignment.
const FRAME_STATES: FrameState[] = [
  { rotateY: -10, x: -10, z: 0, scaleX: 1.08 },
  { rotateY: -3, x: 0, z: 10, scaleX: 0.9 },
  { rotateY: 14, x: 16, z: -30, scaleX: 1 },
  { rotateY: 0, x: 0, z: 0, scaleX: 1 },
];

function slug(category: string) {
  return category.toLowerCase();
}

export function HowWeAddPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
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
          const next = getActiveIndex(self.progress, howWeAddPerspective.perspectives.length);
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
    if (!isDesktop || prefersReducedMotion || !frameRef.current) return;
    ensureGsapRegistered();
    const target = FRAME_STATES[activeIndex] ?? FRAME_STATES[0]!;
    gsap.to(frameRef.current, { ...target, duration: 0.7, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPerspective__intro', '.dclPerspective__row', '.dclPerspective__closingLine'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclPerspective__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclPerspective__row',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
      gsap.fromTo(
        '.dclPerspective__closingLine',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclPerspective__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="how-we-add-perspective" ref={rootRef} aria-labelledby="perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <h2
              id="perspective-title"
              className="dclHome__display max-w-[380px] text-[clamp(2.2rem,3.6vw,3.1rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]"
            >
              {howWeAddPerspective.headlineLines[0]}
              <br />
              {howWeAddPerspective.headlineLines[1]}
            </h2>
            <p className="dclPerspective__intro mt-6 max-w-[360px] text-[16px] leading-7 text-[#35404a]">{howWeAddPerspective.intro}</p>

            <div className="dclPerspective__intro relative mt-14 hidden h-[190px] w-full max-w-[280px] lg:block lg:[perspective:1400px]">
              <div
                ref={frameRef}
                className="relative h-full w-full border border-[#080a0d]/18 bg-[#f2f4f6]"
                aria-hidden="true"
              >
                <div className="absolute inset-6 border border-[#080a0d]/10" />
                <div className="absolute left-6 top-6 h-px w-10 bg-[#8bbfe8]" />
              </div>
            </div>
          </div>

          <div ref={listRef} className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-[#080a0d]/14">
              {howWeAddPerspective.perspectives.map((item, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={item.category}
                    data-testid={`perspective-row-${slug(item.category)}`}
                    data-active={active}
                    className="dclPerspective__row flex min-h-[46vh] flex-col justify-center border-b border-[#080a0d]/14 px-1 py-10 transition-colors duration-500 lg:min-h-[56vh]"
                    style={{ backgroundColor: active && isDesktop ? '#f7f9fa' : 'transparent' }}
                  >
                    <p
                      className="dclHome__eyebrow transition-colors duration-500"
                      style={{ color: active ? '#4a8fc2' : '#8a939b' }}
                    >
                      {item.category}
                    </p>
                    <p
                      className="dclHome__display mt-4 leading-[1.08] tracking-[-.02em] text-[#080a0d] transition-[font-size] duration-500"
                      style={{ fontSize: active && isDesktop ? 'clamp(2rem,3.4vw,2.9rem)' : 'clamp(1.5rem,2.2vw,1.9rem)' }}
                    >
                      {item.question}
                    </p>
                    <div className="mt-5 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '64px' : '0px' }} />
                    <p
                      className="mt-5 max-w-[56ch] text-[16px] leading-7 text-[#35404a] transition-opacity duration-500 sm:text-[17px]"
                      style={{ opacity: active || !isDesktop ? 1 : 0.55 }}
                    >
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div data-testid="text-perspective-closing" className="dclPerspective__closing mt-24 border-t border-[#080a0d]/15 pt-14 lg:mt-32">
          {howWeAddPerspective.closingLines.map((line) => (
            <p key={line} className="dclPerspective__closingLine dclHome__display max-w-[980px] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.16] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
