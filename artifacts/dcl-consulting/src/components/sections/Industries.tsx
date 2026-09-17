import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, BarChart3, Cpu, HeartPulse } from 'lucide-react';
import { industries, industriesSection } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';

const ICON_CARDS: Record<string, typeof Cpu> = {
  'Technology & AI': Cpu,
  'Healthcare & Life Sciences': HeartPulse,
  'Financial Services': BarChart3,
};

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Industries() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [featured, technology, healthcare, energy, financial, industrial] = industries;

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclIndustries__bg', '.dclIndustries__eyebrowRule', '.dclIndustries__revealLine', '.dclIndustries__fadeUp', '.dclIndustries__card', '.dclIndustries__cardImage'],
          { clearProps: 'all' },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.dclIndustries__bg, .dclIndustries__overlay', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });

        tl.fromTo('.dclIndustries__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
          .fromTo('.dclIndustries__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
          .fromTo('.dclIndustries__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.35')
          .fromTo('.dclIndustries__fadeUp--body', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.5')
          .fromTo('.dclIndustries__fadeUp--cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.35');

        gsap.fromTo(
          '.dclIndustries__card--featured',
          { autoAlpha: 0, y: 24, scale: 0.985, clipPath: 'inset(0 0 100% 0)' },
          { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.dclIndustries__grid', start: 'top 82%' } },
        );

        gsap.utils.toArray<HTMLElement>('.dclIndustries__card:not(.dclIndustries__card--featured)').forEach((card, i) => {
          const hasImage = card.classList.contains('dclIndustries__card--image');
          gsap.fromTo(
            card,
            hasImage ? { autoAlpha: 0, y: 24, clipPath: 'inset(0 0 100% 0)' } : { autoAlpha: 0, y: 24, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: hasImage ? 'inset(0 0 0% 0)' : undefined,
              duration: 0.9,
              ease: 'power3.out',
              delay: 0.12 + i * 0.1,
              scrollTrigger: { trigger: '.dclIndustries__grid', start: 'top 82%' },
            },
          );
        });

        gsap.to(bgRef.current, {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="industries" ref={rootRef} aria-labelledby="industries-title" className="relative overflow-hidden bg-[#080a0d] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24">
      <div
        ref={bgRef}
        className="dclIndustries__bg absolute inset-0 bg-no-repeat opacity-0"
        style={{ backgroundImage: `url(${industriesSection.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden="true"
      />
      <div
        className="dclIndustries__overlay absolute inset-0 opacity-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,10,13,0.96) 0%, rgba(8,10,13,0.90) 38%, rgba(8,10,13,0.76) 72%, rgba(8,10,13,0.62) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1520px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.9fr_2.15fr] lg:gap-14">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="dclIndustries__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
              <p data-testid="text-industries-eyebrow" className="dclHome__eyebrow dclIndustries__fadeUp dclIndustries__fadeUp--eyebrow text-[#8bbfe8]">
                {industriesSection.eyebrow}
              </p>
            </div>
            <h2 id="industries-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.04] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclIndustries__revealLine block">{industriesSection.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclIndustries__revealLine block text-[#c6e3fa]">{industriesSection.headlineLines[1]}</span></span>
            </h2>
            <p className="dclIndustries__fadeUp dclIndustries__fadeUp--body mt-6 max-w-[400px] text-[16px] leading-7 text-white/58">{industriesSection.supporting}</p>

            <Link
              href={industriesSection.cta.href}
              data-testid="link-industries-view-all"
              className="dclIndustries__fadeUp dclIndustries__fadeUp--cta group mt-8 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              <span className="relative">
                {industriesSection.cta.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[#8bbfe8] transition-transform duration-300 group-hover:scale-x-110" />
              </span>
              <ArrowRight size={14} strokeWidth={1.4} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
            </Link>

            <div className="dclIndustries__fadeUp dclIndustries__fadeUp--cta mt-16 flex items-stretch gap-4">
              <span className="h-14 w-px shrink-0 bg-[#8bbfe8]/40" />
              <div className="flex flex-col gap-1">
                {industriesSection.microLines.map((line) => (
                  <span key={line} className="text-[10px] font-semibold uppercase leading-[1.7] tracking-[.16em] text-white/40">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="dclIndustries__grid grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <Link
              href="/industries"
              data-testid={`card-industry-${slug(featured.name)}`}
              className="dclIndustries__card dclIndustries__card--featured dclIndustries__card--image group relative overflow-hidden border border-[#c6e3fa]/[0.18] transition-colors duration-300 hover:border-[#8bbfe8]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-[520px]"
            >
              <img
                src={featured.image.src}
                alt={featured.image.alt}
                loading="lazy"
                decoding="async"
                className="dclIndustries__cardImage absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d]/92 via-[#080a0d]/35 to-[#080a0d]/10 transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative flex h-full min-h-[280px] flex-col justify-end p-7 sm:p-8">
                <h3 className="dclHome__display text-[1.7rem] leading-[1.1] tracking-[-.02em] text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-[1.9rem]">
                  {featured.name}
                </h3>
                <p className="mt-3 max-w-[340px] text-[14px] leading-6 text-white/65">{featured.context}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#8bbfe8]">
                  Explore Sector
                  <ArrowRight size={13} strokeWidth={1.4} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            {[technology, healthcare].map((item) => {
              const Icon = ICON_CARDS[item.name];
              return (
                <Link
                  key={item.name}
                  href="/industries"
                  data-testid={`card-industry-${slug(item.name)}`}
                  className="dclIndustries__card group relative flex flex-col justify-between overflow-hidden border border-[#c6e3fa]/[0.18] bg-[#0d0f13]/60 p-6 transition-colors duration-300 hover:border-[#8bbfe8]/50 hover:bg-[#0d0f13]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] lg:min-h-[248px] lg:p-7"
                >
                  <Icon size={30} strokeWidth={1.1} className="text-white/25 transition-colors duration-300 group-hover:text-[#8bbfe8]/70" aria-hidden="true" />
                  <div>
                    <h3 className="dclHome__display text-[1.25rem] leading-[1.15] tracking-[-.015em] text-white transition-transform duration-300 group-hover:translate-x-1">
                      {item.name}
                    </h3>
                    <p className="mt-2 max-w-[260px] text-[13px] leading-6 text-white/50">{item.context}</p>
                  </div>
                  <ArrowRight size={14} strokeWidth={1.4} className="mt-4 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#8bbfe8]" aria-hidden="true" />
                </Link>
              );
            })}

            <Link
              href="/industries"
              data-testid={`card-industry-${slug(energy.name)}`}
              className="dclIndustries__card dclIndustries__card--image group relative overflow-hidden border border-[#c6e3fa]/[0.18] transition-colors duration-300 hover:border-[#8bbfe8]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] lg:min-h-[220px]"
            >
              <img
                src={energy.image.src}
                alt={energy.image.alt}
                loading="lazy"
                decoding="async"
                className="dclIndustries__cardImage absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d]/90 via-[#080a0d]/40 to-[#080a0d]/15 transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 lg:p-7">
                <h3 className="dclHome__display text-[1.2rem] leading-[1.15] tracking-[-.015em] text-white transition-transform duration-300 group-hover:translate-x-1">{energy.name}</h3>
                <p className="mt-2 max-w-[240px] text-[13px] leading-6 text-white/60">{energy.context}</p>
              </div>
            </Link>

            {(() => {
              const Icon = ICON_CARDS[financial.name];
              return (
                <Link
                  href="/industries"
                  data-testid={`card-industry-${slug(financial.name)}`}
                  className="dclIndustries__card group relative flex flex-col justify-between overflow-hidden border border-[#c6e3fa]/[0.18] bg-[#0d0f13]/60 p-6 transition-colors duration-300 hover:border-[#8bbfe8]/50 hover:bg-[#0d0f13]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] lg:min-h-[220px] lg:p-7"
                >
                  <Icon size={28} strokeWidth={1.1} className="text-white/25 transition-colors duration-300 group-hover:text-[#8bbfe8]/70" aria-hidden="true" />
                  <div>
                    <h3 className="dclHome__display text-[1.2rem] leading-[1.15] tracking-[-.015em] text-white transition-transform duration-300 group-hover:translate-x-1">
                      {financial.name}
                    </h3>
                    <p className="mt-2 max-w-[240px] text-[13px] leading-6 text-white/50">{financial.context}</p>
                  </div>
                </Link>
              );
            })()}

            <Link
              href="/industries"
              data-testid={`card-industry-${slug(industrial.name)}`}
              className="dclIndustries__card dclIndustries__card--image group relative overflow-hidden border border-[#c6e3fa]/[0.18] transition-colors duration-300 hover:border-[#8bbfe8]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] sm:col-span-2 lg:col-span-2 lg:min-h-[190px]"
            >
              <img
                src={industrial.image.src}
                alt={industrial.image.alt}
                loading="lazy"
                decoding="async"
                className="dclIndustries__cardImage absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080a0d]/92 via-[#080a0d]/55 to-[#080a0d]/20 transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative flex h-full min-h-[160px] flex-col justify-end p-6 lg:p-7">
                <h3 className="dclHome__display text-[1.2rem] leading-[1.15] tracking-[-.015em] text-white transition-transform duration-300 group-hover:translate-x-1">
                  {industrial.name}
                </h3>
                <p className="mt-2 max-w-[380px] text-[13px] leading-6 text-white/60">{industrial.context}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
