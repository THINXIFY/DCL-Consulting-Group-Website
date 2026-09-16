import { useEffect, useRef, useState } from 'react';
import { evaluationProcess } from '@/data/approach-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

interface BandState {
  x: number;
  z: number;
  rotateY: number;
  opacity: number;
}

// Each band keeps a fixed vertical slot (BAND_Y) so the five planes can
// never collide, whatever a stage's opacity/emphasis does. Stages instead
// differentiate themselves through horizontal drift, depth and rotation.
// Understand: gentle depth separation across all five. Analyse: they
// begin aligning (rotation relaxes toward zero). Challenge: one band
// (index 2, Challenge itself) shifts hard forward against the others.
// Assess: one band (index 3, Assess) surfaces above the rest via depth.
// Advise: all five flatten into one precise, aligned structure,
// differentiated only by rising opacity toward the final band. Never
// labelled as such on screen.
const BAND_Y = [-176, -88, 0, 88, 176];

const STAGE_BAND_STATES: BandState[][] = [
  [
    { x: -60, z: 50, rotateY: -8, opacity: 0.5 },
    { x: 42, z: -16, rotateY: 6, opacity: 0.4 },
    { x: -32, z: 26, rotateY: -5, opacity: 0.55 },
    { x: 46, z: -20, rotateY: 7, opacity: 0.4 },
    { x: -26, z: 16, rotateY: -4, opacity: 0.5 },
  ],
  [
    { x: -26, z: 20, rotateY: -3, opacity: 0.55 },
    { x: 18, z: -10, rotateY: 2, opacity: 0.5 },
    { x: -16, z: 12, rotateY: -2, opacity: 0.6 },
    { x: 20, z: -12, rotateY: 3, opacity: 0.5 },
    { x: -12, z: 10, rotateY: -1.5, opacity: 0.55 },
  ],
  [
    { x: -12, z: 10, rotateY: -1.5, opacity: 0.4 },
    { x: 8, z: -6, rotateY: 1, opacity: 0.4 },
    { x: 84, z: 65, rotateY: 15, opacity: 1 },
    { x: 12, z: -8, rotateY: 2, opacity: 0.4 },
    { x: -8, z: 6, rotateY: -1, opacity: 0.4 },
  ],
  [
    { x: -6, z: -16, rotateY: -0.5, opacity: 0.35 },
    { x: 4, z: -8, rotateY: 0.5, opacity: 0.4 },
    { x: -4, z: -6, rotateY: -0.3, opacity: 0.35 },
    { x: 0, z: 48, rotateY: 0, opacity: 1 },
    { x: 3, z: -10, rotateY: 0.3, opacity: 0.45 },
  ],
  [
    { x: 0, z: 0, rotateY: 0, opacity: 0.75 },
    { x: 0, z: 0, rotateY: 0, opacity: 0.85 },
    { x: 0, z: 0, rotateY: 0, opacity: 0.92 },
    { x: 0, z: 0, rotateY: 0, opacity: 0.97 },
    { x: 0, z: 0, rotateY: 0, opacity: 1 },
  ],
];

const TONES = ['#080a0d', '#0a0c10', '#0c0e12', '#0a0c10', '#08090c'];

// The band carrying the highest opacity in a stage's states is the one
// the architectural shift is built around - reuse that as the single
// "relevant" plane the text/rule should highlight, so the emphasis
// always matches what the geometry is already doing.
function emphasisIndexFor(stageIndex: number) {
  const states = STAGE_BAND_STATES[stageIndex] ?? STAGE_BAND_STATES[0]!;
  let maxOpacity = -1;
  let index = 0;
  states.forEach((state, i) => {
    if (state.opacity > maxOpacity) {
      maxOpacity = state.opacity;
      index = i;
    }
  });
  return index;
}

