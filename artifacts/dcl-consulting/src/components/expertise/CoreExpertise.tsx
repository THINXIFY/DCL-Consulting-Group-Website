import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { coreExpertise } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/general/expertise-core.webp';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

export function CoreExpertise() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? selectedIndex;
  const active = coreExpertise.capabilities[activeIndex] ?? coreExpertise.capabilities[0]!;

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion || !imageRef.current) return;
    ensureGsapRegistered();
    const count = coreExpertise.capabilities.length;
    const y = (activeIndex - (count - 1) / 2) * 3;
    const scale = 1.04 + activeIndex * 0.004;
    gsap.to(imageRef.current, { y, scale, duration: 0.8, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclCoreExp__revealLine', '.dclCoreExp__fadeUp', '.dclCoreExp__row', '.dclCoreExp__imageWrap', '.dclCoreExp__detail'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclCoreExp__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclCoreExp__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      if (isDesktop) {
        gsap.fromTo(
          '.dclCoreExp__imageWrap',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclCoreExp__imageWrap', start: 'top 80%' } },
        );
        gsap.fromTo(
          '.dclCoreExp__row',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
        );
        gsap.fromTo(
          '.dclCoreExp__detail',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
        );
      }
      // Mobile accordion rows are not scroll-animated - they must stay
      // immediately visible and accessible, since the accordion buttons
      // are the only way to reach this content on touch devices.
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="core-expertise" ref={rootRef} aria-labelledby="core-expertise-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-[680px]">
          <p className="dclHome__eyebrow dclCoreExp__fadeUp text-[#9ca3aa]">{coreExpertise.label}</p>
          <h2 id="core-expertise-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.05] tracking-[-.03em]">
            <span className="block overflow-hidden"><span className="dclCoreExp__revealLine block">{coreExpertise.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclCoreExp__revealLine block">{coreExpertise.headlineLines[1]}</span></span>
          </h2>
          <p className="dclCoreExp__fadeUp mt-5 max-w-[560px] text-[16px] leading-7 text-white/55 sm:text-[17px]">{coreExpertise.intro}</p>
        </div>

        {isDesktop ? (
          <div className="mt-14 grid grid-cols-12 items-start gap-x-8 lg:mt-16">
            <div className="col-span-3 border-t border-white/12" onMouseLeave={() => setHoverIndex(null)}>
              {coreExpertise.capabilities.map((capability, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={capability.title}
                    type="button"
                    data-testid={`core-expertise-row-${slug(capability.title)}`}
                    data-active={isActive}
                    onMouseEnter={() => setHoverIndex(index)}
                    onFocus={() => setHoverIndex(index)}
                    onBlur={() => setHoverIndex(null)}
                    onClick={() => setSelectedIndex(index)}
                    className="dclCoreExp__row flex w-full items-center gap-3 border-b border-white/12 py-4 pl-4 text-left outline-none transition-[border-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ borderLeft: isActive ? '2px solid #8bbfe8' : '2px solid transparent' }}
                  >
                    <span className="flex-1 text-[14.5px] font-medium leading-[1.3] transition-colors duration-300" style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,.45)' }}>
                      {capability.title}
                    </span>
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.3}
                      aria-hidden="true"
                      className="shrink-0 text-[#8bbfe8] transition-all duration-300"
                      style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translate(2px,-2px)' : 'translate(0,0)' }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="col-span-5">
              <div className="dclCoreExp__imageWrap relative aspect-[4/5] w-full overflow-hidden">
                <img
                  ref={imageRef}
                  data-testid="img-core-expertise"
                  className="h-full w-full object-cover object-center"
                  src={SECTION_IMAGE}
                  alt="Close-up of a sandstone building facade with tall vertical fins casting sharp shadows in warm sunlight"
                />
              </div>
            </div>

            <div className="dclCoreExp__detail col-span-4 pl-2">
              <p data-testid="text-core-expertise-eyebrow" className="dclHome__eyebrow text-[#8bbfe8]">
                Featured Expertise
              </p>
              <h3 data-testid="text-core-expertise-headline" className="dclHome__display mt-5 text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.08] tracking-[-.02em]">
                {active.headline}
              </h3>
              <p data-testid="text-core-expertise-copy" className="mt-5 max-w-[42ch] text-[16px] leading-7 text-white/65">
                {active.copy}
              </p>
              <Link
                href={active.href}
                data-testid="link-core-expertise-cta"
                className="group mt-7 inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
              >
                {active.ctaLabel}
                <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
              </Link>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/12 pt-6">
                {coreExpertise.statementLines.map((word) => (
                  <span key={word} className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/30">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 border-t border-white/12">
            {coreExpertise.capabilities.map((capability, index) => {
              const expanded = expandedIndex === index;
              return (
                <div key={capability.title} data-testid={`core-expertise-accordion-${slug(capability.title)}`} className="border-b border-white/12">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`core-expertise-panel-${slug(capability.title)}`}
                    onClick={() => setExpandedIndex(expanded ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <p className="dclHome__display text-[1.4rem] leading-snug text-white">{capability.title}</p>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 text-white/60 transition-transform duration-400"
                      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  <div
                    id={`core-expertise-panel-${slug(capability.title)}`}
                    className="overflow-hidden transition-[max-height] duration-500 ease-out"
                    style={{ maxHeight: expanded ? '320px' : '0px' }}
                  >
                    <p className="max-w-[60ch] pb-5 text-[16px] leading-7 text-white/65">{capability.copy}</p>
                    <Link
                      href={capability.href}
                      data-testid={`core-expertise-accordion-cta-${slug(capability.title)}`}
                      className="group mb-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#8bbfe8]"
                    >
                      {capability.ctaLabel}
                      <ArrowUpRight size={14} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
