import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getInTouchBand } from '@/data/contact-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { FadeInImage } from '@/components/ui/fade-in-image';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function GetInTouchBand() {
  const rootRef = useRef<HTMLElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          ['.dclGetInTouch__revealLine', '.dclGetInTouch__fadeUp', '.dclGetInTouch__imageWrap', '.dclGetInTouch__imageInner', '.dclGetInTouch__rule'],
          { clearProps: 'all' },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } });
        tl.fromTo('.dclGetInTouch__fadeUp--eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 })
          .fromTo('.dclGetInTouch__revealLine', { yPercent: 112 }, { yPercent: 0, duration: 0.85, stagger: 0.08 }, '-=0.3')
          .fromTo('.dclGetInTouch__fadeUp', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
          .fromTo(
            '.dclGetInTouch__imageWrap',
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' },
            '-=0.6',
          )
          .fromTo('.dclGetInTouch__imageInner', { scale: 1.04, autoAlpha: 0.85 }, { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'power4.out' }, '<');

        gsap.fromTo(
          '.dclGetInTouch__rule',
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'top center', duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
        );

        if (isDesktop && imageInnerRef.current) {
          gsap.to(imageInnerRef.current, {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section id="get-in-touch" ref={rootRef} aria-labelledby="get-in-touch-title" className="bg-[#171714] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-2 md:items-start md:gap-x-10 md:gap-y-14 xl:grid-cols-[38fr_24fr_38fr] xl:grid-rows-[auto_auto] xl:items-start xl:gap-x-14 xl:gap-y-10">
          {/* Copy: eyebrow, headline, body, CTA. Always first. */}
          <div className="order-1 xl:col-start-1 xl:row-start-1">
            <p data-testid="text-get-in-touch-eyebrow" className="dclHome__eyebrow dclGetInTouch__fadeUp dclGetInTouch__fadeUp--eyebrow text-[#9ca3aa]">
              {getInTouchBand.label}
            </p>
            <h2
              id="get-in-touch-title"
              data-testid="text-get-in-touch-headline"
              className="dclHome__display mt-5 text-[clamp(2.3rem,3.2vw,3.6rem)] leading-[1.04] tracking-[-.03em] text-white"
            >
              {getInTouchBand.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclGetInTouch__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <p data-testid="text-get-in-touch-body" className="dclGetInTouch__fadeUp mt-6 max-w-[440px] text-[16px] leading-7 text-white/60">
              {getInTouchBand.body}
            </p>

            <a
              href={getInTouchBand.cta.href}
              data-testid="link-get-in-touch-cta"
              className="dclGetInTouch__fadeUp group mt-8 inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {getInTouchBand.cta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </a>
          </div>

          {/* Image: second on mobile, right after the CTA. */}
          <div className="order-2 md:order-3 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:row-span-2">
            <div className="dclGetInTouch__imageWrap relative aspect-[3/4] w-full max-w-[420px] overflow-hidden md:max-w-none">
              <div ref={imageInnerRef} className="dclGetInTouch__imageInner h-full w-full">
                <FadeInImage
                  data-testid="img-get-in-touch-location"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: '50% 32%' }}
                  src={getInTouchBand.locationImage.src}
                  alt={getInTouchBand.locationImage.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171714]/55 via-transparent to-transparent" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: 'inset 0 0 60px 10px rgba(23,23,20,.45)' }}
              />
            </div>
          </div>

          {/* Verified Details / Registered Office: third on mobile, after the image. */}
          <div className="order-3 md:order-2 xl:order-none xl:col-start-2 xl:row-start-1 xl:row-span-2 border-t border-white/12 pt-10 md:border-t-0 md:pt-0">
            <p className="dclHome__eyebrow dclGetInTouch__fadeUp text-white/40">Verified Details</p>
            <div className="dclGetInTouch__rule mt-5 h-16 w-px origin-top scale-y-0 bg-[#8bbfe8]" />
            {getInTouchBand.verifiedDetails.map((fact) => (
              <div key={fact.label} data-testid={`get-in-touch-fact-${slug(fact.label)}`} className="dclGetInTouch__fadeUp mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-white/40">{fact.label}</p>
                <address className="mt-3 max-w-[280px] text-[17px] not-italic leading-7 text-white/80">
                  {fact.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            ))}
          </div>

          {/* People / Perspective / Progress: restrained micro-copy, always last on mobile. */}
          <div className="order-4 md:col-span-2 xl:order-none xl:col-span-1 xl:col-start-1 xl:row-start-2 xl:self-end">
            <div data-testid="text-get-in-touch-statement" className="dclGetInTouch__fadeUp flex items-center gap-3 border-t border-white/12 pt-6 xl:border-t-0 xl:pt-0">
              {getInTouchBand.statementLines.map((word, index) => (
                <span key={word} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">{word}</span>
                  {index < getInTouchBand.statementLines.length - 1 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#8bbfe8]/60" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
