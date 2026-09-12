import { useEffect, useRef, useState } from 'react';
import { philosophy } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function renderStatement(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="dclPhilosophy__highlight text-[#8bbfe8]">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export function OurPhilosophy() {
  const rootRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const progressRuleRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current || !pinWrapRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: pinWrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (progressRuleRef.current) {
            progressRuleRef.current.style.transform = `scaleX(${self.progress})`;
          }
          const next = getActiveIndex(self.progress, philosophy.length);
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
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclPhilosophy__intro',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );

      if (!isDesktop) {
        gsap.fromTo(
          '.dclPhilosophy__mobileStatement',
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.dclPhilosophy__mobileList', start: 'top 80%' },
          },
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section id="our-philosophy" ref={rootRef} aria-labelledby="philosophy-title" className="bg-[#080a0d] text-white">
      <div className="mx-auto max-w-[1440px] px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16 lg:pt-40">
        <p data-testid="text-philosophy-eyebrow" className="dclHome__eyebrow dclPhilosophy__intro mb-5 text-[#8bbfe8]">
          Our philosophy
        </p>
        <h2 id="philosophy-title" className="dclHome__display dclPhilosophy__intro max-w-[600px] text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[.94] tracking-[-.04em]">
          Clarity before capital.
        </h2>
        <p className="dclPhilosophy__intro mt-6 max-w-[520px] text-[16px] leading-7 text-white/58">
          Good decisions begin with understanding the opportunity clearly, testing assumptions and identifying what can materially influence the outcome.
        </p>
      </div>

      {isDesktop ? (
        <div ref={pinWrapRef} className="relative" style={{ height: `${philosophy.length * 100}vh` }}>
          <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16">
            <div className="relative w-full max-w-[900px]">
              {philosophy.map((item, index) => (
                <p
                  key={item.text}
                  data-testid={`statement-${index}`}
                  data-active={activeIndex === index}
                  className="dclHome__display absolute inset-0 flex items-center justify-center text-center text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] tracking-[-.03em] transition-opacity duration-700"
                  style={{ opacity: activeIndex === index ? 1 : 0 }}
                >
                  {renderStatement(item.text, item.highlight)}
                </p>
              ))}
            </div>
            <div className="absolute bottom-16 h-px w-full max-w-[300px] bg-white/15">
              <div ref={progressRuleRef} className="h-full origin-left bg-[#8bbfe8]" style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="dclPhilosophy__mobileList mx-auto flex max-w-[720px] flex-col gap-14 px-6 py-20 sm:px-10">
          {philosophy.map((item, index) => (
            <p
              key={item.text}
              data-testid={`statement-${index}`}
              data-active={true}
              className="dclPhilosophy__mobileStatement dclHome__display text-[clamp(1.8rem,7vw,2.6rem)] leading-[1.1] tracking-[-.03em]"
            >
              {renderStatement(item.text, item.highlight)}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
