import { useEffect, useRef, useState } from 'react';
import { whyDcl, whyDclImage } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhyDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const quoteIndex = hoveredIndex ?? 0;

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhy__revealLine', '.dclWhy__fadeUp', '.dclWhy__rule', '.dclWhy__chapter', '.dclWhy__imageWrap'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhy__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dclWhy__imageWrap', start: 'top 85%' },
        },
      );

      gsap.fromTo(
        '.dclWhy__revealLine',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );

      gsap.fromTo(
        '.dclWhy__fadeUp',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 65%' },
        },
      );

      if (isDesktop) {
        gsap.fromTo(
          '.dclWhy__rule',
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
          },
        );
      }

      gsap.fromTo(
        '.dclWhy__chapter',
        { autoAlpha: 0, x: 24 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 55%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section
      id="why-dcl"
      ref={rootRef}
      aria-labelledby="why-title"
      className="px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40"
      style={{ background: 'linear-gradient(135deg, #1c1b17 0%, #131210 55%, #171714 100%)' }}
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-0">
        <div className="relative lg:sticky lg:top-24 lg:self-start lg:border-r lg:border-white/12 lg:pr-14">
          <p data-testid="text-why-eyebrow" className="dclHome__eyebrow dclWhy__revealLine mb-5 overflow-hidden text-[#8bbfe8]">
            Why DCL
          </p>
          <h2 id="why-title" className="dclHome__display max-w-[520px] text-[clamp(2.6rem,5.2vw,4.4rem)] leading-[.94] tracking-[-.04em]">
            <span className="block overflow-hidden"><span className="dclWhy__revealLine block">A disciplined way to see</span></span>
            <span className="block overflow-hidden"><span className="dclWhy__revealLine block text-[#c6e3fa]">the decision.</span></span>
          </h2>
          <p className="dclWhy__fadeUp mt-6 max-w-[440px] text-[16px] leading-7 text-white/58">
            DCL's approach is designed around clarity, independence and disciplined evaluation, focusing attention on the factors that matter most.
          </p>

          <div className="dclWhy__fadeUp dclWhy__imageWrap mt-10 aspect-[4/5] w-full max-w-[420px] overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={whyDclImage.src}
              alt={whyDclImage.alt}
              loading="lazy"
              decoding="async"
            />
          </div>

          {isDesktop && (
            <div className="dclWhy__fadeUp mt-14 border-t border-white/12 pt-10">
              <p className="dclHome__eyebrow mb-4 text-[#8bbfe8] transition-opacity duration-300">
                {whyDcl[quoteIndex].title}
              </p>
              <p
                key={quoteIndex}
                data-testid="text-why-quote"
                className="max-w-[420px] font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] italic leading-[1.35] text-white/90 transition-opacity duration-500"
              >
                {whyDcl[quoteIndex].copy}
              </p>
            </div>
          )}
        </div>

        <div className={isDesktop ? 'relative lg:pl-14' : 'relative'}>
          {isDesktop && <div className="dclWhy__rule absolute left-0 top-0 h-full w-px bg-white/12 lg:-left-px" />}
          <div className="flex flex-col">
            {whyDcl.map((item, index) => {
              const active = isDesktop ? hoveredIndex === index : true;
              const dimmed = isDesktop && hoveredIndex !== null && !active;
              return (
                <div
                  key={item.title}
                  data-testid={`quality-${slug(item.title)}`}
                  data-active={active}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => isDesktop && setHoveredIndex(index)}
                  onFocus={() => isDesktop && setHoveredIndex(index)}
                  onBlur={() => isDesktop && setHoveredIndex(null)}
                  className="dclWhy__chapter flex min-h-[110px] flex-col justify-center border-b border-white/12 py-8 outline-none transition-[opacity] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:min-h-[150px] lg:py-0"
                  style={{ opacity: dimmed ? 0.45 : 1 }}
                >
                  <h3
                    className="dclHome__display text-[clamp(1.9rem,3.4vw,3.1rem)] leading-none tracking-[-.03em] transition-transform duration-400"
                    style={{ transform: isDesktop && active ? 'translateX(8px)' : 'translateX(0)', color: active ? '#ffffff' : 'rgba(255,255,255,.72)' }}
                  >
                    {item.title}
                  </h3>
                  <span
                    className="mt-4 block h-px bg-[#8bbfe8] transition-transform duration-500"
                    style={{ width: '80px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                  />
                  {!isDesktop && <p className="mt-4 max-w-[440px] text-[15px] leading-6 text-white/60 sm:text-[16px]">{item.copy}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
