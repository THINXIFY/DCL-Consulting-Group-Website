import { useEffect, useRef, useState } from 'react';
import { evaluationProcess } from '@/data/approach-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface LayerState {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  rotateX: number;
  opacity: number;
}

// Indexed [activeStage][layerIndex]. Understand: layers stay separated.
// Analyse: they begin aligning. Challenge: one layer deliberately shifts
// against the others. Assess: layers reorganise by priority. Advise: all
// five reach a clean final alignment. The metaphor is never labelled.
const STAGE_LAYER_STATES: LayerState[][] = [
  [
    { x: -40, y: -120, z: 40, rotateY: -6, rotateX: 2, opacity: 0.85 },
    { x: 30, y: -60, z: -20, rotateY: 5, rotateX: -1, opacity: 0.7 },
    { x: -25, y: 0, z: 20, rotateY: -4, rotateX: 1, opacity: 0.8 },
    { x: 35, y: 60, z: -25, rotateY: 6, rotateX: -2, opacity: 0.65 },
    { x: -20, y: 120, z: 15, rotateY: -3, rotateX: 1, opacity: 0.75 },
  ],
  [
    { x: -15, y: -90, z: 15, rotateY: -2, rotateX: 1, opacity: 0.8 },
    { x: 12, y: -45, z: -8, rotateY: 2, rotateX: -0.5, opacity: 0.75 },
    { x: -10, y: 0, z: 10, rotateY: -1.5, rotateX: 0.5, opacity: 0.85 },
    { x: 14, y: 45, z: -10, rotateY: 2, rotateX: -1, opacity: 0.75 },
    { x: -8, y: 90, z: 8, rotateY: -1, rotateX: 0.5, opacity: 0.8 },
  ],
  [
    { x: -8, y: -70, z: 8, rotateY: -1, rotateX: 0.5, opacity: 0.55 },
    { x: 6, y: -35, z: -4, rotateY: 1, rotateX: -0.5, opacity: 0.55 },
    { x: 55, y: 10, z: 40, rotateY: 10, rotateX: -4, opacity: 1 },
    { x: 8, y: 35, z: -6, rotateY: 1.5, rotateX: -0.5, opacity: 0.55 },
    { x: -6, y: 70, z: 5, rotateY: -1, rotateX: 0.5, opacity: 0.55 },
  ],
  [
    { x: -4, y: -50, z: -10, rotateY: -0.5, rotateX: 0.3, opacity: 0.45 },
    { x: 3, y: -25, z: -6, rotateY: 0.5, rotateX: -0.3, opacity: 0.5 },
    { x: -3, y: 0, z: -4, rotateY: -0.3, rotateX: 0.2, opacity: 0.45 },
    { x: 0, y: 20, z: 30, rotateY: 0, rotateX: -1, opacity: 1 },
    { x: 2, y: 55, z: -8, rotateY: 0.3, rotateX: -0.2, opacity: 0.55 },
  ],
  [
    { x: 0, y: -60, z: 0, rotateY: 0, rotateX: 0, opacity: 0.7 },
    { x: 0, y: -30, z: 0, rotateY: 0, rotateX: 0, opacity: 0.82 },
    { x: 0, y: 0, z: 0, rotateY: 0, rotateX: 0, opacity: 0.9 },
    { x: 0, y: 30, z: 0, rotateY: 0, rotateX: 0, opacity: 0.96 },
    { x: 0, y: 60, z: 0, rotateY: 0, rotateX: 0, opacity: 1 },
  ],
];

