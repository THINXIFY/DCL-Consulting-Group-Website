import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { faq } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(question: string) {
  return question.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Faq() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFaq__revealLine', '.dclFaq__fadeUp', '.dclFaq__rule', '.dclFaq__row'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } });
      tl.fromTo('.dclFaq__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' })
        .fromTo('.dclFaq__fadeUp', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' }, '-=0.5')
        .fromTo('.dclFaq__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .fromTo('.dclFaq__row', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, '-=0.2');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isDesktop || !listRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const trigger = ScrollTrigger.create({
      trigger: listRef.current,
      start: 'top 75%',
      end: 'bottom 75%',
      scrub: true,
      onUpdate: (self) => {
        if (progressRef.current) progressRef.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => trigger.kill();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section id="faq" ref={rootRef} aria-labelledby="faq-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
        <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
          <p data-testid="text-faq-eyebrow" className="dclHome__eyebrow dclFaq__revealLine mb-5 overflow-hidden text-[#6b737a]">
            FAQ
          </p>
          <h2 id="faq-title" className="dclHome__display max-w-[420px] text-[clamp(2.6rem,5.2vw,4.4rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
            <span className="block overflow-hidden"><span className="dclFaq__revealLine block">Questions,</span></span>
            <span className="block overflow-hidden"><span className="dclFaq__revealLine block">answered clearly.</span></span>
          </h2>
          <p className="dclFaq__fadeUp mt-8 max-w-[380px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
            A concise overview of how DCL works, the opportunities we assess and what clients can expect from an engagement.
          </p>
          <div className="dclFaq__rule mt-10 h-px w-16 bg-[#8bbfe8]" />
          <a href="#about" data-testid="link-faq-start-conversation" className="dclFaq__fadeUp group mt-10 inline-flex flex-col gap-2 text-[15px] leading-6 text-[#35404a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]">
            <span>Still have a question?</span>
            <span className="inline-flex items-center gap-2 font-semibold text-[#080a0d] transition-colors group-hover:text-[#5583a2]">
              Start a Conversation
              <ArrowRight size={15} strokeWidth={1.4} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        <div ref={listRef} className="relative border-t border-[#080a0d]/15 lg:pl-10">
          {isDesktop && (
            <div className="absolute left-0 top-0 hidden h-full w-px bg-[#080a0d]/8 lg:block">
              <div ref={progressRef} className="h-full w-full origin-top bg-[#8bbfe8]" style={{ transform: 'scaleY(0)' }} />
            </div>
          )}
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            const dimmed = openIndex !== null && !isOpen;
            const id = slug(item.question);
            const buttonId = `faq-button-${id}`;
            const panelId = `faq-panel-${id}`;
            return (
              <div
                key={item.question}
                data-testid={`faq-row-${id}`}
                data-active={isOpen}
                className="dclFaq__row border-b border-[#080a0d]/15 py-2 transition-opacity duration-400"
                style={{ opacity: dimmed ? 0.62 : 1 }}
              >
                <button
                  type="button"
                  id={buttonId}
                  data-testid={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                >
                  <span
                    className="dclHome__display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug transition-transform duration-400"
                    style={{ transform: isOpen ? 'translateX(6px)' : 'translateX(0)', color: isOpen ? '#080a0d' : '#3d4750' }}
                  >
                    {item.question}
                  </span>
                  <span className="shrink-0 text-[#8bbfe8]">
                    {isOpen ? <Minus size={20} strokeWidth={1.4} /> : <Plus size={20} strokeWidth={1.4} />}
                  </span>
                </button>
                <span
                  aria-hidden="true"
                  className="block h-px bg-[#8bbfe8] transition-transform duration-500"
                  style={{ width: '56px', transform: `scaleX(${isOpen ? 1 : 0})`, transformOrigin: 'left center' }}
                />
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isOpen ? '400px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? '16px' : '0px',
                    marginBottom: isOpen ? '24px' : '0px',
                  }}
                >
                  <p className="max-w-[640px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
