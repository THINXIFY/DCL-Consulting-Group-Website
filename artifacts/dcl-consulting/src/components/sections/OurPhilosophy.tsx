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
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
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
    <section
      id="our-philosophy"
      ref={rootRef}
      aria-labelledby="philosophy-title"
      className="text-white"
      style={{ background: 'radial-gradient(140% 100% at 15% 0%, #101216 0%, #0a0b0d 45%, #080a0d 100%)' }}
    >
      {isDesktop ? (
        <div ref={pinWrapRef} className="relative" style={{ height: `${philosophy.length * 90}vh` }}>
          <div data-testid="philosophy-pin" className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden px-6 sm:px-10 lg:px-16">
            <div className="mx-auto w-full max-w-[1100px]">
              <p data-testid="text-philosophy-eyebrow" className="dclHome__eyebrow dclPhilosophy__intro mb-4 text-[#8bbfe8]">
                Our philosophy
              </p>
              <h2 id="philosophy-title" className="dclHome__display dclPhilosophy__intro max-w-[520px] text-[clamp(2rem,3.6vw,3.2rem)] leading-[.98] tracking-[-.03em]">
                Clarity before capital.
              </h2>
              <p className="dclPhilosophy__intro mt-4 max-w-[460px] text-[15px] leading-6 text-white/50">
                Good decisions begin with understanding the opportunity clearly, testing assumptions and identifying what can materially influence the outcome.
              </p>

              <div className="relative mt-16 min-h-[220px] overflow-hidden">
                {philosophy.map((item, index) => {
                  const offset = index < activeIndex ? -20 : index > activeIndex ? 20 : 0;
                  const isActive = activeIndex === index;
                  return (
                    <div
                      key={item.text}
                      data-testid={`statement-${index}`}
                      data-active={isActive}
                      className="absolute inset-x-0 top-0 transition-[opacity,transform] duration-700 ease-out"
                      style={{ opacity: isActive ? 1 : 0, transform: `translateY(${isActive ? 0 : offset}px)` }}
                    >
                      <p className="dclHome__display max-w-[820px] text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[1.05] tracking-[-.03em]">
                        {renderStatement(item.text, item.highlight)}
                      </p>
                      <p data-testid={`support-${index}`} className="mt-6 max-w-[440px] text-[15px] leading-6 text-white/50 sm:text-[16px]">
                        {item.support}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-14 flex items-center gap-8">
                <div className="h-px w-full max-w-[260px] bg-white/15">
                  <div ref={progressRuleRef} className="h-full origin-left bg-[#8bbfe8]" style={{ transform: 'scaleX(0)' }} />
                </div>
                <div className="flex items-center gap-3">
                  {philosophy.map((item, index) => (
                    <span
                      key={item.text}
                      data-testid={`philosophy-tick-${index}`}
                      data-active={activeIndex === index}
                      className="block h-4 w-px bg-white/20 transition-[background-color,transform] duration-400"
                      style={{
                        backgroundColor: activeIndex === index ? '#8bbfe8' : undefined,
                        transform: activeIndex === index ? 'scaleY(1.5)' : 'scaleY(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-24 sm:px-10 sm:py-32">
          <p data-testid="text-philosophy-eyebrow" className="dclHome__eyebrow dclPhilosophy__intro mb-5 text-[#8bbfe8]">
            Our philosophy
          </p>
          <h2 id="philosophy-title" className="dclHome__display dclPhilosophy__intro max-w-[600px] text-[clamp(2.6rem,7vw,3.4rem)] leading-[.96] tracking-[-.03em]">
            Clarity before capital.
          </h2>
          <p className="dclPhilosophy__intro mt-5 max-w-[480px] text-[16px] leading-7 text-white/55">
            Good decisions begin with understanding the opportunity clearly, testing assumptions and identifying what can materially influence the outcome.
          </p>

          <div className="dclPhilosophy__mobileList mt-16 flex flex-col gap-14">
            {philosophy.map((item, index) => (
              <div key={item.text} data-testid={`statement-${index}`} data-active={true} className="dclPhilosophy__mobileStatement">
                <p className="dclHome__display text-[clamp(1.8rem,7vw,2.6rem)] leading-[1.1] tracking-[-.03em]">
                  {renderStatement(item.text, item.highlight)}
                </p>
                <p data-testid={`support-${index}`} className="mt-4 max-w-[480px] text-[15px] leading-6 text-white/50">
                  {item.support}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
