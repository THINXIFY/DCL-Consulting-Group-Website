import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { contactHero } from '@/data/contact-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/general/contact-hero.webp';

export function ContactHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclContactHero__label', '.dclContactHero__rule', '.dclContactHero__revealLine', '.dclContactHero__fadeUp', '.dclContactHero__imageWrap', '.dclContactHero__cta', '.dclContactHero__statement'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.06 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclContactHero__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclContactHero__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, '-=0.25')
        .fromTo('.dclContactHero__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.08 }, '-=0.25')
        .fromTo('.dclContactHero__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 }, '-=0.5')
        .fromTo('.dclContactHero__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.35')
        .fromTo(
          '.dclContactHero__imageWrap',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out' },
          '-=0.75',
        )
        .to(imageRef.current, { scale: 1, duration: 1.3, ease: 'power3.out' }, '<')
        .fromTo('.dclContactHero__statement', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.4');

      if (isDesktop) {
        gsap.to(imageRef.current, {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="contact-hero" ref={rootRef} aria-labelledby="contact-hero-title" className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white">
      <Header />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1560px] flex-col px-6 pb-12 pt-32 sm:px-10 lg:px-16 lg:pb-16 lg:pt-28">
        <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="relative z-10 flex flex-col justify-center lg:col-span-5">
            <p data-testid="text-contact-hero-label" className="dclHome__eyebrow dclContactHero__label text-[#8bbfe8]">
              {contactHero.label}
            </p>
            <div className="dclContactHero__rule mt-5 h-px w-12 origin-left bg-[#8bbfe8]" />
            <h1
              id="contact-hero-title"
              data-testid="text-contact-hero-title"
              className="dclHome__display mt-6 text-[clamp(3rem,6.2vw,5.6rem)] leading-[.98] tracking-[-.03em]"
            >
              <span className="block overflow-hidden"><span className="dclContactHero__revealLine block">{contactHero.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclContactHero__revealLine block">{contactHero.headlineLines[1]}</span></span>
            </h1>
            <p data-testid="text-contact-hero-lead" className="dclContactHero__fadeUp mt-7 max-w-[460px] text-[19px] leading-[1.55] text-white/80 sm:text-[21px]">
              {contactHero.lead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href={contactHero.primaryCta.href}
                data-testid="link-contact-hero-primary"
                className="dclContactHero__cta group inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
              >
                {contactHero.primaryCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
              </a>
              <Link
                href={contactHero.secondaryCta.href}
                data-testid="link-contact-hero-secondary"
                className="dclContactHero__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {contactHero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="dclContactHero__imageWrap relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[3/4]">
              <img
                ref={imageRef}
                data-testid="img-contact-hero"
                className="h-full w-full object-cover object-center"
                src={SECTION_IMAGE}
                alt="Curved glass office tower photographed from street level looking up against a clear sky"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/40 via-transparent to-transparent" />
            </div>
          </div>

          <div className="flex flex-row items-start justify-between gap-8 border-t border-white/10 pt-6 lg:col-span-2 lg:h-full lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pl-7 lg:pt-2">
            <div data-testid="text-contact-hero-statement">
              {contactHero.imageStatementLines.map((line) => (
                <p key={line} className="dclContactHero__statement text-[11px] font-semibold uppercase leading-[1.6] tracking-[.13em] text-white/55">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
