import { useEffect, useRef } from 'react';
import { whoWeAre } from '@/data/about-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const WHO_WE_ARE_IMAGE = 'https://picsum.photos/id/1031/1200/1500';
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
          ['.dclWhoWeAre__wash', '.dclWhoWeAre__revealLine', '.dclWhoWeAre__fadeUp', '.dclWhoWeAre__rule', '.dclWhoWeAre__imageWrap', '.dclWhoWeAre__rear', '.dclWhoWeAre__closingWord'],
          { clearProps: 'all' },
        );
        if (imageStageRef.current) gsap.set(imageStageRef.current, { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclWhoWeAre__wash',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 85%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 74%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__lead',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 66%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__rule',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top center', duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__reading', start: 'top 78%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__rear',
        { autoAlpha: 0, x: -24 },
        { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 82%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__imageWrap',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 80%' } },
      );

      if (isDesktop && imageStageRef.current) {
        gsap.fromTo(
          imageStageRef.current,
          { rotateY: -3, rotateX: 1 },
          {
            rotateY: 0,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top 85%', end: 'top 30%', scrub: true },
          },
        );
      }

      gsap.to('.dclWhoWeAre__image', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.to('.dclWhoWeAre__rear', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: '.dclWhoWeAre__imageWrap', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(
        '.dclWhoWeAre__paragraphOne',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__paragraphOne', start: 'top 84%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__paragraphTwo',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__paragraphTwo', start: 'top 84%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__closingLead',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 82%' } },
      );

      gsap.fromTo(
        '.dclWhoWeAre__closingWord',
        { autoAlpha: 0.22 },
        {
          autoAlpha: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 78%', end: 'bottom 60%', scrub: true },
        },
      );

      gsap.fromTo(
        '.dclWhoWeAre__emphasisWord',
        { color: '#080a0d' },
        {
          color: '#4a8fc2',
          ease: 'none',
          scrollTrigger: { trigger: '.dclWhoWeAre__closing', start: 'top 60%', end: 'bottom 40%', scrub: true },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section id="who-we-are" ref={rootRef} aria-labelledby="whoweare-title" className="relative overflow-hidden bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="dclWhoWeAre__wash pointer-events-none absolute inset-0 bg-white" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8">
          <h2
            id="whoweare-title"
            data-testid="text-whoweare-title"
            className="dclHome__display lg:col-span-6 text-[clamp(2.6rem,4.6vw,4.6rem)] leading-[.98] tracking-[-.035em] text-[#080a0d]"
          >
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">{whoWeAre.headlineLines[0]}</span></span>
            <span className="block overflow-hidden"><span className="dclWhoWeAre__revealLine block">{whoWeAre.headlineLines[1]}</span></span>
          </h2>

          <p data-testid="text-whoweare-lead" className="dclWhoWeAre__lead lg:col-span-5 lg:col-start-8 mt-2 text-[21px] leading-[1.55] text-[#171714] lg:mt-3">
            {whoWeAre.lead}
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-y-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <div className="relative lg:[perspective:1400px]">
              <div className="dclWhoWeAre__rear absolute -bottom-6 -right-6 hidden aspect-[4/5] w-[92%] translate-x-6 bg-[#c6e3fa]/50 lg:block" aria-hidden="true" />
              <div ref={imageStageRef} className="dclWhoWeAre__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:will-change-transform">
                <img
                  data-testid="img-whoweare"
                  className="dclWhoWeAre__image h-full w-full scale-110 object-cover"
                  src={WHO_WE_ARE_IMAGE}
                  alt="Sharp geometric facade of a contemporary building, used as institutional context imagery"
                />
              </div>
            </div>
          </div>

          <div className="dclWhoWeAre__reading relative lg:col-span-4 lg:col-start-9">
            <div className="dclWhoWeAre__rule absolute -left-6 top-1 hidden h-full w-px bg-[#8bbfe8] lg:block" aria-hidden="true" />
            <p className="dclWhoWeAre__paragraphOne text-[17px] leading-7 text-[#35404a] sm:text-[18px]">{whoWeAre.bodyOne}</p>
            <p className="dclWhoWeAre__paragraphTwo mt-14 text-[17px] leading-7 text-[#35404a] sm:text-[18px] lg:mt-24">{whoWeAre.bodyTwo}</p>
          </div>
        </div>

        <div data-testid="text-whoweare-closing" className="dclWhoWeAre__closing mt-24 grid grid-cols-1 gap-y-5 border-t border-[#080a0d]/12 pt-12 lg:mt-32 lg:grid-cols-12 lg:gap-x-8 lg:pt-16">
          <p className="dclWhoWeAre__closingLead dclHome__display lg:col-span-3 text-[clamp(1.4rem,2vw,1.8rem)] italic leading-[1.2] text-[#6b737a]">
            {whoWeAre.closingLead}
          </p>
          <p className="dclHome__display lg:col-span-8 lg:col-start-5 text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.14] tracking-[-.025em]">
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
