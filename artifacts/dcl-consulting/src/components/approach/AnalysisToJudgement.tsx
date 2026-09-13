import { useEffect, useRef } from 'react';
import { analysisToJudgement } from '@/data/approach-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

interface TermPosition {
  top: string;
  left: string;
  rotate: number;
}

const TERM_POSITIONS: TermPosition[] = [
  { top: '10%', left: '14%', rotate: -6 },
  { top: '16%', left: '68%', rotate: 4 },
  { top: '28%', left: '32%', rotate: -3 },
  { top: '40%', left: '82%', rotate: 5 },
  { top: '52%', left: '10%', rotate: -4 },
  { top: '60%', left: '54%', rotate: 3 },
  { top: '72%', left: '24%', rotate: -5 },
  { top: '78%', left: '72%', rotate: 4 },
  { top: '20%', left: '46%', rotate: -2 },
  { top: '66%', left: '38%', rotate: 2 },
];

export function AnalysisToJudgement() {
  const rootRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclJudgement__revealLine', '.dclJudgement__fadeUp', '.dclJudgement__term', '.dclJudgement__idea', '.dclJudgement__closingLine', '.dclJudgement__mobileIdea'], {
          clearProps: 'all',
        });
        return;
      }

      gsap.fromTo(
        '.dclJudgement__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclJudgement__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );

      if (isDesktop && stageRef.current && driverRef.current) {
        gsap.set('.dclJudgement__idea', { autoAlpha: 0, y: 24 });
        gsap.set('.dclJudgement__closing', { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: driverRef.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
        });
        tl.to('.dclJudgement__term', { autoAlpha: 0, y: -18, stagger: 0.03, duration: 1, ease: 'none' }, 0)
          .to('.dclJudgement__idea', { autoAlpha: 1, y: 0, stagger: 0.5, duration: 1, ease: 'none' }, 0.35)
          .to('.dclJudgement__closing', { autoAlpha: 1, y: 0, duration: 1, ease: 'none' }, 1.9);
      } else {
        gsap.utils.toArray<HTMLElement>('.dclJudgement__mobileIdea').forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
        gsap.fromTo(
          '.dclJudgement__closing',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: '.dclJudgement__closing', start: 'top 88%' } },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="analysis-to-judgement" ref={rootRef} aria-labelledby="judgement-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[620px]">
          <h2 id="judgement-title" className="dclHome__display text-[clamp(2.4rem,4.4vw,3.7rem)] leading-[1.02] tracking-[-.035em]">
            <span className="block overflow-hidden"><span className="dclJudgement__revealLine block">{analysisToJudgement.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclJudgement__revealLine block">{analysisToJudgement.headlineLines[1]}</span></span>
          </h2>
          <p className="dclJudgement__fadeUp mt-6 max-w-[540px] text-[16px] leading-7 text-white/55 sm:text-[17px]">{analysisToJudgement.intro}</p>
        </div>

        {isDesktop ? (
          <div ref={driverRef} className="relative mt-16" style={{ height: '240vh' }}>
            <div ref={stageRef} className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {analysisToJudgement.backgroundTerms.map((term, index) => {
                  const pos = TERM_POSITIONS[index] ?? TERM_POSITIONS[0]!;
                  return (
                    <p
                      key={term}
                      className="dclJudgement__term dclHome__display absolute text-[1.4rem] text-white/25"
                      style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate}deg)` }}
                    >
                      {term}
                    </p>
                  );
                })}
              </div>

              <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
                {analysisToJudgement.ideas.map((idea) => (
                  <div key={idea.title} data-testid={`judgement-idea-${idea.title.toLowerCase().replaceAll(' ', '-')}`} className="dclJudgement__idea max-w-[560px]">
                    <p className="dclHome__display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] tracking-[-.02em] text-[#8bbfe8]">{idea.title}</p>
                    <p className="mt-3 text-[16px] leading-7 text-white/65 sm:text-[17px]">{idea.copy}</p>
                  </div>
                ))}
              </div>

              <div data-testid="text-judgement-closing" className="dclJudgement__closing absolute inset-x-0 bottom-16 px-6 text-center">
                {analysisToJudgement.closingLines.map((line) => (
                  <p key={line} className="dclHome__display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.3] text-white">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-14 flex flex-col gap-12">
              {analysisToJudgement.ideas.map((idea) => (
                <div
                  key={idea.title}
                  data-testid={`judgement-idea-${idea.title.toLowerCase().replaceAll(' ', '-')}`}
                  className="dclJudgement__mobileIdea border-t border-white/12 pt-8"
                >
                  <p className="dclHome__display text-[clamp(1.7rem,6vw,2.1rem)] leading-[1.1] text-[#8bbfe8]">{idea.title}</p>
                  <p className="mt-3 text-[16px] leading-7 text-white/65">{idea.copy}</p>
                </div>
              ))}
            </div>
            <div data-testid="text-judgement-closing" className="dclJudgement__closing mt-16 border-t border-white/12 pt-10">
              {analysisToJudgement.closingLines.map((line) => (
                <p key={line} className="dclHome__display text-[clamp(1.5rem,6vw,2rem)] leading-[1.3] text-white">
                  {line}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
