import { useEffect, useRef, useState } from 'react';
import { challengeAssumptions } from '@/data/approach-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

// A staggered zigzag, not a uniform grid - alternating column and a
// small vertical offset per item so the four questions read as a
// precise but asymmetric editorial arrangement.
const STAGGER = ['0rem', '4.5rem', '1.5rem', '6rem'];

function slug(question: string) {
  return question.toLowerCase().replaceAll('?', '').replaceAll(' ', '-');
}

export function ChallengeAssumptions() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useEffect(() => {
    if (!gridRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, challengeAssumptions.questions.length);
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
        gsap.set(['.dclChallenge__revealLine', '.dclChallenge__fadeUp', '.dclChallenge__item', '.dclChallenge__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclChallenge__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclChallenge__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclChallenge__item',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
      gsap.fromTo(
        '.dclChallenge__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclChallenge__closing', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="challenge-assumptions" ref={rootRef} aria-labelledby="challenge-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <h2 id="challenge-title" className="dclHome__display lg:col-span-7 text-[clamp(2.4rem,4.4vw,3.8rem)] leading-[1.02] tracking-[-.035em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclChallenge__revealLine block">{challengeAssumptions.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclChallenge__revealLine block">{challengeAssumptions.headlineLines[1]}</span></span>
          </h2>
          <p className="dclChallenge__fadeUp lg:col-span-4 lg:col-start-9 mt-2 text-[17px] leading-7 text-[#35404a] lg:mt-1">{challengeAssumptions.intro}</p>
        </div>

        <div ref={gridRef} className="mt-16 grid grid-cols-1 gap-y-14 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
          {challengeAssumptions.questions.map((item, index) => {
            const active = isDesktop ? activeIndex === index : true;
            const isRight = index % 2 === 1;
            return (
              <div
                key={item.question}
                data-testid={`challenge-item-${slug(item.question)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setHoverIndex(index)}
                onMouseLeave={() => isDesktop && setHoverIndex(null)}
                onFocus={() => isDesktop && setHoverIndex(index)}
                onBlur={() => isDesktop && setHoverIndex(null)}
                className={`dclChallenge__item cursor-pointer border-t border-[#080a0d]/15 pt-8 outline-none transition-[background-color] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:col-span-6 ${isRight ? 'lg:col-start-7' : 'lg:col-start-1'}`}
                style={{ marginTop: isDesktop ? STAGGER[index] : undefined, backgroundColor: active && isDesktop ? '#e9edf0' : 'transparent' }}
              >
                <p
                  className="dclHome__display leading-[1.06] tracking-[-.02em] transition-[color,transform] duration-400"
                  style={{ fontSize: 'clamp(1.9rem,3.2vw,2.6rem)', color: active ? '#080a0d' : '#8a939b', transform: active && isDesktop ? 'translateX(6px)' : 'translateX(0)' }}
                >
                  {item.question}
                </p>
                <div className="mt-4 h-px bg-[#8bbfe8] transition-all duration-500" style={{ width: active ? '56px' : '20px' }} />
                <p className="mt-4 max-w-[46ch] text-[16px] leading-7 transition-colors duration-400 sm:text-[17px]" style={{ color: active ? '#35404a' : '#9aa3ab' }}>
                  {item.copy}
                </p>
              </div>
            );
          })}
        </div>

        <div data-testid="text-challenge-closing" className="dclChallenge__closing mt-24 border-t border-[#080a0d]/15 pt-14 lg:mt-32">
          {challengeAssumptions.closingLines.map((line) => (
            <p key={line} className="dclChallenge__closingLine dclHome__display max-w-[900px] text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.24] tracking-[-.02em] text-[#080a0d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