export function EvaluationProcess() {
  const rootRef = useRef<HTMLElement>(null);
  const driverRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bandTextRefs = useRef<Array<HTMLDivElement | null>>([]);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isWide = useMediaQuery('(min-width: 1440px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  // Below 1440px the right-hand column is too narrow for the full-width
  // planes and their horizontal drift together - scale drift down so the
  // architecture never pushes past the viewport on laptop widths.
  const xScale = isWide ? 1 : 0.5;

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
    const states = STAGE_BAND_STATES[activeIndex] ?? STAGE_BAND_STATES[0]!;
    bandRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = states[i];
      if (!target) return;
      gsap.to(el, { xPercent: -50, yPercent: -50, ...target, x: target.x * xScale, y: BAND_Y[i], duration: 0.9, ease: 'power3.out' });
    });
    bandTextRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: i * 0.03 });
    });
    if (statementRef.current) {
      gsap.fromTo(statementRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.65, ease: 'power3.out' });
    }
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [activeIndex, isDesktop, isWide, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclEvaluation__revealLine', '.dclEvaluation__fadeUp', '.dclEvaluation__mobileStage', '.dclEvaluation__closingLine'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclEvaluation__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclEvaluation__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
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

  function goToStage(index: number) {
    if (!driverRef.current) return;
    const segment = driverRef.current.offsetHeight / evaluationProcess.stages.length;
    const target = driverRef.current.offsetTop + segment * index + segment * 0.4;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  const active = evaluationProcess.stages[activeIndex] ?? evaluationProcess.stages[0]!;
  const activeBands = evaluationProcess.bandsByStage[activeIndex] ?? evaluationProcess.bandsByStage[0]!;
  const emphasisIndex = emphasisIndexFor(activeIndex);

  return (
    <section
      id="evaluation-process"
      ref={rootRef}
      aria-labelledby="evaluation-title"
      className="px-6 py-24 text-white transition-colors duration-700 sm:px-10 sm:py-32 lg:px-16 lg:py-32"
      style={{ backgroundColor: isDesktop ? TONES[activeIndex] : '#080a0d' }}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[720px]">
          <p className="dclHome__eyebrow dclEvaluation__revealLine mb-6 overflow-hidden text-[#8bbfe8]">{evaluationProcess.eyebrow}</p>
          <h2 id="evaluation-title" className="dclHome__display text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[1.02] tracking-[-.035em]">
            <span className="block overflow-hidden"><span className="dclEvaluation__revealLine block">{evaluationProcess.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclEvaluation__revealLine block">{evaluationProcess.headlineLines[1]}</span></span>
          </h2>
          <p className="dclEvaluation__fadeUp mt-6 max-w-[540px] text-[16px] leading-7 text-white/55">{evaluationProcess.intro}</p>
        </div>

        {isDesktop && !prefersReducedMotion ? (
          <div ref={driverRef} className="relative mt-16" style={{ height: '340vh' }}>
            <div className="sticky top-0 grid h-screen grid-cols-12 items-center gap-8">
              <div className="col-span-2 flex flex-col gap-8">
                {evaluationProcess.stages.map((stage, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={stage.name}
                      type="button"
                      data-testid={`evaluation-nav-${stage.name.toLowerCase()}`}
                      data-active={isActive}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => goToStage(index)}
                      className="w-fit text-left text-[13px] font-semibold uppercase tracking-[.14em] outline-none transition-[color] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                      style={{ color: isActive ? '#8bbfe8' : 'rgba(255,255,255,.4)' }}
                    >
                      {stage.name}
                    </button>
                  );
                })}
              </div>

              <div className="col-span-6 col-start-3">
                <p data-testid="evaluation-active-name" className="dclHome__eyebrow text-[#8bbfe8]">
                  {active.name}
                </p>
                <p
                  ref={statementRef}
                  data-testid="evaluation-active-statement"
                  className="dclHome__display mt-5 max-w-[620px] text-[clamp(2.6rem,4.6vw,4.2rem)] leading-[1.08] tracking-[-.025em] text-white"
                >
                  {active.statement}
                </p>
                <p ref={descriptionRef} data-testid="evaluation-active-description" className="mt-7 max-w-[54ch] text-[18px] leading-[1.7] text-white/70">
                  {active.description}
                </p>

                <div className="relative mt-10 h-px w-full max-w-[420px] bg-white/15">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#8bbfe8] transition-[width] duration-500 ease-out"
                    style={{ width: `${((activeIndex + 1) / evaluationProcess.stages.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="relative col-span-4 col-start-9 h-[64%] lg:[perspective:1800px]">
                <div className="pointer-events-none relative h-full w-full [transform-style:preserve-3d]">
                  {evaluationProcess.stages.map((stage, index) => {
                    const band = activeBands[index]!;
                    const isEmphasis = index === emphasisIndex;
                    return (
                      <div
                        key={stage.name}
                        ref={(el) => {
                          bandRefs.current[index] = el;
                        }}
                        data-testid={`evaluation-band-${stage.name.toLowerCase()}`}
                        data-emphasis={isEmphasis}
                        className="absolute left-1/2 top-1/2 flex w-[240px] flex-col justify-center gap-2 border border-white/18 bg-white/[.04] px-6 py-4 xl:w-[300px] xl:px-7 2xl:w-[400px]"
                      >
                        <div ref={(el) => { bandTextRefs.current[index] = el; }}>
                          <div className="flex items-center gap-3">
                            <div className="h-px w-4 shrink-0 transition-colors duration-400" style={{ backgroundColor: isEmphasis ? '#8bbfe8' : 'rgba(255,255,255,.3)' }} />
                            <p
                              data-testid={`evaluation-band-label-${index}`}
                              className="text-[12px] font-semibold uppercase tracking-[.12em] transition-colors duration-400"
                              style={{ fontFamily: 'var(--app-font-sans)', color: isEmphasis ? '#8bbfe8' : 'rgba(255,255,255,.5)' }}
                            >
                              {band.label}
                            </p>
                          </div>
                          <p
                            data-testid={`evaluation-band-phrase-${index}`}
                            className="mt-2 text-[15px] leading-snug transition-colors duration-400"
                            style={{ color: isEmphasis ? 'rgba(255,255,255,.82)' : 'rgba(255,255,255,.35)' }}
                          >
                            {band.phrase}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 flex flex-col gap-12">
            {evaluationProcess.stages.map((stage, index) => (
              <div key={stage.name} data-testid={`evaluation-mobile-${stage.name.toLowerCase()}`} className="dclEvaluation__mobileStage border-t border-white/12 pt-8">
                <p className="dclHome__eyebrow text-[#8bbfe8]">{stage.name}</p>
                <p className="dclHome__display mt-3 text-[clamp(1.9rem,7vw,2.4rem)] leading-[1.12] text-white">{stage.statement}</p>
                <p className="mt-4 text-[16px] leading-7 text-white/70">{stage.description}</p>
                <div data-testid={`evaluation-mobile-bands-${stage.name.toLowerCase()}`} className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {(evaluationProcess.bandsByStage[index] ?? []).map((band) => (
                    <span key={band.label} className="text-[11px] font-semibold uppercase tracking-[.12em] text-white/40">
                      {band.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
