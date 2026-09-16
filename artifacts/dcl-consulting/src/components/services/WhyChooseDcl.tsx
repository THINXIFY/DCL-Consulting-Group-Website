import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Compass, Layers, MessageCircle, Sprout, Users } from 'lucide-react';
import { whyChooseDcl } from '@/data/services-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/general/services-why-dcl.webp';

const PRINCIPLE_ICONS = [Compass, Layers, Users, MessageCircle, Sprout];

export function WhyChooseDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhyDcl__revealLine', '.dclWhyDcl__fadeUp', '.dclWhyDcl__imageWrap', '.dclWhyDcl__principle'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWhyDcl__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhyDcl__imageWrap', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclWhyDcl__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 75%' } },
      );
      gsap.fromTo(
        '.dclWhyDcl__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );
      gsap.fromTo(
        '.dclWhyDcl__principle',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 58%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-choose-dcl" ref={rootRef} aria-labelledby="why-dcl-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-10">
          <div className="lg:col-span-5">
            <div className="dclWhyDcl__imageWrap relative aspect-[4/5] w-full overflow-hidden">
              <img
                data-testid="img-why-choose-dcl"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Tall glass skyscraper viewed from below against a partly cloudy sky"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="dclHome__eyebrow dclWhyDcl__fadeUp text-[#6b737a]">{whyChooseDcl.label}</p>
            <h2 id="why-dcl-title" className="dclHome__display mt-5 text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.1] tracking-[-.025em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclWhyDcl__revealLine block">{whyChooseDcl.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclWhyDcl__revealLine block">{whyChooseDcl.headlineLines[1]}</span></span>
            </h2>
            <p className="dclWhyDcl__fadeUp mt-6 max-w-[420px] text-[16px] leading-7 text-[#35404a]">{whyChooseDcl.body}</p>
            <Link
              href={whyChooseDcl.cta.href}
              data-testid="link-why-dcl-cta"
              className="dclWhyDcl__fadeUp group mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {whyChooseDcl.cta.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col divide-y divide-[#080a0d]/12 border-t border-[#080a0d]/12">
              {whyChooseDcl.principles.map((principle, index) => {
                const Icon = PRINCIPLE_ICONS[index] ?? Compass;
                return (
                  <div key={principle} data-testid={`why-dcl-principle-${index}`} className="dclWhyDcl__principle flex items-center gap-3 py-3.5">
                    <Icon size={17} strokeWidth={1.3} className="shrink-0 text-[#8bbfe8]" aria-hidden="true" />
                    <p className="text-[15px] font-medium leading-5 text-[#080a0d]">{principle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
