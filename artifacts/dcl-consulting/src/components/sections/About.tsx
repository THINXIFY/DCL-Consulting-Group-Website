import { useEffect, useRef } from 'react';
import { ArrowRight, Building2, FileText, Hash } from 'lucide-react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { FadeInImage } from '@/components/ui/fade-in-image';

import { aboutContent } from '@/data/home-content';

const FACT_ICONS = { building: Building2, file: FileText, hash: Hash } as const;

function slug(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclAbout__rule', '.dclAbout__revealLine', '.dclAbout__fadeUp', '.dclAbout__imageWrap', '.dclAbout__imageOverlay', '.dclAbout__panel', '.dclAbout__cta'],
          { clearProps: 'all' },
        );
        if (imageInnerRef.current) gsap.set(imageInnerRef.current, { clearProps: 'all' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });

        tl.fromTo('.dclAbout__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
          .fromTo('.dclAbout__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
          .fromTo('.dclAbout__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.35')
          .fromTo('.dclAbout__fadeUp--supporting', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
          .fromTo('.dclAbout__rule--divider', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.9 }, '-=0.35')
          .fromTo('.dclAbout__fadeUp--paragraph', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.55')
          .fromTo(
            '.dclAbout__imageWrap',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power4.out' },
            '-=0.6',
          )
          .fromTo(imageInnerRef.current, { scale: 1.06, autoAlpha: 0.82, y: 20 }, { scale: 1, autoAlpha: 1, y: 0, duration: 1.5, ease: 'power4.out' }, '<')
          .fromTo('.dclAbout__imageOverlay', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, '<+=0.15')
          .fromTo('.dclAbout__panel', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.35')
          .fromTo('.dclAbout__cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.3');

        // Subtle post-reveal parallax on the inner image only, so the outer
        // frame (and the panel's absolute positioning against it) never moves.
        if (imageInnerRef.current) {
          gsap.to(imageInnerRef.current, {
            yPercent: 2.5,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={rootRef} aria-labelledby="about-title" className="bg-white px-6 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[.98fr_1fr] lg:items-start lg:gap-x-20">
          <div className="lg:max-w-[540px] lg:pt-2">
            <div className="flex items-center gap-3">
              <span className="dclAbout__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
              <p data-testid="text-about-eyebrow" className="dclHome__eyebrow dclAbout__fadeUp dclAbout__fadeUp--eyebrow text-[#6b737a]">
                {aboutContent.eyebrow}
              </p>
            </div>

            <h2 id="about-title" data-testid="text-about-title" className="dclHome__display mt-6 text-[clamp(2.65rem,4.6vw,3.8rem)] leading-[1.02] tracking-[-.03em] text-[#080a0d]">
              {aboutContent.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclAbout__revealLine block">{line}</span>
                </span>
              ))}
            </h2>

            <p className="dclAbout__fadeUp dclAbout__fadeUp--supporting mt-5 text-[18px] leading-[1.5] text-[#4f5a63]">{aboutContent.supporting}</p>

            <div className="dclAbout__rule dclAbout__rule--divider mt-8 h-px w-full origin-left bg-[#080a0d]/15" />

            <div className="mt-8 space-y-5">
              {aboutContent.body.map((paragraph) => (
                <p key={paragraph} className="dclAbout__fadeUp dclAbout__fadeUp--paragraph text-[17px] leading-[1.65] text-[#171714]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <a
                href={aboutContent.cta.href}
                data-testid="link-about-learn-more"
                className="dclAbout__cta group inline-flex w-fit items-center gap-3 border border-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#171714] hover:bg-[#080a0d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                {aboutContent.cta.label}
                <ArrowRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
              </a>
              <div className="dclAbout__cta flex items-stretch gap-3 border-l border-[#080a0d]/15 pl-4">
                <div className="flex flex-col gap-1">
                  {aboutContent.microStatementLines.map((line) => (
                    <span key={line} className="text-[10px] font-semibold uppercase leading-[1.6] tracking-[.14em] text-[#8a939b]">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="dclAbout__fadeUp mb-6 hidden items-start justify-end gap-4 lg:flex">
              <div className="mt-1.5 h-16 w-px bg-[#8bbfe8]/40" />
              <div className="flex flex-col gap-1 text-right">
                {aboutContent.imageMicroLines.map((line) => (
                  <span key={line} className="text-[10px] font-semibold uppercase leading-[1.7] tracking-[.16em] text-[#6b737a]">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <div className="dclAbout__imageWrap relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:aspect-[4/5] lg:h-[620px]">
              <div ref={imageInnerRef} className="absolute inset-0 h-full w-full">
                <FadeInImage
                  data-testid="img-about"
                  className="h-full w-full object-cover object-[68%_32%]"
                  src={aboutContent.image.src}
                  alt={aboutContent.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="dclAbout__imageOverlay pointer-events-none absolute inset-0 bg-[#080a0d]" aria-hidden="true" />
            </div>

            <div
              data-testid="panel-about-company"
              className="dclAbout__panel relative mt-8 w-full bg-white p-8 shadow-[0_24px_64px_rgba(8,10,13,0.14)] lg:absolute lg:left-[-64px] lg:bottom-14 lg:mt-0 lg:w-[340px] xl:left-[-88px] xl:w-[360px]"
            >
              <p data-testid="text-about-company-name" className="dclHome__display text-[clamp(1.3rem,1.8vw,1.55rem)] leading-[1.2] tracking-[-.02em] text-[#080a0d]">
                {aboutContent.panel.companyName}
              </p>
              <div className="mt-5 h-px w-full bg-[#080a0d]/12" />
              <div className="mt-5 space-y-4">
                {aboutContent.panel.facts.map((fact) => {
                  const Icon = FACT_ICONS[fact.icon];
                  return (
                    <div key={fact.label} data-testid={`about-fact-${slug(fact.label)}`} className="flex items-center gap-3">
                      <Icon size={16} strokeWidth={1.3} className="shrink-0 text-[#8bbfe8]" aria-hidden="true" />
                      <p className="text-[14px] leading-6 text-[#35404a]">{fact.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 h-px w-10 bg-[#8bbfe8]" />
              <p className="mt-4 text-[10px] font-semibold uppercase leading-[1.7] tracking-[.13em] text-[#6b737a]">
                {aboutContent.panel.statementLines[0]}
                <br />
                {aboutContent.panel.statementLines[1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
