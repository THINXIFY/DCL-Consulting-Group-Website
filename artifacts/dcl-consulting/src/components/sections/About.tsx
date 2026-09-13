import { useEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

// Placeholder image - swap for the real photo before launch.
const ABOUT_IMAGE = 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp';

const FACTS = [
  'DCL Consulting and Investments Limited',
  'Private limited company',
  'Registered in England and Wales',
  'Company no. 10086906',
];

const BODY = [
  'DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support.',
  'We help investors and businesses understand opportunities more clearly by examining commercial fundamentals, financial considerations, material risks, and strategic context.',
  'Our role is to bring shape to the uncertain. We combine rigorous research with commercial understanding to reveal what matters, what is missing, and what should happen next.',
  "Quietly independent and deliberately close to the work, we operate as a trusted extension of our clients' thinking.",
];

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclAbout__rule', '.dclAbout__fadeUp', '.dclAbout__imageWrap'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclAbout__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('.dclAbout__fadeUp').forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        );
      });

      gsap.fromTo(
        '.dclAbout__imageWrap',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dclAbout__imageWrap', start: 'top 75%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about" ref={rootRef} aria-labelledby="about-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-about-eyebrow" className="dclHome__eyebrow dclAbout__fadeUp mb-5 text-[#6b737a]">
          About us
        </p>
        <h2 id="about-title" data-testid="text-about-title" className="dclHome__display dclAbout__fadeUp max-w-[820px] text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
          Clarity begins with understanding.
        </h2>
        <div className="mt-16 grid gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
          <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
            <p className="dclAbout__fadeUp max-w-[260px] text-[15px] leading-6 text-[#6b737a]">
              A considered perspective, for decisions that deserve one.
            </p>
            <div className="dclAbout__rule mt-8 h-px w-16 bg-[#8bbfe8]" />
            <div className="dclAbout__fadeUp mt-8 border-t border-[#080a0d]/20 pt-5 text-[10px] font-semibold uppercase leading-5 tracking-[.13em] text-[#6b737a]">
              {FACTS.map((fact) => (
                <p key={fact}>{fact}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-[1fr_1fr]">
            <div className="space-y-5">
              {BODY.map((paragraph) => (
                <p key={paragraph} className="dclAbout__fadeUp max-w-[420px] text-[16px] leading-7 text-[#171714] sm:text-[17px]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="dclAbout__imageWrap aspect-[4/5] w-full overflow-hidden">
              <img className="h-full w-full object-cover" src={ABOUT_IMAGE} alt="Quietly lit contemporary office interior with long architectural lines" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
