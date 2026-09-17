import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { companyInformation } from '@/data/contact-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { FadeInImage } from '@/components/ui/fade-in-image';
import { RequestInfoModal } from './RequestInfoModal';

const IMAGE_SRC = '/images/general/contact-company-meeting.webp';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function CompanyInformation() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isRequestInfoOpen, setRequestInfoOpen] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclCompanyInfo__revealLine', '.dclCompanyInfo__fadeUp', '.dclCompanyInfo__imageWrap', '.dclCompanyInfo__rule', '.dclCompanyInfo__value', '.dclCompanyInfo__cta'],
          { clearProps: 'all' },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } });
        tl.fromTo('.dclCompanyInfo__fadeUp--eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
          .fromTo('.dclCompanyInfo__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.85, stagger: 0.08 }, '-=0.3')
          .fromTo('.dclCompanyInfo__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
          .fromTo(
            '.dclCompanyInfo__imageWrap',
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' },
            '-=0.6',
          )
          .fromTo('.dclCompanyInfo__cta', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.5');

        gsap.utils.toArray<HTMLElement>('.dclCompanyInfo__fact').forEach((row, i) => {
          const rule = row.querySelector('.dclCompanyInfo__rule');
          const value = row.querySelector('.dclCompanyInfo__value');
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: 'left center', duration: 0.7, ease: 'power2.out', delay: i * 0.05, scrollTrigger: { trigger: row, start: 'top 88%' } },
          );
          gsap.fromTo(
            value,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.05 + 0.06, scrollTrigger: { trigger: row, start: 'top 88%' } },
          );
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="company-information" ref={rootRef} aria-labelledby="company-information-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1520px]">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 xl:grid-cols-[29%_35%_36%] xl:gap-x-12 xl:gap-y-0">
          <div className="flex flex-col justify-center">
            <p data-testid="text-company-info-eyebrow" className="dclHome__eyebrow dclCompanyInfo__fadeUp dclCompanyInfo__fadeUp--eyebrow text-[#9ca3aa]">
              {companyInformation.label}
            </p>
            <h2
              id="company-information-title"
              data-testid="text-company-info-headline"
              className="dclHome__display mt-5 text-[clamp(2.3rem,4vw,3.4rem)] leading-[1.04] tracking-[-.03em] text-[#080a0d]"
            >
              {companyInformation.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclCompanyInfo__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <p data-testid="text-company-info-intro" className="dclCompanyInfo__fadeUp mt-6 max-w-[420px] text-[16px] leading-7 text-[#35404a]">
              {companyInformation.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={companyInformation.primaryCta.href}
                data-testid="link-company-info-primary"
                className="dclCompanyInfo__cta group inline-flex items-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {companyInformation.primaryCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
              <a
                href={companyInformation.secondaryCta.href}
                data-testid="link-company-info-secondary"
                className="dclCompanyInfo__cta group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#171714]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {companyInformation.secondaryCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
            </div>

            <button
              type="button"
              data-testid="button-request-more-info"
              onClick={() => setRequestInfoOpen(true)}
              className="dclCompanyInfo__fadeUp group mt-5 inline-flex w-fit items-center gap-2 border border-[#8bbfe8] bg-[#8bbfe8]/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:bg-[#8bbfe8]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Request More Info
              <ArrowUpRight size={14} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </button>

            <div data-testid="text-company-info-statement" className="dclCompanyInfo__fadeUp mt-10 flex items-stretch gap-4 border-l border-[#8bbfe8] pl-4">
              <div className="flex flex-col gap-1.5">
                {companyInformation.statementLines.map((word) => (
                  <span key={word} className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#6b737a]">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="dclCompanyInfo__imageWrap relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4] xl:aspect-[4/5]">
            <FadeInImage
              ref={imageRef}
              data-testid="img-company-info"
              className="h-full w-full object-cover object-center"
              src={IMAGE_SRC}
              alt={companyInformation.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-1">
            <p data-testid="text-company-info-name" className="dclHome__display text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.15] tracking-[-.02em] text-[#080a0d]">
              {companyInformation.companyName}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#6b737a]">{companyInformation.companyTypeLine}</p>
            <p className="text-[14px] leading-6 text-[#6b737a]">{companyInformation.registeredInLine}</p>

            <div className="mt-8 border-t border-[#080a0d]/12">
              {companyInformation.facts.map((fact) => {
                const isAddress = fact.label === 'Registered Office';
                const Wrapper = isAddress ? 'address' : 'div';
                return (
                  <div
                    key={fact.label}
                    data-testid={`company-info-fact-${slug(fact.label)}`}
                    className="dclCompanyInfo__fact grid grid-cols-1 gap-1 border-b border-[#080a0d]/12 py-5 sm:grid-cols-[160px_1fr] sm:items-baseline sm:gap-6"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#8a939b]">{fact.label}</p>
                    <div>
                      <div className="dclCompanyInfo__rule mb-2 h-px w-8 origin-left scale-x-0 bg-[#8bbfe8] sm:hidden" />
                      <Wrapper className="dclCompanyInfo__value text-[15px] not-italic leading-6 text-[#080a0d]">
                        {fact.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </Wrapper>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={companyInformation.companiesHouseHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-company-register"
                className="dclCompanyInfo__cta group inline-flex items-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {companyInformation.companyRegisterCta}
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
              <a
                href={companyInformation.companyRegisterDocumentCta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-company-register-document"
                className="dclCompanyInfo__cta group inline-flex items-center gap-3 border border-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#171714] hover:text-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {companyInformation.companyRegisterDocumentCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
              <a
                href={companyInformation.legalCta.href}
                data-testid="link-company-legal"
                className="dclCompanyInfo__cta group inline-flex items-center gap-3 border border-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#171714] hover:text-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {companyInformation.legalCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
              <a
                href={companyInformation.impressumCta.href}
                data-testid="link-company-impressum"
                className="dclCompanyInfo__cta group inline-flex items-center gap-3 border border-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#171714] hover:text-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {companyInformation.impressumCta.label}
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <RequestInfoModal open={isRequestInfoOpen} onClose={() => setRequestInfoOpen(false)} />
    </section>
  );
}
