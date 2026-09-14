import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { industriesWeAssess, type Sector } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const PLACEHOLDER_IMAGE = 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp';

// Three staggered editorial columns (5/3/4 of 12) rather than an equal
// three-up grid, each offset vertically at desktop so the index reads as
// composed rather than mechanical. Sectors stay in approved reading
// order, chunked column by column.
const COLUMN_SPAN_CLASSES = ['md:col-span-1 lg:col-span-5', 'md:col-span-1 lg:col-span-3 lg:mt-24', 'md:col-span-2 lg:col-span-4 lg:mt-12'];
const COLUMN_RANGES: Array<[number, number]> = [
  [0, 4],
  [4, 8],
  [8, 12],
];

// One shared placeholder image, differentiated per sector only by crop
// focal point until real sector photography is supplied - swap in a
// per-sector `image` field on the data later without touching this logic.
const FOCAL_POSITIONS = [
  '30% 35%',
  '65% 30%',
  '40% 55%',
  '55% 40%',
  '35% 60%',
  '60% 45%',
  '45% 30%',
  '30% 50%',
  '55% 55%',
  '40% 35%',
  '60% 60%',
  '50% 45%',
];

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

interface SectorItemProps {
  sector: Sector;
  index: number;
  isActive: boolean;
  isDesktop: boolean;
  onEnter: (index: number) => void;
  onLeave: () => void;
  onClick: (index: number) => void;
}

function SectorItem({ sector, index, isActive, isDesktop, onEnter, onLeave, onClick }: SectorItemProps) {
  return (
    <button
      type="button"
      data-testid={`sector-field-${slug(sector.name)}`}
      data-active={isActive}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(index)}
      onBlur={onLeave}
      onClick={() => onClick(index)}
      className="dclSectors__field border-t border-white/14 py-6 text-left outline-none transition-transform duration-500 first:border-t-0 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
      style={{ transform: isActive && isDesktop ? 'translateX(6px)' : 'translateX(0)' }}
    >
      <span className="dclSectors__rule block h-px w-6 bg-white/25" />
      <span
        className="dclHome__display mt-4 block leading-[1.15] transition-colors duration-400"
        style={{ fontSize: 'clamp(1.15rem,1.7vw,1.55rem)', color: isActive ? '#ffffff' : 'rgba(255,255,255,.42)' }}
      >
        {sector.name}
      </span>
      <span className="mt-3 block h-px transition-all duration-500" style={{ width: isActive ? '32px' : '0px', backgroundColor: '#8bbfe8' }} />
      <span
        className="mt-2 block overflow-hidden text-[13px] font-medium leading-5 text-[#8bbfe8] transition-all duration-400"
        style={{ maxHeight: isActive ? '20px' : '0px', opacity: isActive ? 1 : 0 }}
      >
        {sector.supportingLine}
      </span>
    </button>
  );
}

