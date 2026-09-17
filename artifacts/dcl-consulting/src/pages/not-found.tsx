import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { notFoundContent } from '@/data/not-found-content';
import { Seo } from '@/components/Seo';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export default function NotFound() {
  const [location] = useLocation();
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclNotFound__label', '.dclNotFound__rule', '.dclNotFound__revealLine', '.dclNotFound__fadeUp', '.dclNotFound__cta', '.dclNotFound__imageWrap', '.dclNotFound__statement', '.dclNotFound__quickLink'],
          { clearProps: 'all' },
        );
        if (imageRef.current) gsap.set(imageRef.current, { clearProps: 'transform' });
        return;
      }

      gsap.set(imageRef.current, { scale: 1.08 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.dclNotFound__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
        .fromTo('.dclNotFound__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, '-=0.2')
        .fromTo('.dclNotFound__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, '-=0.2')
        .fromTo('.dclNotFound__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.5')
        .fromTo('.dclNotFound__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.3')
        .fromTo('.dclNotFound__imageWrap', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.out' }, '-=0.8')
        .to(imageRef.current, { scale: 1, duration: 1.1, ease: 'power3.out' }, '<')
        .fromTo('.dclNotFound__statement', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, '-=0.3')
        .fromTo('.dclNotFound__quickLink', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, '-=0.2');
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <Seo title="Page Not Found | DCL Consulting" description="The page you are looking for does not exist. Explore DCL Consulting's advisory services, insights and company information instead." path={location} noindex />
      <section id="not-found-hero" ref={rootRef} aria-labelledby="not-found-title" className="relative overflow-hidden bg-[#080a0d] text-white">
        <span
          aria-hidden="true"
          className="dclHome__display pointer-events-none absolute -bottom-[6%] -left-[2%] select-none text-[clamp(10rem,26vw,20rem)] leading-none tracking-[-.04em] text-white/[0.035]"
        >
          404
        </span>

        <Header />
        <div className="relative mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-32 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-16 lg:pb-20 lg:pt-40">
          <div className="max-w-[560px]">
            <p data-testid="text-not-found-label" className="dclHome__eyebrow dclNotFound__label text-[#8bbfe8]">
              {notFoundContent.label}
            </p>
            <div className="dclNotFound__rule mt-4 h-px w-12 origin-left bg-[#8bbfe8]" />
            <h1 id="not-found-title" data-testid="text-not-found-title" className="dclHome__display mt-6 text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[1.02] tracking-[-.03em]">
              {notFoundContent.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclNotFound__revealLine block">{line}</span>
                </span>
              ))}
            </h1>
            <p data-testid="text-not-found-body" className="dclNotFound__fadeUp mt-7 max-w-[460px] text-[16px] leading-7 text-white/70 sm:text-[17px]">
              {notFoundContent.body}
            </p>

            <div className="dclNotFound__fadeUp mt-8 flex flex-col gap-1 text-[13px] italic leading-[1.7] text-white/40">
              {notFoundContent.editorialStatementLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                ref={ctaRef}
                href={notFoundContent.primaryCta.href}
                data-testid="link-not-found-primary"
                className="dclNotFound__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] hover:shadow-[0_8px_28px_rgba(139,191,232,.4)] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
              >
                {notFoundContent.primaryCta.label}
                <ArrowRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
              </a>
              <Link
                href={notFoundContent.secondaryCta.href}
                data-testid="link-not-found-secondary"
                className="dclNotFound__cta inline-flex items-center border-b border-white/45 px-1 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {notFoundContent.secondaryCta.label}
              </Link>
            </div>
            <Link
              href={notFoundContent.tertiaryLink.href}
              data-testid="link-not-found-tertiary"
              className="dclNotFound__cta group mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/50 transition-colors duration-300 hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {notFoundContent.tertiaryLink.label}
              <ArrowUpRight size={13} strokeWidth={1.3} className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </Link>
          </div>

          <div className="dclNotFound__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-[520px]">
            <img
              ref={imageRef}
              data-testid="img-not-found"
              className="h-full w-full object-cover"
              src={notFoundContent.image.src}
              alt={notFoundContent.image.alt}
              loading="eager"
              decoding="async"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
          </div>
        </div>

        <div className="relative border-t border-white/12 px-6 py-8 sm:px-10 lg:px-16">
          <nav aria-label="Quick navigation" className="mx-auto flex max-w-[1560px] flex-wrap items-center gap-x-10 gap-y-4">
            {notFoundContent.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-not-found-quick-${link.label.toLowerCase()}`}
                className="dclNotFound__quickLink group inline-flex items-center gap-2 border-b border-transparent text-[11px] font-semibold uppercase tracking-[.13em] text-white/70 transition-colors duration-300 hover:border-[#8bbfe8] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {link.label}
                <ArrowUpRight size={12} strokeWidth={1.3} className="text-[#8bbfe8] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </Link>
            ))}
          </nav>
          <p data-testid="text-not-found-closing" className="mx-auto mt-6 max-w-[1560px] text-[11px] font-semibold uppercase tracking-[.15em] text-white/30">
            {notFoundContent.closing}
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
