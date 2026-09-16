import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { portfolioConsiderations } from '@/data/asset-portfolio-advisory-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/services/asset-portfolio-secondary.webp';

export function PortfolioConsiderationsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPortfolio__revealLine', '.dclPortfolio__fadeUp', '.dclPortfolio__imageWrap', '.dclPortfolio__item'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPortfolio__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclPortfolio__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclPortfolio__item',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
      gsap.fromTo(
        '.dclPortfolio__imageWrap',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclPortfolio__imageWrap', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="portfolio-considerations" ref={rootRef} aria-labelledby="portfolio-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-5">
            <p className="dclHome__eyebrow dclPortfolio__fadeUp text-[#6b737a]">{portfolioConsiderations.label}</p>
            <h2 id="portfolio-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclPortfolio__revealLine block">{portfolioConsiderations.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclPortfolio__revealLine block">{portfolioConsiderations.headlineLines[1]}</span></span>
            </h2>
            <p className="dclPortfolio__fadeUp mt-5 max-w-[400px] text-[16px] leading-7 text-[#35404a]">{portfolioConsiderations.body}</p>
            <Link
              href={portfolioConsiderations.cta.href}
              data-testid="link-portfolio-considerations-cta"
              className="dclPortfolio__fadeUp group mt-7 inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {portfolioConsiderations.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="lg:col-span-4">
            <div className="border-t border-[#080a0d]/14">
              {portfolioConsiderations.list.map((item) => (
                <div key={item} className="dclPortfolio__item border-b border-[#080a0d]/14 py-4">
                  <p className="text-[16px] font-medium leading-6 text-[#080a0d]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="dclPortfolio__imageWrap relative aspect-[4/5] w-full overflow-hidden">
              <img
                data-testid="img-portfolio-considerations"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Angled close-up of a glass office tower facade with repeating vertical mullions"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
