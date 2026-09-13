import { useEffect, useRef } from 'react';
import { leadership } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Leadership() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclLeadership__revealLine', '.dclLeadership__fadeUp', '.dclLeadership__rule', '.dclLeadership__nameWipe', '.dclLeadership__principle'],
          { clearProps: 'all' },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } });
      tl.fromTo('.dclLeadership__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclLeadership__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .fromTo('.dclLeadership__nameWipe', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut' }, '-=0.3')
        .fromTo('.dclLeadership__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5');

      gsap.fromTo(
        '.dclLeadership__principle',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out', scrollTrigger: { trigger: '.dclLeadership__principles', start: 'top 82%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="leadership" ref={rootRef} aria-labelledby="leadership-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 border-b border-white/12 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p data-testid="text-leadership-eyebrow" className="dclHome__eyebrow dclLeadership__revealLine mb-6 overflow-hidden text-[#8bbfe8]">
              {leadership.eyebrow}
            </p>
            <h2 id="leadership-title" className="dclHome__display max-w-[560px] text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.035em]">
              <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">{leadership.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclLeadership__revealLine block">{leadership.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="dclLeadership__rule hidden h-px w-full max-w-[220px] bg-white/20 sm:block" />
        </div>

        <div className="mt-16 flex flex-col gap-4 lg:mt-20 lg:flex-row lg:items-baseline lg:justify-between lg:gap-10">
          <div className="dclLeadership__nameWipe overflow-hidden">
            <p
              data-testid="text-leadership-name"
              className="dclHome__display whitespace-nowrap text-[clamp(2.4rem,6.2vw,5.4rem)] leading-[.96] tracking-[-.03em] text-white"
            >
              {leadership.name}
            </p>
          </div>
          <p data-testid="text-leadership-role" className="dclLeadership__fadeUp shrink-0 text-[11px] font-semibold uppercase tracking-[.15em] text-white/55 lg:text-right">
            {leadership.role}
            <br />
            {leadership.company}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 border-t border-white/12 pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-10">
          <p className="dclLeadership__fadeUp text-[19px] leading-8 text-white/85 lg:col-span-6">{leadership.bodyOne}</p>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="dclLeadership__fadeUp max-w-[440px] text-[16px] leading-7 text-white/60">{leadership.bodyTwo}</p>
          </div>
        </div>

        <div className="dclLeadership__principles mt-24 border-t border-white/12 pt-14 lg:mt-32">
          {leadership.principles.map((item, index) => (
            <div
              key={item.title}
              data-testid={`leadership-principle-${index}`}
              className={`dclLeadership__principle border-b border-white/10 py-9 lg:py-11 ${
                index === 0 ? 'lg:max-w-[680px]' : index === 1 ? 'lg:ml-[14%] lg:max-w-[600px]' : ''
              }`}
            >
              <div className="h-px w-10 bg-[#8bbfe8]" />
              <p
                className={`dclHome__display mt-5 leading-[1.05] tracking-[-.02em] text-white ${
                  index === 2 ? 'text-[clamp(2rem,3.6vw,3.1rem)]' : 'text-[clamp(1.7rem,2.8vw,2.3rem)]'
                }`}
              >
                {item.title}
              </p>
              <p className="mt-3 max-w-[520px] text-[15px] leading-6 text-white/55 sm:text-[16px]">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
