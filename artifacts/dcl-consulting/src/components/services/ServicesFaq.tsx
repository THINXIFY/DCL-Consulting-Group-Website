import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { servicesFaq } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/general/services-faq.webp';

function slug(question: string) {
  return question
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ServicesFaq() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclServicesFaq__revealLine', '.dclServicesFaq__fadeUp', '.dclServicesFaq__row', '.dclServicesFaq__card'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclServicesFaq__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclServicesFaq__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclServicesFaq__row',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
      );
      gsap.fromTo(
        '.dclServicesFaq__card',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 60%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="services-faq" ref={rootRef} aria-labelledby="services-faq-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="dclHome__eyebrow dclServicesFaq__fadeUp text-[#6b737a]">{servicesFaq.label}</p>
            <h2 id="services-faq-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclServicesFaq__revealLine block">{servicesFaq.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclServicesFaq__revealLine block">{servicesFaq.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="dclServicesFaq__fadeUp max-w-[440px] text-[16px] leading-7 text-[#35404a]">{servicesFaq.intro}</p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="border-t border-[#080a0d]/14 lg:col-span-7">
            {servicesFaq.items.map((item, index) => {
              const isOpen = openIndex === index;
              const id = slug(item.question);
              const buttonId = `services-faq-button-${id}`;
              const panelId = `services-faq-panel-${id}`;
              return (
                <div key={item.question} data-testid={`services-faq-row-${id}`} data-active={isOpen} className="dclServicesFaq__row border-b border-[#080a0d]/14">
                  <button
                    type="button"
                    id={buttonId}
                    data-testid={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <span className="text-[16px] font-medium leading-6 text-[#080a0d] sm:text-[17px]">{item.question}</span>
                    <span className="shrink-0 text-[#8bbfe8]">{isOpen ? <Minus size={18} strokeWidth={1.4} /> : <Plus size={18} strokeWidth={1.4} />}</span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="overflow-hidden transition-all duration-400"
                    style={{ maxHeight: isOpen ? '260px' : '0px', opacity: isOpen ? 1 : 0, paddingBottom: isOpen ? '20px' : '0px' }}
                  >
                    <p className="max-w-[560px] text-[15px] leading-7 text-[#35404a]">{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`dclServicesFaq__card lg:col-span-5 ${isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : ''}`}>
            <div className="border border-[#080a0d]/10">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img loading="lazy" decoding="async"
                  data-testid="img-services-faq-side"
                  className="h-full w-full object-cover object-center"
                  src={SECTION_IMAGE}
                  alt="Empty open-plan office with desks and floor-to-ceiling windows showing a hazy skyline"
                />
              </div>
              <div className="bg-[#c6e3fa] p-7 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d]/60">{servicesFaq.sideCta.label}</p>
                <h3 className="dclHome__display mt-3 text-[1.7rem] leading-[1.1] text-[#080a0d]">{servicesFaq.sideCta.headline}</h3>
                <Link
                  href={servicesFaq.sideCta.cta.href}
                  data-testid="link-services-faq-side-cta"
                  className="group mt-6 inline-flex items-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#080a0d]"
                >
                  {servicesFaq.sideCta.cta.label}
                  <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
