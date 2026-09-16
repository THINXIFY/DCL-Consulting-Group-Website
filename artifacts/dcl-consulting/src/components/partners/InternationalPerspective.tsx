import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { internationalPerspective } from '@/data/partners-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FadeInImage } from '@/components/ui/fade-in-image';

export function InternationalPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclIntlPerspective__revealLine', '.dclIntlPerspective__fadeUp', '.dclIntlPerspective__imageWrap', '.dclIntlPerspective__statement'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclIntlPerspective__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.dclIntlPerspective__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclIntlPerspective__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclIntlPerspective__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
      );
      gsap.fromTo(
        '.dclIntlPerspective__statement',
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, scrollTrigger: { trigger: '.dclIntlPerspective__imageWrap', start: 'top 70%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="international-perspective" ref={rootRef} aria-labelledby="intl-perspective-title" className="relative overflow-hidden bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclIntlPerspective__fadeUp text-[#9ca3aa]">{internationalPerspective.eyebrow}</p>
            <h2 id="intl-perspective-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] tracking-[-.03em]">
              {internationalPerspective.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclIntlPerspective__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <div className="mt-6 max-w-[420px] space-y-4">
              {internationalPerspective.body.map((paragraph) => (
                <p key={paragraph} className="dclIntlPerspective__fadeUp text-[16px] leading-7 text-white/60">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href={internationalPerspective.cta.href}
              data-testid="link-intl-perspective-cta"
              className="dclIntlPerspective__fadeUp group mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {internationalPerspective.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="dclIntlPerspective__imageWrap relative aspect-[16/10] w-full overflow-hidden">
              <FadeInImage
                ref={imageRef}
                data-testid="img-intl-perspective"
                className="h-full w-full scale-105 object-cover object-center"
                src={internationalPerspective.image.src}
                alt={internationalPerspective.image.alt}
                loading="lazy"
                decoding="async"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171714]/55 via-transparent to-transparent" />
              <div data-testid="text-intl-perspective-statement" className="absolute bottom-5 right-5 text-right">
                {internationalPerspective.statementLines.map((line) => (
                  <p key={line} className="dclIntlPerspective__statement text-[11px] font-semibold uppercase leading-[1.6] tracking-[.14em] text-white">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
