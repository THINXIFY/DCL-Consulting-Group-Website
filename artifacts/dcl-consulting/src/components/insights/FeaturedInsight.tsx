import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { featuredInsight } from '@/data/insights-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function FeaturedInsight() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFeaturedInsight__imageWrap', '.dclFeaturedInsight__fadeUp'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclFeaturedInsight__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclFeaturedInsight__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      if (isDesktop && imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="featured-insight" ref={rootRef} aria-labelledby="featured-insight-title" className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-14">
          <div className="lg:col-span-7">
            <div className="dclFeaturedInsight__imageWrap relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/9] lg:h-full lg:aspect-auto">
              <img loading="lazy" decoding="async"
                ref={imageRef}
                data-testid="img-featured-insight"
                className="h-full w-full scale-105 object-cover object-center"
                src={featuredInsight.image?.src}
                alt={featuredInsight.image?.alt ?? ''}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-5">
            <p data-testid="text-featured-insight-category" className="dclHome__eyebrow dclFeaturedInsight__fadeUp text-[#4f718c]">
              {featuredInsight.category}
            </p>
            <h2
              id="featured-insight-title"
              data-testid="text-featured-insight-title"
              className="dclHome__display dclFeaturedInsight__fadeUp mt-5 text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]"
            >
              {featuredInsight.title}
            </h2>
            <p data-testid="text-featured-insight-excerpt" className="dclFeaturedInsight__fadeUp mt-6 max-w-[460px] text-[17px] leading-[1.65] text-[#35404a]">
              {featuredInsight.excerpt}
            </p>
            <Link
              href={`/insights/${featuredInsight.slug}`}
              data-testid="link-featured-insight"
              className="dclFeaturedInsight__fadeUp group mt-8 inline-flex w-fit items-center gap-2 border-b border-[#080a0d]/25 pb-1 text-[12px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#8bbfe8] hover:text-[#4f718c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Read Insight
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
