import { useEffect, useRef, useState } from 'react';
import { howWeAddPerspective } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface PlaneState {
  rotateY: number;
  x: number;
  scale: number;
}

// One abstract architectural surface reorients per perspective instead of
// four long vertical chapters - restrained, not decorative.
const PLANE_STATES: PlaneState[] = [
  { rotateY: -4, x: -8, scale: 1 },
  { rotateY: 2, x: 6, scale: 0.98 },
  { rotateY: 5, x: -4, scale: 1.015 },
  { rotateY: 0, x: 0, scale: 1 },
];

function slug(category: string) {
  return category.toLowerCase();
}

export function HowWeAddPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const activeIndex = manualIndex ?? scrollIndex;

  useEffect(() => {
    if (!driverRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: driverRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, howWeAddPerspective.perspectives.length);
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
    if (!isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const target = PLANE_STATES[activeIndex] ?? PLANE_STATES[0]!;
    if (planeRef.current) gsap.to(planeRef.current, { ...target, duration: 0.7, ease: 'power3.out' });
    if (questionRef.current) {
      gsap.fromTo(questionRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.out' });
    }
    if (descRef.current) {
      gsap.fromTo(descRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPerspective__intro', '.dclPerspective__tab', '.dclPerspective__rule', '.dclPerspective__mobileChapter', '.dclPerspective__closingLine'], {
          clearProps: 'all',
        });
        return;
      }

      gsap.fromTo(
        '.dclPerspective__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );

      if (isDesktop) {
        gsap.fromTo(
          '.dclPerspective__rule',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left center', duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 64%' } },
        );
        gsap.fromTo(
          '.dclPerspective__tab',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
        );
      } else {
        gsap.utils.toArray<HTMLElement>('.dclPerspective__mobileChapter').forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
      }

      gsap.fromTo(
        '.dclPerspective__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclPerspective__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  const active = howWeAddPerspective.perspectives[activeIndex] ?? howWeAddPerspective.perspectives[0]!;

  return (
    <section id="how-we-add-perspective" ref={rootRef} aria-labelledby="perspective-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[640px]">
          <h2 id="perspective-title" className="dclHome__display dclPerspective__intro text-[clamp(2.2rem,3.8vw,3.3rem)] leading-[1.05] tracking-[-.03em] text-[#080a0d]">
            {howWeAddPerspective.headlineLines[0]}
            <br />
            {howWeAddPerspective.headlineLines[1]}
          </h2>
          <p className="dclPerspective__intro mt-6 max-w-[540px] text-[17px] leading-7 text-[#35404a]">{howWeAddPerspective.intro}</p>
        </div>

        {isDesktop ? (
          <div ref={driverRef} className="relative mt-14" style={{ height: '210vh' }}>
            <div className="sticky top-28">
              <div className="dclPerspective__rule h-px w-full bg-[#080a0d]/15" />
              <div onMouseLeave={() => setManualIndex(null)} className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-b border-[#080a0d]/15 py-7">
                {howWeAddPerspective.perspectives.map((p, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <button
                      key={p.category}
                      type="button"
                      data-testid={`perspective-tab-${slug(p.category)}`}
                      data-active={isActive}
                      aria-current={isActive ? 'true' : undefined}
                      onMouseEnter={() => setManualIndex(i)}
                      onFocus={() => setManualIndex(i)}
                      onBlur={() => setManualIndex(null)}
                      onClick={() => setManualIndex(i)}
                      className="dclPerspective__tab relative pb-2 text-[13px] font-semibold uppercase tracking-[.14em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                      style={{ color: isActive ? '#4a8fc2' : '#8a939b' }}
                    >
                      {p.category}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-[1px] left-0 h-px bg-[#8bbfe8] transition-all duration-400"
                        style={{ width: isActive ? '100%' : '0%' }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-2 min-h-[320px] overflow-hidden py-12 lg:min-h-[360px] lg:[perspective:1500px]">
                <div
                  ref={planeRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 top-0 h-full w-[46%] border border-[#080a0d]/10 bg-[#f2f4f6]"
                />
                <div className="relative z-10 max-w-[620px]">
                  <p data-testid="perspective-stage-category" className="dclHome__eyebrow text-[#4a8fc2]">
                    {active.category}
                  </p>
                  <h3
                    ref={questionRef}
                    data-testid="perspective-stage-question"
                    className="dclHome__display mt-5 text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] tracking-[-.02em] text-[#080a0d]"
                  >
                    {active.question}
                  </h3>
                  <p ref={descRef} data-testid="perspective-stage-description" className="mt-6 max-w-[56ch] text-[17px] leading-[1.7] text-[#35404a]">
                    {active.copy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 flex flex-col gap-12">
            {howWeAddPerspective.perspectives.map((p) => (
              <div key={p.category} data-testid={`perspective-mobile-${slug(p.category)}`} className="dclPerspective__mobileChapter border-t border-[#080a0d]/14 pt-8">
                <p className="dclHome__eyebrow text-[#4a8fc2]">{p.category}</p>
                <p className="dclHome__display mt-3 text-[clamp(1.7rem,6.5vw,2.1rem)] leading-[1.12] text-[#080a0d]">{p.question}</p>
                <p className="mt-4 text-[16px] leading-7 text-[#35404a]">{p.copy}</p>
              </div>
            ))}
          </div>
        )}

        <div data-testid="text-perspective-closing" className="dclPerspective__closing mt-20 border-t border-[#080a0d]/15 pt-12 lg:mt-24">
          {howWeAddPerspective.closingLines.map((line) => (
            <p key={line} className="dclPerspective__closingLine dclHome__display max-w-[900px] text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.16] tracking-[-.025em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
