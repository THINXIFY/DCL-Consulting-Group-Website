import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { latestPerspectives, type InsightItem, type PerspectiveVariant } from '@/data/insights-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const VARIANT_SPAN: Record<PerspectiveVariant, string> = {
  wide: 'lg:col-span-8',
  vertical: 'lg:col-span-4',
  text: 'lg:col-span-4',
  image: 'lg:col-span-4',
};

const VARIANT_TITLE_SIZE: Record<PerspectiveVariant, string> = {
  wide: 'text-[clamp(1.5rem,2.4vw,2rem)]',
  vertical: 'text-[clamp(1.25rem,1.8vw,1.5rem)]',
  text: 'text-[clamp(1.4rem,2vw,1.75rem)]',
  image: 'text-[clamp(1.25rem,1.8vw,1.5rem)]',
};

function PerspectiveItem({ item }: { item: InsightItem & { variant: PerspectiveVariant } }) {
  const isWide = item.variant === 'wide';
  const hasImage = item.variant !== 'text';

  return (
    <article
      data-testid={`item-perspective-${item.slug}`}
      className={`dclLatestPerspectives__item group flex flex-col border-t border-[#080a0d]/12 pt-7 ${VARIANT_SPAN[item.variant]} ${isWide ? 'lg:flex-row lg:items-center lg:gap-8' : ''}`}
    >
      {hasImage && item.image && (
        <div className={`dclLatestPerspectives__imageWrap relative overflow-hidden ${isWide ? 'aspect-[4/3] lg:aspect-[16/12] lg:w-[52%] lg:shrink-0' : 'aspect-[4/3]'}`}>
          <Link href={`/insights/${item.slug}`} className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]" tabIndex={-1} aria-hidden="true">
            <img
              data-testid={`img-perspective-${item.slug}`}
              className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              src={item.image.src}
              alt={item.image.alt}
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>
      )}

      <div className={`flex flex-1 flex-col ${hasImage ? 'mt-5' : ''} ${!hasImage ? 'justify-center' : ''}`}>
        <p data-testid={`text-perspective-category-${item.slug}`} className="dclHome__eyebrow text-[#8497a3]">
          {item.category}
        </p>
        <h3 className={`dclHome__display mt-3 leading-[1.15] tracking-[-.015em] text-[#080a0d] ${VARIANT_TITLE_SIZE[item.variant]} ${!hasImage ? 'max-w-[26ch]' : ''}`}>
          <Link href={`/insights/${item.slug}`} data-testid={`link-perspective-title-${item.slug}`} className="outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]">
            {item.title}
          </Link>
        </h3>
        <p data-testid={`text-perspective-excerpt-${item.slug}`} className="mt-3 max-w-[46ch] text-[16px] leading-[1.6] text-[#6b737a]">
          {item.excerpt}
        </p>
        <Link
          href={`/insights/${item.slug}`}
          data-testid={`link-perspective-read-${item.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-[#080a0d]/70 outline-none transition-colors duration-300 hover:text-[#4f718c] focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
        >
          Read More
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            &#8594;
          </span>
        </Link>
      </div>
    </article>
  );
}

export function LatestPerspectives() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclLatestPerspectives__fadeUp', '.dclLatestPerspectives__item'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclLatestPerspectives__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclLatestPerspectives__item',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclLatestPerspectives__grid', start: 'top 82%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="latest-perspectives" ref={rootRef} aria-labelledby="latest-perspectives-title" className="bg-[#f2f4f6] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p data-testid="text-latest-perspectives-eyebrow" className="dclHome__eyebrow dclLatestPerspectives__fadeUp text-[#6b737a]">
              Latest Perspectives
            </p>
            <h2
              id="latest-perspectives-title"
              className="dclHome__display dclLatestPerspectives__fadeUp mt-4 max-w-[520px] text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]"
            >
              Perspective across the disciplines we work in.
            </h2>
          </div>
        </div>

        <div className="dclLatestPerspectives__grid mt-14 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          {latestPerspectives.map((item) => (
            <PerspectiveItem key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
