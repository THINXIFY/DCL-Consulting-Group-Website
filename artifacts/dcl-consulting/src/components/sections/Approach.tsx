import { useEffect, useRef, useState } from 'react';
import { approach, approachBandImage } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Approach() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const bandWrapRef = useRef<HTMLDivElement>(null);
  const bandImageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          // Guard against a near-zero start/end distance (e.g. the list
          // hasn't been laid out with real height yet): trust progress
          // only once the trigger has a meaningful scroll range.
          if (Math.abs(self.end - self.start) < 1) return;
          setActiveIndex(getActiveIndex(self.progress, approach.length));
        },
      });

      gsap.fromTo(
        '.dclApproach__progressRule',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: listRef.current, start: 'top center', end: 'bottom center', scrub: true },
        },
      );

      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!bandRef.current || !bandWrapRef.current || !bandImageRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(bandRef.current, { clipPath: 'inset(0 0% 0 0)' });
        gsap.set(bandWrapRef.current, { opacity: 1, scale: 1 });
        gsap.set(bandImageRef.current, { y: 0, scale: 1 });
        return;
      }

      {
        // The frame only ever gets a clip-path (never a transform), so its
        // geometry stays stable for ScrollTrigger to measure. The scale and
        // opacity ramp live on the wrapper one level in; the continuous
        // parallax drift lives on the img itself - three separate layers so
        // the one-time entrance tween and the scroll-scrubbed drift never
        // fight over the same element's transform.
        gsap.set(bandRef.current, { clipPath: 'inset(0 100% 0 0)' });
        gsap.set(bandWrapRef.current, { opacity: 0.85, scale: 1.045 });

        const revealTl = gsap.timeline({ scrollTrigger: { trigger: bandRef.current, start: 'top 85%' } });
        revealTl
          .to(bandRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.35, ease: 'power4.out' })
          .to(bandWrapRef.current, { opacity: 1, scale: 1, duration: 1.35, ease: 'power4.out' }, '<');

        // Baseline scale of 1.05 (rather than the requested 1) gives the
        // image enough overscan that a +/-15px translate never exposes an
        // edge inside the frame; the 0.02 delta on top still matches the
        // requested drift amount, just shifted up to stay safe.
        gsap.fromTo(
          bandImageRef.current,
          { y: -15, scale: 1.05 },
          {
            y: 15,
            scale: 1.07,
            ease: 'none',
            scrollTrigger: { trigger: bandRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="approach"
      ref={rootRef}
      aria-labelledby="approach-title"
      className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-16 lg:grid-cols-[.85fr_1.4fr] lg:gap-28">
          <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
            <p data-testid="text-approach-eyebrow" className="dclHome__eyebrow mb-5 text-[#8bbfe8]">
              Our approach
            </p>
            <h2 id="approach-title" className="dclHome__display max-w-[430px] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[.93] tracking-[-.04em] text-white">
              From information to informed judgement.
            </h2>
            <p className="mt-8 max-w-[320px] text-[16px] leading-7 text-white/60">
              We make the complex legible: a process designed to move from the right question to a decision you can stand behind.
            </p>
          </div>
          <div ref={listRef} className="relative border-l border-white/15 pl-10">
            <div className="dclApproach__progressRule absolute left-0 top-0 h-full w-px bg-[#8bbfe8]" />
            <div className="flex flex-col gap-14">
              {approach.map((stage, index) => {
                const active = isDesktop ? activeIndex === index : true;
                return (
                  <div
                    key={stage.title}
                    data-testid={`text-stage-${stage.title.toLowerCase()}`}
                    data-active={active}
                    className="transition-opacity duration-500"
                    style={{ opacity: active ? 1 : 0.35 }}
                  >
                    <h3 className="dclHome__display text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-.03em] text-white">{stage.title}</h3>
                    <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-white/60">{stage.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div ref={bandRef} className="dclApproach__band relative mt-24 aspect-[21/9] w-full overflow-hidden lg:mt-32">
          <div ref={bandWrapRef} className="absolute inset-0">
            <img
              ref={bandImageRef}
              data-testid="img-approach-band"
              className="h-full w-full object-cover object-center"
              src={approachBandImage.src}
              alt={approachBandImage.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-[#171714]/25" />
        </div>
      </div>
    </section>
  );
}
