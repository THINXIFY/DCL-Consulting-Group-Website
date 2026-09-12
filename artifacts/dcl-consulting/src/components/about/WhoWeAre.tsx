import { useEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const WHO_WE_ARE_IMAGE = 'https://picsum.photos/id/1031/1200/1500';

export function WhoWeAre() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclWhoWeAre__revealLine', '.dclWhoWeAre__fadeUp', '.dclWhoWeAre__rule', '.dclWhoWeAre__datum', '.dclWhoWeAre__imageWrap', '.dclWhoWeAre__closing'],
          { clearProps: 'all' },
        );
        return;
      }

      gsap.fromTo(
        '.dclWhoWeAre__rule',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left center', duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 82%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 76%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__lead',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 80%' } },
      );
      gsap.to('.dclWhoWeAre__image', {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclWhoWeAre__datum',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: '.dclWhoWeAre__body', start: 'top 78%', end: 'bottom 55%', scrub: true } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__body', start: 'top 82%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__closing',
        { autoAlpha: 0.35, y: 16 },
        { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 90%', end: 'top 50%', scrub: true } },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="who-we-are" ref={rootRef} aria-labelledby="whoweare-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center gap-5">
          <div className="dclWhoWeAre__rule h-px w-14 origin-left bg-[#8bbfe8]" />
          <p data-testid="text-whoweare-eyebrow" className="dclHome__eyebrow text-[#6b737a]">
            Who we are
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <h2
            id="whoweare-title"
            data-testid="text-whoweare-title"
            className="dclHome__display lg:col-span-6 text-[clamp(2.6rem,4.6vw,4.6rem)] leading-[.98] tracking-[-.035em] text-[#080a0d]"
          >
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">Independent thinking</span></span>
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">for decisions that matter.</span></span>
          </h2>

          <p data-testid="text-whoweare-lead" className="dclWhoWeAre__lead lg:col-span-5 lg:col-start-8 mt-1 text-[21px] leading-[1.55] text-[#171714] lg:mt-3">
            DCL Consulting helps investors and businesses develop a clearer understanding of opportunities before significant decisions are made.
          </p>
        </div>

        <div className="relative mt-20 grid grid-cols-1 gap-y-12 lg:mt-28 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <div className="dclWhoWeAre__imageWrap aspect-[4/5] w-full overflow-hidden lg:sticky lg:top-24">
              <img data-testid="img-whoweare" className="dclWhoWeAre__image h-full w-full scale-110 object-cover" src={WHO_WE_ARE_IMAGE} alt="Sharp geometric facade of a contemporary building, used as institutional context imagery" />
            </div>
          </div>

          <div className="dclWhoWeAre__body relative lg:col-span-4 lg:col-start-8">
            <div className="dclWhoWeAre__datum absolute -left-6 top-1 hidden h-[180px] w-px bg-[#8bbfe8] lg:block" />
            <p className="dclWhoWeAre__fadeUp text-[16px] leading-7 text-[#35404a]">
              Our role is to examine the wider picture, understanding the commercial fundamentals, financial considerations, assumptions, uncertainties and strategic context surrounding an opportunity.
            </p>
            <p className="dclWhoWeAre__fadeUp mt-5 text-[16px] leading-7 text-[#35404a]">
              Rather than approaching every situation with a predetermined answer, we focus on the questions that are most relevant to the decision. This allows complex information to be considered with greater structure, perspective and clarity.
            </p>
          </div>
        </div>

        <div data-testid="text-whoweare-closing" className="dclWhoWeAre__closing mt-24 lg:mt-32">
          <p className="dclHome__display text-[clamp(1.4rem,2vw,1.8rem)] italic leading-none text-[#6b737a]">The objective is simple.</p>
          <p className="dclHome__display mt-4 max-w-[880px] text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.15] tracking-[-.03em] text-[#080a0d]">
            a better-informed view of what matters, what remains uncertain and what deserves closer attention.
          </p>
        </div>
      </div>
    </section>
  );
}
