import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { industriesHero } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

interface SliceConfig {
  widthDesktop: number;
  parallax: number;
  tone: string;
}

// Each slice is a distinct commercial environment drifting past the
// others at its own depth and speed - unlike the Expertise hero's
// lenses, these never converge into a single aligned stack.
const SLICE_CONFIG: SliceConfig[] = [
  { widthDesktop: 132, parallax: -46, tone: 'rgba(255,255,255,.05)' },
  { widthDesktop: 88, parallax: 30, tone: 'rgba(255,255,255,.03)' },
  { widthDesktop: 150, parallax: -22, tone: 'rgba(255,255,255,.06)' },
  { widthDesktop: 96, parallax: 42, tone: 'rgba(255,255,255,.03)' },
  { widthDesktop: 118, parallax: -34, tone: 'rgba(255,255,255,.05)' },
  { widthDesktop: 104, parallax: 20, tone: 'rgba(255,255,255,.04)' },
];

export function IndustriesHero() {
  const rootRef = useRef<HTMLElement>(null);
  const sliceStageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const sliceCount = isMobile ? 3 : isDesktop ? 6 : 4;
  const slices = industriesHero.sectorSlices.slice(0, sliceCount);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const sliceEls = gsap.utils.toArray<HTMLElement>('.dclIndustriesHero__slice');

      if (prefersReducedMotion) {
        gsap.set(['.dclIndustriesHero__revealLine', '.dclIndustriesHero__fadeUp', '.dclIndustriesHero__rule', '.dclIndustriesHero__closing'], { clearProps: 'all' });
        gsap.set(sliceEls, { clearProps: 'all', opacity: 1 });
        return;
      }

      gsap.set(sliceEls, { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo('.dclIndustriesHero__eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclIndustriesHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.25')
        .fromTo('.dclIndustriesHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.09 }, '-=0.3')
        .fromTo('.dclIndustriesHero__intro', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .to(sliceEls, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' }, '-=0.35')
        .fromTo('.dclIndustriesHero__supporting', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclIndustriesHero__closing', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05 }, '-=0.2');

      if (!isMobile && sliceEls.length) {
        const magnitude = isDesktop ? 1 : 0.5;
        gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        })
          .to(sliceEls, { yPercent: (i: number) => ((SLICE_CONFIG[i]?.parallax ?? 0) * magnitude) / 2, duration: 1, ease: 'none' }, 0)
          .to('.dclIndustriesHero__headline', { yPercent: -6, duration: 1, ease: 'none' }, 0)
          .to(sliceStageRef.current, { autoAlpha: 0.25, duration: 0.4, ease: 'none' }, 0.6);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop, isMobile, sliceCount]);

  return (
    <section id="industries-hero" ref={rootRef} aria-labelledby="industries-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1560px] flex-col px-6 pb-10 pt-28 sm:px-10 lg:px-16">
        <div className="grid flex-1 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5">
              <p data-testid="text-industries-hero-eyebrow" className="dclHome__eyebrow dclIndustriesHero__eyebrow text-[#9ca3aa]">
                {industriesHero.eyebrow}
              </p>
              <div className="dclIndustriesHero__rule h-px w-16 origin-left bg-[#8bbfe8]" />
            </div>

            <h1
              id="industries-hero-title"
              data-testid="text-industries-hero-title"
              className="dclHome__display dclIndustriesHero__headline mt-8 text-[clamp(3.2rem,7vw,7rem)] leading-[.98] tracking-[-.03em]"
            >
              <span className="block overflow-hidden"><span className="dclIndustriesHero__revealLine block">{industriesHero.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIndustriesHero__revealLine block">{industriesHero.headlineLines[1]}</span></span>
            </h1>

            <p data-testid="text-industries-hero-intro" className="dclIndustriesHero__intro mt-8 max-w-[520px] text-[19px] leading-[1.6] text-white/75 sm:text-[21px]">
              {industriesHero.intro}
            </p>
          </div>

          <div className="relative lg:col-span-5 lg:flex lg:items-stretch lg:justify-end">
            <div ref={sliceStageRef} className="relative mx-auto flex h-[220px] w-full max-w-[420px] items-stretch gap-1 sm:h-[280px] lg:mx-0 lg:h-full lg:max-w-none">
              {slices.map((term, index) => {
                const config = SLICE_CONFIG[index] ?? SLICE_CONFIG[0]!;
                return (
                  <div
                    key={term}
                    data-testid={`hero-sector-slice-${index}`}
                    className="dclIndustriesHero__slice relative flex-1 overflow-hidden border-x border-white/10"
                    style={{ backgroundColor: config.tone, flexGrow: isDesktop ? config.widthDesktop : undefined }}
                  >
                    <p
                      className="dclHome__eyebrow absolute bottom-6 left-1/2 whitespace-nowrap text-white/55 lg:bottom-8"
                      style={{ writingMode: 'vertical-rl', transform: 'translateX(-50%) rotate(180deg)' }}
                    >
                      {term}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/12 pt-6 sm:flex-row sm:items-end sm:justify-between lg:mt-8">
          <p data-testid="text-industries-hero-supporting" className="dclIndustriesHero__supporting max-w-[640px] text-[16px] leading-7 text-white/55">
            {industriesHero.supporting}
          </p>
          <div data-testid="text-industries-hero-closing" className="shrink-0 sm:text-right">
            {industriesHero.closingLines.map((line) => (
              <p key={line} className="dclIndustriesHero__closing text-[11px] font-semibold uppercase tracking-[.15em] text-white/60">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
