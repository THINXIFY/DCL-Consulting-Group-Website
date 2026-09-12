import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { expertise } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Expertise() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openMobile, setOpenMobile] = useState<number | null>(null);
  const imageIndex = activeIndex ?? 0;

  useEffect(() => {
    if (!rootRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclExpertise__row',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section id="expertise" ref={rootRef} aria-labelledby="expertise-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 id="expertise-title" className="dclHome__display max-w-[650px] text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[.92] tracking-[-.04em]">
            Expertise applied to <em className="text-[#c6e3fa] not-italic">the decision.</em>
          </h2>
          <p className="max-w-[260px] text-[14px] leading-6 text-white/48">
            Independent perspective across the decisions that shape businesses, portfolios, and markets.
          </p>
        </div>

        {isDesktop ? (
          <div
            className="grid gap-14 border-t border-white/20 lg:grid-cols-[1.3fr_1fr]"
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div>
              {expertise.map((item, index) => {
                const active = activeIndex === index;
                const dimmed = activeIndex !== null && !active;
                return (
                  <article
                    key={item.title}
                    data-testid={`row-expertise-${slug(item.title)}`}
                    data-active={active}
                    tabIndex={0}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    className="dclExpertise__row group grid cursor-default grid-cols-[1.1fr_.8fr] items-center gap-6 border-b border-white/20 py-8 outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ opacity: dimmed ? 0.4 : 1 }}
                  >
                    <div>
                      <h3 className="dclHome__display text-[clamp(1.8rem,2.8vw,2.9rem)] leading-[.95] tracking-[-.03em]">{item.title}</h3>
                      <span
                        className="mt-3 block h-px bg-[#8bbfe8] transition-transform duration-500"
                        style={{ transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center', width: '96px' }}
                      />
                    </div>
                    <div>
                      <p className="dclHome__eyebrow mb-2 text-white/40">{item.category}</p>
                      <p className="max-w-[340px] text-[15px] leading-6 text-white/60">{item.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="relative hidden aspect-[4/5] w-full overflow-hidden lg:block">
              {expertise.map((item, index) => (
                <img
                  key={item.title}
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: imageIndex === index ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-white/20">
            {expertise.map((item) => {
              const index = expertise.indexOf(item);
              const isOpen = openMobile === index;
              return (
                <div key={item.title} className="border-b border-white/20">
                  <button
                    type="button"
                    data-testid={`button-expertise-${slug(item.title)}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpenMobile(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                  >
                    <span className="dclHome__display text-[1.7rem] leading-none tracking-[-.03em]">{item.title}</span>
                    <ChevronDown size={18} strokeWidth={1.3} className={`shrink-0 text-[#8bbfe8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden text-[14px] leading-6 text-white/60 transition-all duration-500 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.copy}
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