export function EvaluationProcess() {
  const rootRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!driverRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: driverRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, evaluationProcess.stages.length);
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
    if (!isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const states = STAGE_LAYER_STATES[activeIndex] ?? STAGE_LAYER_STATES[0]!;
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = states[i];
      if (!target) return;
      gsap.to(el, { xPercent: -50, yPercent: -50, ...target, duration: 0.9, ease: 'power3.out' });
    });
    if (statementRef.current) {
      gsap.fromTo(statementRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.out' });
    }
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclEvaluation__intro', '.dclEvaluation__mobileStage', '.dclEvaluation__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclEvaluation__intro',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      if (!isDesktop) {
        gsap.utils.toArray<HTMLElement>('.dclEvaluation__mobileStage').forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });
      }
      gsap.fromTo(
        '.dclEvaluation__closingLine',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclEvaluation__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  const active = evaluationProcess.stages[activeIndex] ?? evaluationProcess.stages[0]!;

  return (
    <section id="evaluation-process" ref={rootRef} aria-labelledby="evaluation-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        {isDesktop ? (
          <div ref={driverRef} className="relative" style={{ height: '360vh' }}>
            <div className="sticky top-0 grid min-h-screen items-center gap-16 py-24 lg:grid-cols-[.38fr_.62fr]">
              <div>
                <h2 id="evaluation-title" className="dclHome__display max-w-[420px] text-[clamp(2.4rem,4.2vw,3.4rem)] leading-[1.02] tracking-[-.035em]">
                  {evaluationProcess.headlineLines[0]}
                  <br />
                  {evaluationProcess.headlineLines[1]}
                </h2>
                <p className="mt-6 max-w-[380px] text-[16px] leading-7 text-white/55">{evaluationProcess.intro}</p>

                <div className="mt-12 flex items-center gap-3">
                  {evaluationProcess.stages.map((stage, index) => (
                    <div
                      key={stage.name}
                      data-testid={`evaluation-marker-${stage.name.toLowerCase()}`}
                      data-active={activeIndex === index}
                      className="h-1.5 transition-all duration-400"
                      style={{ width: activeIndex === index ? '32px' : '10px', backgroundColor: activeIndex === index ? '#8bbfe8' : 'rgba(255,255,255,.2)' }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative h-[420px] lg:[perspective:1800px]">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-full w-full max-w-[520px] [transform-style:preserve-3d]">
                    {evaluationProcess.stages.map((stage, index) => (
                      <div
                        key={stage.name}
                        ref={(el) => {
                          layerRefs.current[index] = el;
                        }}
                        data-testid={`evaluation-layer-${stage.name.toLowerCase()}`}
                        className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center gap-3"
                      >
                        <div className="h-[3px] w-3 shrink-0 bg-[#8bbfe8]" />
                        <div className="h-px w-full bg-white/45" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 flex h-full flex-col justify-end">
                  <p data-testid="evaluation-active-name" className="dclHome__eyebrow text-[#8bbfe8]">
                    {active.name}
                  </p>
                  <p
                    ref={statementRef}
                    data-testid="evaluation-active-statement"
                    className="dclHome__display mt-4 max-w-[520px] text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.1] tracking-[-.02em] text-white"
                  >
                    {active.statement}
                  </p>
                  <p ref={descriptionRef} data-testid="evaluation-active-description" className="mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-white/70">
                    {active.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 id="evaluation-title" className="dclEvaluation__intro dclHome__display max-w-[420px] text-[clamp(2.2rem,6vw,2.8rem)] leading-[1.05] tracking-[-.03em]">
              {evaluationProcess.headlineLines[0]}
              <br />
              {evaluationProcess.headlineLines[1]}
            </h2>
            <p className="dclEvaluation__intro mt-6 max-w-[440px] text-[16px] leading-7 text-white/55">{evaluationProcess.intro}</p>

            <div className="mt-14 flex flex-col gap-12">
              {evaluationProcess.stages.map((stage) => (
                <div key={stage.name} data-testid={`evaluation-mobile-${stage.name.toLowerCase()}`} className="dclEvaluation__mobileStage border-t border-white/12 pt-8">
                  <p className="dclHome__eyebrow text-[#8bbfe8]">{stage.name}</p>
                  <p className="dclHome__display mt-3 text-[clamp(1.7rem,6.5vw,2.1rem)] leading-[1.12] text-white">{stage.statement}</p>
                  <p className="mt-4 text-[16px] leading-7 text-white/70">{stage.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div data-testid="text-evaluation-closing" className="dclEvaluation__closing mt-20 border-t border-white/12 pt-14 lg:mt-8">
          {evaluationProcess.closingLines.map((line) => (
            <p key={line} className="dclEvaluation__closingLine dclHome__display max-w-[820px] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.18] tracking-[-.025em] text-white">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
