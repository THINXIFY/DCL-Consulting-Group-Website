import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { insightsHero } from '@/data/insights-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function InsightsHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclInsightsHero__label', '.dclInsightsHero__rule', '.dclInsightsHero__revealLine', '.dclInsightsHero__fadeUp', '.dclInsightsHero__imageWrap'], {
          clearProps: 'all',
        });
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.06 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclInsightsHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclInsightsHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, '-=0.25')
        .fromTo('.dclInsightsHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.08 }, '-=0.25')
        .fromTo('.dclInsightsHero__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 }, '-=0.5')
        .fromTo('.dclInsightsHero__imageWrap', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out' }, '-=0.7')
        .to(imageRef.current, { scale: 1, duration: 1.3, ease: 'power3.out' }, '<');
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="insights-hero" ref={rootRef} aria-labelledby="insights-hero-title" className="relative overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16 lg:pb-24 lg:pt-44">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p data-testid="text-insights-hero-eyebrow" className="dclHome__eyebrow dclInsightsHero__label text-[#8bbfe8]">
              {insightsHero.eyebrow}
            </p>
            <div className="dclInsightsHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
            <h1 id="insights-hero-title" data-testid="text-insights-hero-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1.02] tracking-[-.03em]">
              {insightsHero.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclInsightsHero__revealLine block">{line}</span>
                </span>
              ))}
            </h1>
            <p data-testid="text-insights-hero-lead" className="dclInsightsHero__fadeUp mt-7 max-w-[460px] text-[17px] leading-[1.6] text-white/70 sm:text-[18px]">
              {insightsHero.lead}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="dclInsightsHero__imageWrap relative aspect-[16/11] w-full overflow-hidden">
              <img
                ref={imageRef}
                data-testid="img-insights-hero"
                className="h-full w-full object-cover object-center"
                src={insightsHero.image.src}
                alt={insightsHero.image.alt}
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/35 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
