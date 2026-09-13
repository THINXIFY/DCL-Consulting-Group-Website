import { useEffect, useRef } from 'react';
import { whoWeAre } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

// Placeholder image - swap for the real photo before launch.
const WHO_WE_ARE_IMAGE = 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp';
const CLOSING_EMPHASIS_WORDS = ['uncertain', 'attention'];

function renderClosingLine(line: string) {
  const emphasis = CLOSING_EMPHASIS_WORDS.find((word) => line.includes(word));
  if (!emphasis) return line;
  const [before, after] = line.split(emphasis);
  return (
    <>
      {before}
      <span className="dclWhoWeAre__emphasisWord">{emphasis}</span>
      {after}
    </>
  );
}

export function WhoWeAre() {
  const rootRef = useRef<HTMLElement>(null);
  const imageStageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          ['.dclWhoWeAre__revealLine', '.dclWhoWeAre__fadeUp', '.dclWhoWeAre__imageWrap', '.dclWhoWeAre__panel', '.dclWhoWeAre__paragraphTwo', '.dclWhoWeAre__closingWord'],
          { clearProps: 'all' },
        );
        if (imageStageRef.current) gsap.set(imageStageRef.current, { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhoWeAre__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 76%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__lead',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 68%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__imageWrap',
        { clipPath: 'inset(0 0 0 0 round 0px)', autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 84%' } },
      );

      if (isDesktop && imageStageRef.current) {
        gsap.fromTo(
          imageStageRef.current,
          { rotateY: -3, rotateX: 1.2 },
          {
            rotateY: 0,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 88%', end: 'top 30%', scrub: true },
          },
        );
      }

      gsap.to('.dclWhoWeAre__image', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclWhoWeAre__panel',
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__panel', start: 'top 92%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__paragraphTwo',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__paragraphTwo', start: 'top 90%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__closingWord',
        { autoAlpha: 0.22 },
        {
          autoAlpha: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 85%', end: 'bottom 65%', scrub: true },
        },
      );

      gsap.fromTo(
        '.dclWhoWeAre__emphasisWord',
        { color: '#080a0d' },
        {
          color: '#4a8fc2',
          ease: 'none',
          scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 65%', end: 'bottom 45%', scrub: true },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="who-we-are" ref={rootRef} aria-labelledby="whoweare-title" className="relative overflow-hidden bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-36">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="max-w-[680px]">
          <h2
            id="whoweare-title"
            data-testid="text-whoweare-title"
            className="dclHome__display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[.98] tracking-[-.035em] text-[#080a0d]"
          >
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">{whoWeAre.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">{whoWeAre.headlineLines[1]}</span></span>
          </h2>

          <p data-testid="text-whoweare-lead" className="dclWhoWeAre__lead mt-6 text-[20px] leading-[1.55] text-[#171714] sm:text-[21px]">
            {whoWeAre.lead}
          </p>
        </div>

        <div className="relative mt-16 lg:mt-20 lg:[perspective:1600px]">
          <div ref={imageStageRef} className="dclWhoWeAre__imageWrap relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9] lg:will-change-transform">
            <img
              data-testid="img-whoweare"
              className="dclWhoWeAre__image h-full w-full scale-110 object-cover"
              src={WHO_WE_ARE_IMAGE}
              alt="Sharp geometric facade of a contemporary building, used as institutional context imagery"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/45 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 -mt-14 grid grid-cols-1 gap-6 px-2 sm:-mt-16 sm:px-4 lg:-mt-20 lg:grid-cols-12 lg:gap-x-10 lg:px-8">
            <div className="dclWhoWeAre__panel bg-white p-7 shadow-[0_30px_70px_rgba(8,10,13,.18)] sm:p-9 lg:col-span-5 lg:p-10">
              <div className="h-px w-10 bg-[#8bbfe8]" />
              <p className="mt-5 text-[16px] leading-7 text-[#35404a] sm:text-[17px]">{whoWeAre.bodyOne}</p>
            </div>

            <div className="dclWhoWeAre__paragraphTwo flex items-end pb-1 lg:col-span-5 lg:col-start-8">
              <p className="text-[16px] leading-7 text-[#080a0d]/80 sm:text-[17px]">{whoWeAre.bodyTwo}</p>
            </div>
          </div>
        </div>

        <div data-testid="text-whoweare-closing" className="dclWhoWeAre__closing mx-auto mt-28 max-w-[820px] text-center lg:mt-36">
          <p className="dclHome__display text-[clamp(1.4rem,2vw,1.8rem)] italic leading-[1.2] text-[#6b737a]">{whoWeAre.closingLead}</p>
          <p className="dclHome__display mt-5 text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.16] tracking-[-.025em]">
            {whoWeAre.closingLines.map((line) => (
              <span key={line} className="dclWhoWeAre__closingWord block text-[#080a0d]">
                {renderClosingLine(line)}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
