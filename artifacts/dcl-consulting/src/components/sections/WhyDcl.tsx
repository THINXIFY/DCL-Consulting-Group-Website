import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BarChart3, Eye, Globe, Layers, MessageCircle } from 'lucide-react';
import { whyDcl, whyDclImage, whyDclSection, type QualityIcon } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const ICONS: Record<QualityIcon, typeof Eye> = {
  eye: Eye,
  'bar-chart': BarChart3,
  layers: Layers,
  message: MessageCircle,
  globe: Globe,
};

function slug(title: string) {
  return title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function WhyDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclWhy__eyebrowRule', '.dclWhy__revealLine', '.dclWhy__fadeUp', '.dclWhy__imageWrap', '.dclWhy__rule', '.dclWhy__row'],
          { clearProps: 'all' },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } });

        tl.fromTo('.dclWhy__eyebrowRule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 })
          .fromTo('.dclWhy__fadeUp--eyebrow', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.6 }, '<')
          .fromTo('.dclWhy__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.35')
          .fromTo('.dclWhy__fadeUp--body', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
          .fromTo(
            '.dclWhy__imageWrap',
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1.35, ease: 'power4.out' },
            '-=0.55',
          )
          .fromTo(imageRef.current, { scale: 1.035 }, { scale: 1, duration: 1.35, ease: 'power4.out' }, '<')
          .fromTo('.dclWhy__rule', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top center', duration: 0.9 }, '-=0.9')
          .fromTo('.dclWhy__row', { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.1 }, '-=0.7')
          .fromTo('.dclWhy__fadeUp--cta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.3')
          .fromTo('.dclWhy__fadeUp--micro', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.35');

        gsap.to(imageRef.current, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-dcl"
      ref={rootRef}
      aria-labelledby="why-title"
      className="bg-[#080a0d] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1520px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_.92fr_1.08fr] lg:items-stretch lg:gap-0">
          <div className="flex flex-col justify-center lg:pr-12">
            <div className="flex items-center gap-3">
              <span className="dclWhy__eyebrowRule h-px w-6 bg-[#8bbfe8]" />
              <p data-testid="text-why-eyebrow" className="dclHome__eyebrow dclWhy__fadeUp dclWhy__fadeUp--eyebrow text-[#8bbfe8]">
                {whyDclSection.eyebrow}
              </p>
            </div>
            <h2 id="why-title" className="dclHome__display mt-6 text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.04] tracking-[-.03em]">
              <span className="block overflow-hidden"><span className="dclWhy__revealLine block">{whyDclSection.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWhy__revealLine block text-[#c6e3fa]">{whyDclSection.headlineLines[1]}</span></span>
            </h2>
            <p className="dclWhy__fadeUp dclWhy__fadeUp--body mt-6 max-w-[400px] text-[16px] leading-7 text-white/58">{whyDclSection.body}</p>

            <a
              href={whyDclSection.cta.href}
              data-testid="link-why-approach"
              className="dclWhy__fadeUp dclWhy__fadeUp--cta group mt-8 inline-flex w-fit items-center gap-3 border border-white/25 px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:border-[#8bbfe8] hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {whyDclSection.cta.label}
              <ArrowRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
            </a>

            <div className="dclWhy__fadeUp dclWhy__fadeUp--micro mt-12 flex items-stretch gap-4">
              <span className="h-16 w-px shrink-0 bg-[#8bbfe8]/40" />
              <div className="flex flex-col gap-1">
                {whyDclSection.microLines.map((line) => (
                  <span key={line} className="text-[10px] font-semibold uppercase leading-[1.7] tracking-[.16em] text-white/45">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="dclWhy__imageWrap relative mt-10 aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9] lg:mt-0 lg:aspect-auto lg:min-h-[520px]">
            <img
              ref={imageRef}
              data-testid="img-why-dcl"
              className="absolute inset-0 h-full w-full object-cover object-[center_72%] transition-[filter] duration-500"
              style={{ filter: hoveredIndex !== null ? 'brightness(0.78) saturate(0.85) contrast(1.05)' : 'brightness(0.85) saturate(0.88) contrast(1.05)' }}
              src={whyDclImage.src}
              alt={whyDclImage.alt}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d]/80 via-[#080a0d]/30 to-[#080a0d]/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080a0d]/35 via-transparent to-[#080a0d]/35" />
          </div>

          <div className="relative mt-10 flex flex-col justify-center lg:mt-0 lg:border-l lg:border-white/12 lg:pl-12">
            <div className="dclWhy__rule absolute left-0 top-0 hidden h-full w-px bg-white/12 lg:block" aria-hidden="true" />
            <div className="flex flex-col">
              {whyDcl.map((item, index) => {
                const Icon = ICONS[item.icon];
                const active = isDesktop ? hoveredIndex === index : false;
                return (
                  <div
                    key={item.title}
                    data-testid={`quality-${slug(item.title)}`}
                    data-active={active}
                    tabIndex={0}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onBlur={() => setHoveredIndex(null)}
                    className="dclWhy__row group flex items-center gap-5 border-b border-white/12 py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.3}
                      className="shrink-0 transition-colors duration-300"
                      style={{ color: active ? '#8bbfe8' : 'rgba(255,255,255,.55)' }}
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <h3
                        className="dclHome__display text-[1.2rem] leading-[1.15] tracking-[-.015em] transition-colors duration-300 sm:text-[1.35rem]"
                        style={{ color: active ? '#ffffff' : 'rgba(255,255,255,.78)' }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="mt-1.5 max-w-[340px] text-[13px] leading-5 transition-colors duration-300"
                        style={{ color: active ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.42)' }}
                      >
                        {item.copy}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
                      style={{
                        borderColor: active ? 'rgba(139,191,232,.6)' : 'rgba(255,255,255,.2)',
                        transform: active ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      <ArrowRight size={14} strokeWidth={1.4} style={{ color: active ? '#8bbfe8' : 'rgba(255,255,255,.5)' }} />
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="dclWhy__row mt-8 hidden text-right text-[10px] font-semibold uppercase leading-[1.7] tracking-[.13em] text-white/35 lg:block">
              {whyDclSection.microStatementLines[0]}
              <br />
              {whyDclSection.microStatementLines[1]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
