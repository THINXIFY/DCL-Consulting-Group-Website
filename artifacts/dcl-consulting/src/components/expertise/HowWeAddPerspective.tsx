import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { fourLenses } from '@/data/expertise-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FadeInImage } from '@/components/ui/fade-in-image';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function HowWeAddPerspective() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclLenses__revealLine', '.dclLenses__fadeUp', '.dclLenses__panel'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclLenses__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclLenses__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclLenses__panel',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclLenses__grid', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="four-lenses" ref={rootRef} aria-labelledby="four-lenses-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <p className="dclHome__eyebrow dclLenses__fadeUp text-[#6b737a]">{fourLenses.label}</p>
            <h2 id="four-lenses-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.8rem)] leading-[1.08] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclLenses__revealLine block">{fourLenses.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclLenses__revealLine block">{fourLenses.headlineLines[1]}</span></span>
            </h2>
            <p className="dclLenses__fadeUp mt-5 max-w-[320px] text-[16px] leading-7 text-[#35404a]">{fourLenses.intro}</p>
            <Link
              href="/approach"
              data-testid="link-lenses-approach"
              className="dclLenses__fadeUp group mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Our Approach
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="dclLenses__grid lg:col-span-9">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
              {fourLenses.lenses.map((lens) => (
                <div
                  key={lens.title}
                  data-testid={`lens-panel-${slug(lens.title)}`}
                  tabIndex={0}
                  className="dclLenses__panel group cursor-default outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <FadeInImage
                      data-testid={`img-lens-${slug(lens.title)}`}
                      className="h-full w-full scale-100 object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                      src={lens.image.src}
                      alt={lens.image.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className="dclHome__display mt-5 text-[1.2rem] leading-[1.15] text-[#080a0d] transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                    {lens.title}
                  </p>
                  <div className="mt-3 h-px w-6 bg-[#8bbfe8] transition-all duration-300 group-hover:w-10 group-focus-visible:w-10" />
                  <p className="mt-3 max-w-[26ch] text-[15px] leading-6 text-[#6b737a] transition-colors duration-300 group-hover:text-[#35404a] group-focus-visible:text-[#35404a]">
                    {lens.description}
                  </p>
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                    aria-hidden="true"
                    className="mt-3 text-[#8bbfe8] opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