export function IndustriesWeAssess() {
  const rootRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const mountedImageRef = useRef(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTabletUp = useMediaQuery('(min-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollIndexRef = useRef(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [clickIndex, setClickIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? clickIndex ?? scrollIndex;
  const active = industriesWeAssess.sectors[activeIndex] ?? industriesWeAssess.sectors[0]!;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!fieldRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: fieldRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, industriesWeAssess.sectors.length);
          if (next !== scrollIndexRef.current) {
            scrollIndexRef.current = next;
            setScrollIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop) return;
    const img = imgRef.current;
    if (!img) return;
    const focal = FOCAL_POSITIONS[activeIndex] ?? '50% 50%';

    if (prefersReducedMotion) {
      img.style.objectPosition = focal;
      gsap.set(img, { clearProps: 'all' });
      return;
    }

    ensureGsapRegistered();
    if (!mountedImageRef.current) {
      mountedImageRef.current = true;
      img.style.objectPosition = focal;
      gsap.set(img, { autoAlpha: 1, scale: 1, clipPath: 'inset(0 0 0% 0)' });
      return;
    }

    // Single layer, always killed and re-targeted - immune to ending up
    // fully hidden if scroll fires several sector changes in a row
    // before an earlier transition settles.
    gsap.killTweensOf(img);
    gsap
      .timeline()
      .to(img, { autoAlpha: 0, y: -6, duration: 0.2, ease: 'power2.out' })
      .call(() => {
        img.style.objectPosition = focal;
      })
      .fromTo(img, { clipPath: 'inset(0 0 100% 0)', scale: 1.04 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSectors__revealLine', '.dclSectors__fadeUp', '.dclSectors__closingLine', '.dclSectors__rule'], { clearProps: 'all' });
        // Field buttons carry their own React-managed transform inline
        // style - clearProps:'all' would wipe that too, so only the
        // animated opacity is reset here, not the whole style attribute.
        gsap.set('.dclSectors__field', { clearProps: 'opacity,visibility' });
        return;
      }
      gsap.fromTo(
        '.dclSectors__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclSectors__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      // autoAlpha only, never x/y/transform - these buttons separately own
      // a React-managed `transform: translateX()` for the active-hover
      // shift, and GSAP transform tweens would fight that for control of
      // the same CSS property.
      gsap.fromTo(
        '.dclSectors__field',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, stagger: 0.025, ease: 'power2.out', scrollTrigger: { trigger: fieldRef.current, start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclSectors__rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, stagger: 0.05, ease: 'power2.out', transformOrigin: 'left center', scrollTrigger: { trigger: fieldRef.current, start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclSectors__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclSectors__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  function handleEnter(index: number) {
    setHoverIndex(index);
  }
  function handleLeave() {
    setHoverIndex(null);
  }
  function handleClick(index: number) {
    setClickIndex(index);
    setHoverIndex(null);
  }

  return (
    <section id="industries-we-assess" ref={rootRef} aria-labelledby="industries-we-assess-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="dclHome__eyebrow dclSectors__revealLine text-[#8bbfe8]">{industriesWeAssess.eyebrow}</p>
        <h2 id="industries-we-assess-title" className="dclHome__display mt-6 max-w-[900px] text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.03] tracking-[-.035em]">
          <span className="block overflow-hidden"><span className="dclSectors__revealLine block">{industriesWeAssess.headlineLines[0]}</span></span>
          <span className="block overflow-hidden"><span className="dclSectors__revealLine block">{industriesWeAssess.headlineLines[1]}</span></span>
        </h2>
        <p className="dclSectors__fadeUp mt-6 max-w-[62ch] text-[16px] leading-7 text-white/60 sm:text-[17px]">{industriesWeAssess.intro}</p>

        {isTabletUp ? (
          <>
            <div ref={fieldRef} className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-20 md:grid-cols-2 lg:grid-cols-12" aria-label="Industries DCL assesses">
              {COLUMN_RANGES.map(([start, end], colIndex) => (
                <div key={colIndex} className={`flex flex-col ${COLUMN_SPAN_CLASSES[colIndex]}`}>
                  {industriesWeAssess.sectors.slice(start, end).map((sector, i) => {
                    const index = start + i;
                    return (
                      <SectorItem
                        key={sector.name}
                        sector={sector}
                        index={index}
                        isActive={activeIndex === index}
                        isDesktop={isDesktop}
                        onEnter={handleEnter}
                        onLeave={handleLeave}
                        onClick={handleClick}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-20 grid grid-cols-1 gap-y-10 border-t border-white/14 pt-14 lg:mt-24 lg:grid-cols-12 lg:items-center lg:gap-x-14">
              <div className="lg:col-span-7" aria-live="polite">
                <p data-testid="sector-detail-supporting" className="text-[13px] font-medium uppercase tracking-[.1em] text-[#8bbfe8]">
                  {active.supportingLine}
                </p>
                <p data-testid="sector-detail-name" className="dclHome__display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] tracking-[-.02em] text-white">
                  {active.name}
                </p>
                <p data-testid="sector-detail-description" className="mt-5 max-w-[62ch] text-[16px] leading-7 text-white/70 sm:text-[17px]">
                  {active.description}
                </p>
              </div>
              {isDesktop && (
                <div className="relative aspect-[4/3] overflow-hidden lg:col-span-4 lg:col-start-9">
                  <img
                    ref={imgRef}
                    src={PLACEHOLDER_IMAGE}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05]"
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-14 border-t border-white/12">
            {industriesWeAssess.sectors.map((sector, index) => {
              const expanded = expandedIndex === index;
              return (
                <div key={sector.name} data-testid={`sector-accordion-${slug(sector.name)}`} className="border-b border-white/12">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`sector-panel-${slug(sector.name)}`}
                    onClick={() => setExpandedIndex(expanded ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <div>
                      <p className="dclHome__display text-[1.3rem] leading-snug text-white">{sector.name}</p>
                      <p className="mt-2 text-[14px] font-medium text-[#8bbfe8]">{sector.supportingLine}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 text-white/60 transition-transform duration-400"
                      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  <div
                    id={`sector-panel-${slug(sector.name)}`}
                    className="overflow-hidden transition-[max-height] duration-500 ease-out"
                    style={{ maxHeight: expanded ? '220px' : '0px' }}
                  >
                    <p className="max-w-[60ch] pb-6 text-[16px] leading-7 text-white/70">{sector.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div data-testid="text-sectors-closing" className="dclSectors__closing mt-20 border-t border-white/12 pt-14 lg:mt-24">
          {industriesWeAssess.closingLines.map((line) => (
            <p key={line} className="dclSectors__closingLine dclHome__display max-w-[820px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] tracking-[-.025em] text-white">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
