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
        gsap.set(['.dclWhoWeAre__revealLine', '.dclWhoWeAre__fadeUp', '.dclWhoWeAre__datum', '.dclWhoWeAre__imageWrap', '.dclWhoWeAre__pull'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhoWeAre__revealLine',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.95, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 82%' } },
      );
      gsap.to('.dclWhoWeAre__image', {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclWhoWeAre__datum',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: '.dclWhoWeAre__body', start: 'top 75%', end: 'bottom 60%', scrub: true } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__fadeUp',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__body', start: 'top 82%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__pull',
        { autoAlpha: 0, scale: 0.9 },
        {
          autoAlpha: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.dclWhoWeAre__pull', start: 'top 90%', end: 'top 45%', scrub: true },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="who-we-are" ref={rootRef} aria-labelledby="whoweare-title" className="bg-[#fbfbfa] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-44">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-whoweare-eyebrow" className="dclHome__eyebrow dclWhoWeAre__revealLine mb-6 overflow-hidden text-[#6b737a]">
          Who we are
        </p>

        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-12">
          <h2
            id="whoweare-title"
            data-testid="text-whoweare-title"
            className="dclHome__display lg:col-span-7 text-[clamp(3rem,5.5vw,5.5rem)] leading-[.96] tracking-[-.04em] text-[#080a0d]"
          >
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">Independent thinking</span></span>
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">for decisions that matter.</span></span>
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-6">
          <div className="dclWhoWeAre__body relative lg:col-span-5 lg:col-start-4">
            <div className="dclWhoWeAre__datum absolute -left-6 top-1 hidden h-[220px] w-px bg-[#8bbfe8] lg:block" />
            <p className="dclWhoWeAre__fadeUp text-[20px] leading-[1.6] text-[#171714]">
              DCL Consulting helps investors and businesses develop a clearer understanding of opportunities before significant decisions are made.
            </p>
            <p className="dclWhoWeAre__fadeUp mt-6 text-[16px] leading-7 text-[#35404a]">
              Our role is to examine the wider picture, understanding the commercial fundamentals, financial considerations, assumptions, uncertainties and strategic context surrounding an opportunity.
            </p>
            <p className="dclWhoWeAre__fadeUp mt-5 text-[16px] leading-7 text-[#35404a]">
              Rather than approaching every situation with a predetermined answer, we focus on the questions that are most relevant to the decision. This allows complex information to be considered with greater structure, perspective and clarity.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:-mt-28">
            <div className="dclWhoWeAre__imageWrap aspect-[4/3] w-full overflow-hidden lg:aspect-[5/4]">
              <img className="dclWhoWeAre__image h-full w-full scale-110 object-cover" src={whoWeAreImage} alt="Contemporary office interior with long architectural lines" />
            </div>
          </div>
        </div>

        <p
          data-testid="text-whoweare-pull"
          className="dclHome__display dclWhoWeAre__pull mt-24 max-w-[1040px] text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.18] tracking-[-.025em] text-[#080a0d] lg:mt-32"
        >
          The objective is simple: a better-informed view of what matters, what remains uncertain and what deserves closer attention.
        </p>
      </div>
    </section>
  );
}
