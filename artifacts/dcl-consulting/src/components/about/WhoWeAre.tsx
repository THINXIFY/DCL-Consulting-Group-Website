import { useEffect, useRef } from 'react';
import { whoWeAreImage } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function WhoWeAre() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclWhoWeAre__revealLine', '.dclWhoWeAre__fadeUp', '.dclWhoWeAre__rule', '.dclWhoWeAre__imageWrap', '.dclWhoWeAre__closing'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhoWeAre__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__rule',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 65%', end: 'bottom 70%', scrub: true } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 78%' } },
      );

      gsap.to('.dclWhoWeAre__image', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclWhoWeAre__fadeUp',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__body', start: 'top 80%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__closing',
        { autoAlpha: 0, y: 34, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 82%' } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="who-we-are" ref={rootRef} aria-labelledby="whoweare-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-whoweare-eyebrow" className="dclHome__eyebrow dclWhoWeAre__revealLine mb-6 overflow-hidden text-[#6b737a]">
          Who we are
        </p>
        <h2
          id="whoweare-title"
          data-testid="text-whoweare-title"
          className="dclHome__display max-w-[980px] text-[clamp(2.8rem,6vw,5.6rem)] leading-[.94] tracking-[-.045em] text-[#080a0d]"
        >
          <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">Independent thinking</span></span>
          <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">for decisions that matter.</span></span>
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-[.3fr_.02fr_.68fr] lg:gap-0">
          <div className="lg:pr-14">
            <p className="dclWhoWeAre__fadeUp text-[19px] leading-8 text-[#171714] sm:text-[20px]">
              DCL Consulting helps investors and businesses develop a clearer understanding of opportunities before significant decisions are made.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="dclWhoWeAre__rule mx-auto h-full w-px bg-[#8bbfe8]" />
          </div>
          <div className="lg:pl-14">
            <div className="dclWhoWeAre__imageWrap aspect-[16/10] w-full overflow-hidden">
              <img className="dclWhoWeAre__image h-full w-full scale-110 object-cover" src={whoWeAreImage} alt="Contemporary office interior with long architectural lines" />
            </div>
            <div className="dclWhoWeAre__body mt-10 max-w-[620px] space-y-5">
              <p className="text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
                Our role is to examine the wider picture, understanding the commercial fundamentals, financial considerations, assumptions, uncertainties and strategic context surrounding an opportunity.
              </p>
              <p className="text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
                Rather than approaching every situation with a predetermined answer, we focus on the questions that are most relevant to the decision. This allows complex information to be considered with greater structure, perspective and clarity.
              </p>
            </div>
          </div>
        </div>

        <p
          data-testid="text-whoweare-closing"
          className="dclHome__display dclWhoWeAre__closing mt-20 max-w-[980px] text-[clamp(1.7rem,3.4vw,2.8rem)] leading-[1.2] tracking-[-.02em] text-[#080a0d]"
        >
          The objective is simple: a better-informed view of what matters, what remains uncertain and what deserves closer attention.
        </p>
      </div>
    </section>
  );
}
