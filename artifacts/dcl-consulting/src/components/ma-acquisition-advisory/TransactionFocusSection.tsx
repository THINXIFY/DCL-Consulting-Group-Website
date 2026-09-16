import { useEffect, useRef } from 'react';
import { transactionFocus } from '@/data/ma-acquisition-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function TransactionFocusSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFocus__revealLine', '.dclFocus__fadeUp', '.dclFocus__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclFocus__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclFocus__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclFocus__column',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="transaction-focus" ref={rootRef} aria-labelledby="ma-focus-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[520px]">
          <p className="dclHome__eyebrow dclFocus__fadeUp text-[#6b737a]">{transactionFocus.label}</p>
          <h2 id="ma-focus-title" className="dclHome__display mt-5 text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclFocus__revealLine block">{transactionFocus.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclFocus__revealLine block">{transactionFocus.headlineLines[1]}</span></span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 divide-y divide-[#080a0d]/14 border-t border-[#080a0d]/14 sm:grid-cols-2 sm:divide-y-0 lg:mt-14 lg:grid-cols-4 lg:divide-x">
          {transactionFocus.areas.map((area) => (
            <div key={area.name} data-testid={`transaction-focus-area-${slug(area.name)}`} className="dclFocus__column py-6 sm:py-8 sm:pr-6 lg:py-0 lg:pl-6 lg:pt-8 lg:first:pl-0">
              <p className="dclHome__eyebrow text-[#8bbfe8]">{area.name}</p>
              <p className="mt-3 max-w-[28ch] text-[16px] leading-6 text-[#35404a]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
