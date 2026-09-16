import { useEffect, useRef } from 'react';
import { whyPartnershipsMatter } from '@/data/partners-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function WhyPartnershipsMatter() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhyPartners__revealLine', '.dclWhyPartners__fadeUp', '.dclWhyPartners__rule', '.dclWhyPartners__col'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclWhyPartners__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclWhyPartners__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 70%' } },
      );
      gsap.fromTo(
        '.dclWhyPartners__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 62%' } },
      );
      gsap.fromTo(
        '.dclWhyPartners__col',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhyPartners__grid', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-partnerships-matter" ref={rootRef} aria-labelledby="why-partners-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-why-partners-eyebrow" className="dclHome__eyebrow dclWhyPartners__fadeUp mb-5 text-[#4f718c]">
          {whyPartnershipsMatter.eyebrow}
        </p>
        <h2 id="why-partners-title" className="dclHome__display max-w-[720px] text-[clamp(2.2rem,4.2vw,3.4rem)] leading-[1.08] tracking-[-.03em] text-[#080a0d]">
          {whyPartnershipsMatter.headlineLines.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span className="dclWhyPartners__revealLine block">{line}</span>
            </span>
          ))}
        </h2>
        <div className="mt-8 max-w-[640px] space-y-4">
          {whyPartnershipsMatter.body.map((paragraph) => (
            <p key={paragraph} className="dclWhyPartners__fadeUp text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="dclWhyPartners__rule mt-14 h-px w-full origin-left bg-[#080a0d]/14" />

        <div className="dclWhyPartners__grid mt-2 grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-[#080a0d]/12">
          {whyPartnershipsMatter.principles.map((principle) => (
            <div
              key={principle.label}
              data-testid={`why-partners-principle-${slug(principle.label)}`}
              className="dclWhyPartners__col border-b border-[#080a0d]/12 py-9 sm:border-b-0 sm:px-8 sm:py-10 sm:first:pl-0"
            >
              <p className="dclHome__eyebrow text-[#8bbfe8]">{principle.label}</p>
              <h3 className="dclHome__display mt-4 text-[1.5rem] leading-[1.12] tracking-[-.02em] text-[#080a0d]">{principle.headline}</h3>
              <p className="mt-3 max-w-[30ch] text-[15px] leading-6 text-[#4b545c]">{principle.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
