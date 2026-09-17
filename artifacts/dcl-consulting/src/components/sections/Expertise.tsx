import { useEffect, useRef } from 'react';
import { ArrowRight, BarChart3, Building2, ClipboardList, PieChart } from 'lucide-react';
import { expertiseSection, type ExpertiseIcon } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';

const ICONS: Record<ExpertiseIcon, typeof BarChart3> = {
  'bar-chart': BarChart3,
  building: Building2,
  clipboard: ClipboardList,
  'pie-chart': PieChart,
};

function slug(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Expertise() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclExpertise__eyebrowRule', '.dclExpertise__revealLine', '.dclExpertise__fadeUp', '.dclExpertise__colsRule', '.dclExpertise__col', '.dclExpertise__capability'],
          { clearProps: 'all' },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });

        tl.fromTo('.dclExpertise__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
          .fromTo('.dclExpertise__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
          .fromTo('.dclExpertise__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.35')
          .fromTo('.dclExpertise__fadeUp--body', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5')
          .fromTo('.dclExpertise__fadeUp--cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.35')
          .fromTo('.dclExpertise__colsRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1 }, '-=0.5');

        gsap.utils.toArray<HTMLElement>('.dclExpertise__col').forEach((col, i) => {
          const capabilities = col.querySelectorAll('.dclExpertise__capability');
          gsap.fromTo(
            col,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: col, start: 'top 85%' } },
          );
          gsap.fromTo(
            capabilities,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: i * 0.1 + 0.25, scrollTrigger: { trigger: col, start: 'top 85%' } },
          );
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="expertise" ref={rootRef} aria-labelledby="expertise-title" className="bg-[#f2f4f6] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1520px]">
        <div className="flex items-end justify-between gap-6 border-b border-[#080a0d]/12 pb-6">
          <div className="flex items-center gap-3">
            <span className="dclExpertise__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
            <p data-testid="text-expertise-eyebrow" className="dclHome__eyebrow dclExpertise__fadeUp dclExpertise__fadeUp--eyebrow text-[#6b737a]">
              {expertiseSection.eyebrow}
            </p>
          </div>
          <p className="hidden text-[10px] font-semibold uppercase leading-[1.6] tracking-[.15em] text-[#9ca3aa] sm:block">{expertiseSection.microLabel}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[.82fr_1.5fr] lg:gap-16">
          <div className="flex flex-col lg:pt-1">
            <h2 id="expertise-title" data-testid="text-expertise-title" className="dclHome__display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-.03em] text-[#080a0d]">
              {expertiseSection.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclExpertise__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="dclExpertise__fadeUp dclExpertise__fadeUp--body mt-6 max-w-[380px] text-[16px] leading-7 text-[#4b545c]">{expertiseSection.body}</p>
            <a
              href={expertiseSection.cta.href}
              data-testid="link-expertise-explore"
              className="dclExpertise__fadeUp dclExpertise__fadeUp--cta group mt-8 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#4f718c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              <span className="relative">
                {expertiseSection.cta.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-[#8bbfe8] transition-transform duration-300" />
              </span>
              <ArrowRight size={14} strokeWidth={1.4} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
            </a>
          </div>

          <div className="dclExpertise__colsRule relative grid grid-cols-1 gap-x-10 gap-y-10 border-t border-[#080a0d]/12 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {expertiseSection.groups.map((group, index) => {
              const Icon = ICONS[group.icon];
              return (
                <div key={group.heading} data-testid={`expertise-group-${slug(group.heading)}`} className="dclExpertise__col group/col relative">
                  {index > 0 && <div className="absolute -left-4 top-0 hidden h-full w-px bg-[#080a0d]/12 lg:block" aria-hidden="true" />}
                  <Icon
                    size={24}
                    strokeWidth={1.2}
                    className="text-[#080a0d]/70 transition-colors duration-300 group-hover/col:text-[#4f718c]"
                    aria-hidden="true"
                  />
                  <h3 className="dclHome__display mt-5 text-[1.25rem] leading-[1.15] tracking-[-.015em] text-[#171714] transition-transform duration-300 group-hover/col:translate-x-[2px]">
                    {group.heading}
                  </h3>
                  <span className="mt-3 block h-px w-8 origin-left scale-x-100 bg-[#080a0d]/15 transition-all duration-300 group-hover/col:w-12 group-hover/col:bg-[#8bbfe8]" />
                  <p className="mt-4 max-w-[220px] text-[14px] leading-6 text-[#6b737a] transition-colors duration-300 group-hover/col:text-[#4b545c]">{group.copy}</p>

                  <div className="mt-6 border-t border-[#080a0d]/10">
                    {group.capabilities.map((capability) => (
                      <a
                        key={capability.label}
                        href={capability.href}
                        data-testid={`link-expertise-capability-${slug(capability.label)}`}
                        className="dclExpertise__capability group/link block border-b border-[#080a0d]/10 py-2.5 text-[13px] leading-5 text-[#35404a] transition-colors duration-300 hover:text-[#4f718c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8bbfe8]"
                      >
                        <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">{capability.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
