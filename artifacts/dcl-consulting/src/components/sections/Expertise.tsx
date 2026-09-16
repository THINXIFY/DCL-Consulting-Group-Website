import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, BarChart3, Compass, Layers, ShieldCheck } from 'lucide-react';
import { expertiseSection, type ExpertiseIcon } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const ICONS: Record<ExpertiseIcon, typeof BarChart3> = {
  'commercial-analysis': BarChart3,
  'financial-review': Layers,
  'strategic-insight': Compass,
  'risk-evaluation': ShieldCheck,
};

function slug(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Expertise() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            '.dclExpertise__revealLine',
            '.dclExpertise__fadeUp',
            '.dclExpertise__imageWrap',
            '.dclExpertise__col',
            '.dclExpertise__divider',
            '.dclExpertise__stripFadeUp',
          ],
          { clearProps: 'all' },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });
      tl.fromTo('.dclExpertise__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclExpertise__fadeUp', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5');

      gsap.fromTo(
        '.dclExpertise__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dclExpertise__imageWrap', start: 'top 80%' },
        },
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 1.04 },
        {
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclExpertise__imageWrap', start: 'top 80%' },
        },
      );

      gsap.to(imageRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclExpertise__divider',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclExpertise__columns', start: 'top 78%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('.dclExpertise__col').forEach((col, i) => {
        const icon = col.querySelector('.dclExpertise__colIcon');
        const rest = col.querySelectorAll('.dclExpertise__colLabel, .dclExpertise__colHeadline, .dclExpertise__colCopy, .dclExpertise__colLink');
        gsap.fromTo(
          icon,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.08, scrollTrigger: { trigger: col, start: 'top 85%' } },
        );
        gsap.fromTo(
          rest,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out', delay: i * 0.08 + 0.08, scrollTrigger: { trigger: col, start: 'top 85%' } },
        );
      });

      gsap.fromTo(
        '.dclExpertise__stripFadeUp',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclExpertise__strip', start: 'top 85%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="expertise" ref={rootRef} aria-labelledby="expertise-title" className="relative overflow-hidden bg-[#f7f7f4] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[220px] top-[420px] hidden h-[820px] w-[820px] rounded-full border border-[#080a0d]/[0.06] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[420px] top-[560px] hidden h-[1060px] w-[1060px] rounded-full border border-[#080a0d]/[0.04] lg:block"
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[.94fr_1fr] lg:items-stretch lg:gap-16">
          <div className="flex flex-col justify-center">
            <p data-testid="text-expertise-eyebrow" className="dclHome__eyebrow dclExpertise__revealLine mb-6 overflow-hidden text-[#4f718c]">
              <span className="mr-3 inline-block h-px w-6 -translate-y-1 bg-[#4f718c] align-middle" aria-hidden="true" />
              Our Expertise
            </p>
            <h2 id="expertise-title" className="dclHome__display max-w-[560px] text-[clamp(2.6rem,4.6vw,4.2rem)] leading-[1.02] tracking-[-.03em] text-[#080a0d]">
              {expertiseSection.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclExpertise__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="dclExpertise__fadeUp mt-7 max-w-[440px] text-[16px] leading-7 text-[#4b545c] sm:text-[17px]">{expertiseSection.body}</p>
            <a
              href={expertiseSection.cta.href}
              data-testid="link-expertise-explore"
              className="dclExpertise__fadeUp group mt-10 inline-flex w-fit items-center gap-4 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {expertiseSection.cta.label}
              <ArrowRight size={15} strokeWidth={1.4} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
            </a>
          </div>

          <div className="dclExpertise__imageWrap relative aspect-[6/5] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-auto">
            <img
              ref={imageRef}
              className="dclExpertise__image h-full w-full scale-[1.04] object-cover"
              src={expertiseSection.image.src}
              alt={expertiseSection.image.alt}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d]/35 via-transparent to-transparent" />
            <div className="absolute left-7 top-7 flex items-start gap-4 sm:left-9 sm:top-9">
              <span className="mt-1 h-16 w-px shrink-0 bg-white/50" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase leading-[1.7] tracking-[.16em] text-white">
                {expertiseSection.imageStatementLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="dclExpertise__columns relative mt-20 grid grid-cols-1 border-t border-[#080a0d]/12 sm:grid-cols-2 lg:mt-28 xl:grid-cols-4">
          {expertiseSection.areas.map((area, index) => {
            const Icon = ICONS[area.icon];
            return (
              <div
                key={area.label}
                className={`dclExpertise__col relative border-b border-[#080a0d]/12 py-10 pr-8 sm:py-12 ${
                  index % 2 === 1 ? 'sm:pl-10' : ''
                } xl:border-b-0 xl:py-14 ${index > 0 ? 'xl:pl-10' : ''}`}
              >
                {index > 0 && <div className="dclExpertise__divider absolute left-0 top-0 hidden h-full w-px bg-[#080a0d]/12 xl:block" />}
                <a
                  href={area.href}
                  data-testid={`link-expertise-area-${slug(area.label)}`}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                >
                  <span className="dclExpertise__colIcon mb-8 inline-flex text-[#080a0d] transition-transform duration-300 group-hover:-translate-y-[3px] group-focus-visible:-translate-y-[3px]">
                    <Icon size={26} strokeWidth={1.2} />
                  </span>
                  <p className="dclExpertise__colLabel dclHome__eyebrow mb-4 text-[#6b737a] transition-colors duration-300 group-hover:text-[#4f718c] group-focus-visible:text-[#4f718c]">
                    {area.label}
                  </p>
                  <h3 className="dclExpertise__colHeadline dclHome__display text-[1.7rem] leading-[1.08] tracking-[-.02em] text-[#171714] transition-colors duration-300 group-hover:text-[#080a0d]">
                    {area.headlineLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="dclExpertise__colCopy mt-4 max-w-[280px] text-[16px] leading-6 text-[#4b545c]">{area.copy}</p>
                  <span className="dclExpertise__colLink mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.1em] text-[#080a0d]">
                    <span className="relative">
                      Learn more
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-[0.35] bg-[#4f718c] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    </span>
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.4}
                      className="text-[#4f718c] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px]"
                    />
                  </span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="dclExpertise__strip mt-16 grid gap-10 border-t border-[#080a0d]/12 pt-12 lg:mt-20 lg:grid-cols-[1.1fr_.9fr_.5fr] lg:items-end lg:gap-16">
          <div>
            <p className="dclExpertise__stripFadeUp dclHome__eyebrow mb-4 text-[#4f718c]">{expertiseSection.bottomStrip.eyebrow}</p>
            <p className="dclExpertise__stripFadeUp dclHome__display max-w-[440px] text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.12] tracking-[-.02em] text-[#080a0d]">
              {expertiseSection.bottomStrip.statementLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <p className="dclExpertise__stripFadeUp max-w-[360px] text-[16px] leading-6 text-[#4b545c] lg:pb-1">{expertiseSection.bottomStrip.copy}</p>
          <a
            href={expertiseSection.bottomStrip.cta.href}
            data-testid="link-expertise-strip-approach"
            className="dclExpertise__stripFadeUp group inline-flex w-fit items-center gap-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors hover:text-[#4f718c] lg:justify-self-end lg:pb-1"
          >
            {expertiseSection.bottomStrip.cta.label}
            <ArrowRight size={14} strokeWidth={1.4} className="text-[#4f718c] transition-transform duration-300 group-hover:translate-x-[3px]" />
          </a>
        </div>
      </div>
    </section>
  );
}
