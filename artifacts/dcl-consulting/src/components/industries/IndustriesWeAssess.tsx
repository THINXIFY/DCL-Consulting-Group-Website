import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { industriesWeAssess } from '@/data/industries-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const PLACEHOLDER_IMAGE = 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp';

// Varying spans across a 6-column canvas so the field reads as designed
// typography rather than a mechanically uniform grid - longer sector
// names naturally claim more width. Each row's pair always sums to 6 so
// the canvas never leaves an unexplained gap on the right.
const SECTOR_SPANS = [4, 2, 3, 3, 2, 4, 2, 4, 3, 3, 4, 2];

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
      gsap.set(img, { autoAlpha: 1, scale: 1 });
      return;
    }

    // A single layer, always killed and re-targeted rather than a
    // two-layer crossfade - immune to ending up fully hidden if scroll
    // fires several index changes before an earlier transition settles.
    gsap.killTweensOf(img);
    gsap
      .timeline()
      .to(img, { autoAlpha: 0, scale: 1.02, duration: 0.3, ease: 'power2.out' })
      .call(() => {
        img.style.objectPosition = focal;
      })
      .fromTo(img, { scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
  }, [activeIndex, isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSectors__revealLine', '.dclSectors__fadeUp', '.dclSectors__closingLine'], { clearProps: 'all' });
        // Field buttons carry their own React-managed gridColumn/transform
        // inline styles - clearProps:'all' would wipe those too, so only
        // the animated opacity is reset here, not the whole style attribute.
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
        { autoAlpha: 1, duration: 0.55, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: fieldRef.current, start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclSectors__closingLine',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclSectors__closing', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

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
            <div
              ref={fieldRef}
              className="mt-16 grid grid-cols-2 gap-x-8 lg:mt-20 lg:grid-cols-6 lg:[perspective:1400px]"
              aria-label="Industries DCL assesses"
            >
              {industriesWeAssess.sectors.map((sector, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={sector.name}
                    type="button"
                    data-testid={`sector-field-${slug(sector.name)}`}
                    data-active={isActive}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onFocus={() => setHoverIndex(index)}
                    onBlur={() => setHoverIndex(null)}
                    onClick={() => {
                      setClickIndex(index);
                      setHoverIndex(null);
                    }}
                    className="dclSectors__field group border-t border-white/14 py-5 text-left outline-none transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-[#8bbfe8] lg:py-6"
                    style={{ gridColumn: isDesktop ? `span ${SECTOR_SPANS[index] ?? 3}` : undefined, transform: isActive && isDesktop ? 'translateX(6px)' : 'translateX(0)' }}
                  >
                    <span
                      className="dclHome__display block text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.15] transition-colors duration-400"
                      style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,.4)' }}
                    >
                      {sector.name}
                    </span>
                    <span className="mt-3 block h-px transition-all duration-500" style={{ width: isActive ? '40px' : '16px', backgroundColor: isActive ? '#8bbfe8' : 'rgba(255,255,255,.2)' }} />
                    <span
                      className="mt-3 block text-[13px] font-medium leading-5 text-[#8bbfe8] transition-opacity duration-400"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {sector.supportingLine}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-16 grid grid-cols-1 gap-y-10 bg-white/[.03] px-6 py-12 sm:px-10 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:px-12">
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
