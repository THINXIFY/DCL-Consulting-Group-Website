import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactSupportCta } from '@/data/contact-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

const SECTION_IMAGE = '/images/general/contact-support.webp';

export function ContactSupportCta() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(ctaRef, { strength: 0.25 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclSupportCta__fadeUp', '.dclSupportCta__imageWrap'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclSupportCta__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 80%' } },
      );
      gsap.fromTo(
        '.dclSupportCta__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.dclSupportCta__imageWrap', start: 'top 88%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="contact-support-cta" ref={rootRef} aria-labelledby="contact-support-title" className="bg-[#f2f4f6] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-8">
            <p className="dclHome__eyebrow dclSupportCta__fadeUp text-[#6b737a]">{contactSupportCta.label}</p>
            <h2 id="contact-support-title" data-testid="text-contact-support-title" className="dclHome__display dclSupportCta__fadeUp mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]">
              {contactSupportCta.headline}
            </h2>
            <p className="dclSupportCta__fadeUp mt-4 max-w-[480px] text-[16px] leading-7 text-[#35404a]">{contactSupportCta.copy}</p>
            <a
              ref={ctaRef}
              href={contactSupportCta.cta.href}
              data-testid="link-contact-support-cta"
              className="dclSupportCta__fadeUp group mt-6 inline-flex items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
            >
              {contactSupportCta.cta.label}
              <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]" />
            </a>
          </div>

          <div className="lg:col-span-4">
            <div className="dclSupportCta__imageWrap relative aspect-[16/10] w-full overflow-hidden">
              <img
                data-testid="img-contact-support"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Brick industrial-style building facade at golden hour with tall arched windows"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
