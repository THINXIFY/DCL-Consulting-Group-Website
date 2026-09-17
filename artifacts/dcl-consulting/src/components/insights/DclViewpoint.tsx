import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { dclViewpoint } from '@/data/insights-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function DclViewpoint() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclViewpoint__revealLine', '.dclViewpoint__fadeUp', '.dclViewpoint__imageWrap'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclViewpoint__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.dclViewpoint__imageWrap', start: 'top 85%' } },
      );
      gsap.fromTo(
        '.dclViewpoint__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclViewpoint__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } },
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
    <section id="dcl-viewpoint" ref={rootRef} aria-labelledby="dcl-viewpoint-title" className="relative overflow-hidden bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclViewpoint__fadeUp text-[#9ca3aa]">{dclViewpoint.label}</p>
            <h2 id="dcl-viewpoint-title" className="dclHome__display mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.06] tracking-[-.03em]">
              {dclViewpoint.headlineLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span className="dclViewpoint__revealLine block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="dclViewpoint__fadeUp mt-6 max-w-[420px] text-[16px] leading-7 text-white/60">{dclViewpoint.copy}</p>

            <div className="dclViewpoint__fadeUp mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {dclViewpoint.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`link-viewpoint-${link.label.toLowerCase().replaceAll(' ', '-')}`}
                  className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                >
                  {link.label}
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &#8594;
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="dclViewpoint__imageWrap relative aspect-[16/10] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                ref={imageRef}
                data-testid="img-dcl-viewpoint"
                className="h-full w-full scale-105 object-cover object-center"
                src={dclViewpoint.image.src}
                alt={dclViewpoint.image.alt}
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171714]/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
