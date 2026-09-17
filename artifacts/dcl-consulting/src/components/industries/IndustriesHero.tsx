import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { industriesHero } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function IndustriesHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclIndustriesHero__label', '.dclIndustriesHero__rule', '.dclIndustriesHero__revealLine', '.dclIndustriesHero__fadeUp', '.dclIndustriesHero__imageWrap', '.dclIndustriesHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.06 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclIndustriesHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('.dclIndustriesHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, '-=0.25')
        .fromTo('.dclIndustriesHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1 }, '-=0.25')
        .fromTo('.dclIndustriesHero__fadeUp', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.75 }, '-=0.5')
        .fromTo('.dclIndustriesHero__imageWrap', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out' }, '-=0.75')
        .to(imageRef.current, { scale: 1, duration: 1.3, ease: 'power3.out' }, '<')
        .fromTo('.dclIndustriesHero__statement', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.4');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="industries-hero" ref={rootRef} aria-labelledby="industries-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1560px] flex-col justify-center px-6 pb-16 pt-32 sm:px-10 lg:px-16 lg:pb-14 lg:pt-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="relative z-10 lg:col-span-7">
            <p data-testid="text-industries-hero-label" className="dclHome__eyebrow dclIndustriesHero__label text-[#8bbfe8]">
              {industriesHero.eyebrow}
            </p>
            <div className="dclIndustriesHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
            <h1
              id="industries-hero-title"
              data-testid="text-industries-hero-title"
              className="dclHome__display mt-6 text-[clamp(2.8rem,5.6vw,5rem)] leading-[1.02] tracking-[-.03em]"
            >
              <span className="block overflow-hidden"><span className="dclIndustriesHero__revealLine block">{industriesHero.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIndustriesHero__revealLine block">{industriesHero.headlineLines[1]}</span></span>
            </h1>
            <p data-testid="text-industries-hero-lead" className="dclIndustriesHero__fadeUp mt-7 max-w-[520px] text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
              {industriesHero.lead}
            </p>
          </div>

          <div className="relative lg:col-span-5">
            <div className="dclIndustriesHero__imageWrap relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[3/4]">
              <img
                ref={imageRef}
                data-testid="img-industries-hero"
                className="h-full w-full object-cover object-center"
                src={industriesHero.image.src}
                alt={industriesHero.image.alt}
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/40 via-transparent to-transparent" />
            </div>
            <div data-testid="text-industries-hero-statement" className="mt-6 flex items-center gap-6">
              {industriesHero.imageStatementLines.map((line, index) => (
                <span key={line} className="flex items-center gap-6">
                  <span className="dclIndustriesHero__statement text-[10px] font-semibold uppercase tracking-[.16em] text-white/45">{line}</span>
                  {index < industriesHero.imageStatementLines.length - 1 && <span aria-hidden="true" className="h-3 w-px bg-white/15" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
