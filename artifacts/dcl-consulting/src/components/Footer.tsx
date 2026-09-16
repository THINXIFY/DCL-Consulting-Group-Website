import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { footerBrand, footerClosing, footerContact, footerLegalLinks, footerNavLinks, footerServicesViewAll, preFooterCta } from '@/data/footer-content';
import { allMegaMenuServices } from '@/data/services-nav-content';
import { companyFacts } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

const SECTION_IMAGE = '/images/general/footer.webp';
const FOOTER_BACKGROUND_IMAGE = 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/ChatGPT-Image-Sep-15-2026-02_34_24-PM.webp';
const LOGO_SRC = '/images/brand/dcl-logo.png';

const REGISTRATION_FACTS = companyFacts.filter((fact) => fact.label !== 'Director');

function slug(label: string) {
  return label.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

function Mark() {
  return <img src={LOGO_SRC} data-testid="img-footer-logo" alt="DCL Consulting and Investments Limited" className="h-8 w-auto sm:h-9" />;
}

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const year = new Date().getFullYear();

  useMagnetic(ctaRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclFooter__label', '.dclFooter__rule', '.dclFooter__revealLine', '.dclFooter__fadeUp', '.dclFooter__imageWrap', '.dclFooter__cta', '.dclFooter__column'],
          { clearProps: 'all' },
        );
        if (bgImageRef.current) gsap.set(bgImageRef.current, { clearProps: 'all' });
        return;
      }

      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { autoAlpha: 0, scale: 1.12 },
          { autoAlpha: 0.6, scale: 1.05, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 90%' } },
        );
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 85%' } });
      tl.fromTo('.dclFooter__label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('.dclFooter__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.6 }, '-=0.25')
        .fromTo('.dclFooter__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.08 }, '-=0.3')
        .fromTo('.dclFooter__fadeUp', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, '-=0.5')
        .fromTo('.dclFooter__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, '-=0.35')
        .fromTo(
          '.dclFooter__imageWrap',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.out' },
          '-=0.6',
        );

      gsap.fromTo(
        '.dclFooter__column',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: '.dclFooter__columns', start: 'top 92%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer ref={rootRef} className="relative overflow-hidden bg-[#171714] text-white">
      <div className="dclFooter__bgWrap pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          ref={bgImageRef}
          data-testid="img-footer-background"
          className="h-full w-full scale-105 object-cover object-center opacity-60"
          src={FOOTER_BACKGROUND_IMAGE}
          alt=""
        />
        <div className="absolute inset-0 bg-[#171714]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171714] via-[#171714]/30 to-[#171714]" />
      </div>

      {/* Pre-footer CTA */}
      <div className="relative z-10 px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-5">
              <p data-testid="text-footer-cta-label" className="dclHome__eyebrow dclFooter__label text-[#8bbfe8]">
                {preFooterCta.label}
              </p>
              <div className="dclFooter__rule mt-4 h-px w-12 origin-left bg-[#8bbfe8]" />
              <h2 data-testid="text-footer-cta-headline" className="dclHome__display mt-6 text-[clamp(2.1rem,3.8vw,3.2rem)] leading-[1.06] tracking-[-.03em]">
                <span className="block overflow-hidden"><span className="dclFooter__revealLine block">{preFooterCta.headlineLines[0]}</span></span>
                <span className="block overflow-hidden"><span className="dclFooter__revealLine block">{preFooterCta.headlineLines[1]}</span></span>
              </h2>
              <p data-testid="text-footer-cta-supporting" className="dclFooter__fadeUp mt-5 max-w-[420px] text-[16px] leading-7 text-white/60">
                {preFooterCta.supporting}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  ref={ctaRef}
                  href={preFooterCta.primaryCta.href}
                  data-testid="link-footer-cta-primary"
                  className="dclFooter__cta group inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
                >
                  {preFooterCta.primaryCta.label}
                  <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
                </a>
                <Link
                  href={preFooterCta.secondaryCta.href}
                  data-testid="link-footer-cta-secondary"
                  className="dclFooter__cta group inline-flex items-center gap-2 border-b border-white/40 px-1 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white/75 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                >
                  {preFooterCta.secondaryCta.label}
                  <ArrowUpRight size={13} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-3 lg:border-l lg:border-white/12 lg:pl-8">
              <div data-testid="text-footer-cta-vocabulary" className="dclFooter__fadeUp flex flex-col gap-1">
                {preFooterCta.vocabularyLines.map((line) => (
                  <span key={line} className="text-[13px] font-semibold uppercase tracking-[.13em] text-white/55">
                    {line}
                  </span>
                ))}
                <span className="text-[13px] font-semibold uppercase tracking-[.13em] text-[#8bbfe8]">{preFooterCta.vocabularyEmphasis}</span>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="dclFooter__imageWrap relative aspect-[4/3] w-full overflow-hidden">
                <img
                  ref={imageRef}
                  data-testid="img-footer-cta"
                  className="h-full w-full scale-105 object-cover object-center"
                  src={SECTION_IMAGE}
                  alt="Dark building facade at dusk with a few warmly lit windows and curved balcony edges"
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
                <div data-testid="text-footer-cta-image-statement" className="absolute bottom-5 right-5 text-right">
                  {preFooterCta.imageStatementLines.map((line) => (
                    <p key={line} className="text-[11px] font-semibold uppercase leading-[1.5] tracking-[.13em] text-white">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative z-10 border-t border-white/12 px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <nav aria-label="Footer" className="dclFooter__columns grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="dclFooter__column lg:col-span-4">
              <Link href="/" data-testid="link-footer-home" aria-label="DCL Consulting and Investments Limited home">
                <Mark />
              </Link>
              <div className="mt-6">
                {footerBrand.statementLines.map((line) => (
                  <p key={line} className="text-[11px] font-semibold uppercase leading-[1.6] tracking-[.13em] text-[#8bbfe8]">
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-4 max-w-[320px] text-[15px] leading-6 text-white/55">{footerBrand.copy}</p>

              <div className="mt-7 flex flex-col gap-2">
                {REGISTRATION_FACTS.map((fact) => (
                  <p key={fact.label} data-testid={`text-footer-fact-${slug(fact.label)}`} className="text-[13px] leading-5 text-white/35">
                    <span className="text-white/25">{fact.label}: </span>
                    {fact.value}
                  </p>
                ))}
              </div>
            </div>

            <div className="dclFooter__column lg:col-span-2">
              <p className="dclHome__eyebrow text-white/35">Navigation</p>
              <ul className="mt-5 flex flex-col gap-3">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`link-footer-nav-${slug(link.label)}`}
                      className="group inline-block text-[15px] text-white/70 outline-none transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                    >
                      {link.label}
                      <span className="block h-px w-0 bg-[#8bbfe8] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dclFooter__column lg:col-span-3">
              <p className="dclHome__eyebrow text-white/35">Services</p>
              <ul className="mt-5 flex flex-col gap-3">
                {allMegaMenuServices.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      data-testid={`link-footer-service-${slug(service.label)}`}
                      className="group inline-block text-[15px] text-white/70 outline-none transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                    >
                      {service.label}
                      <span className="block h-px w-0 bg-[#8bbfe8] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={footerServicesViewAll.href}
                data-testid="link-footer-view-all-services"
                className="group mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.1em] text-[#8bbfe8] outline-none transition-colors duration-300 hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {footerServicesViewAll.label}
                <ArrowUpRight size={13} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </Link>
            </div>

            <div className="dclFooter__column lg:col-span-3">
              <p className="dclHome__eyebrow text-white/35">Contact</p>
              <p className="mt-5 max-w-[260px] text-[15px] leading-6 text-white/60">{footerContact.intro}</p>
              <a
                href={footerContact.cta.href}
                data-testid="link-footer-contact-cta"
                className="group mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.1em] text-[#8bbfe8] outline-none transition-colors duration-300 hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {footerContact.cta.label}
                <ArrowUpRight size={13} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
            </div>
          </nav>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <p data-testid="text-footer-copyright" className="text-[11px] uppercase tracking-[.12em] text-white/35">
                &copy; {year} DCL Consulting and Investments Limited. All rights reserved.
              </p>
              {footerLegalLinks.length > 0 && (
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {footerLegalLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      data-testid={`link-footer-legal-${link.label.toLowerCase().replaceAll(' ', '-')}`}
                      className="text-[11px] uppercase tracking-[.12em] text-white/35 outline-none transition-colors duration-300 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <p data-testid="text-footer-closing" className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">
              {footerClosing}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
