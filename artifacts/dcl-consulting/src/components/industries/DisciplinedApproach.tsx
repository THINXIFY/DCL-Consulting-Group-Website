import { useEffect, useRef } from 'react';
import { disciplinedApproach } from '@/data/industries-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

export function DisciplinedApproach() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclDisciplinedApproach__revealLine', '.dclDisciplinedApproach__fadeUp', '.dclDisciplinedApproach__rule', '.dclDisciplinedApproach__column'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclDisciplinedApproach__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclDisciplinedApproach__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
      );
      gsap.fromTo(
        '.dclDisciplinedApproach__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.dclDisciplinedApproach__grid', start: 'top 80%' } },
      );
      gsap.fromTo(
        '.dclDisciplinedApproach__column',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclDisciplinedApproach__grid', start: 'top 80%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="disciplined-approach" ref={rootRef} aria-labelledby="disciplined-approach-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="dclHome__eyebrow dclDisciplinedApproach__fadeUp text-[#9ca3aa]">{disciplinedApproach.label}</p>
        <h2 id="disciplined-approach-title" className="dclHome__display mt-5 max-w-[640px] text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] tracking-[-.03em]">
          <span className="block overflow-hidden"><span className="dclDisciplinedApproach__revealLine block">{disciplinedApproach.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclDisciplinedApproach__revealLine block">{disciplinedApproach.headlineLines[1]}</span></span>
        </h2>
        <p className="dclDisciplinedApproach__fadeUp mt-6 max-w-[520px] text-[16px] leading-7 text-white/60">{disciplinedApproach.copy}</p>

        <div className="dclDisciplinedApproach__rule mt-14 h-px w-full bg-white/15 lg:mt-16" />

        <div className="dclDisciplinedApproach__grid mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 lg:divide-x lg:divide-white/10">
          {disciplinedApproach.columns.map((column, index) => (
            <div key={column.name} data-testid={`disciplined-approach-column-${slug(column.name)}`} className={`dclDisciplinedApproach__column ${index > 0 ? 'lg:pl-10' : ''}`}>
              <p className="dclHome__eyebrow text-[#8bbfe8]">{column.name}</p>
              <p className="mt-3 max-w-[30ch] text-[15px] leading-[1.6] text-white/55">{column.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
