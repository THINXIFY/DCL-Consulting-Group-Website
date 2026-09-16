import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { privacyDraftNotice, privacySections } from '@/data/privacy-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function PrivacyContent() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeId, setActiveId] = useState(privacySections[0]!.id);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclPrivacyContent__fadeUp', '.dclPrivacyContent__section'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclPrivacyContent__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 85%' } },
      );
      gsap.utils.toArray<HTMLElement>('.dclPrivacyContent__section').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const headings = privacySections.map((section) => document.getElementById(section.id)).filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  function handleJumpClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    setActiveId(id);
    window.history.replaceState(null, '', `#${id}`);
  }

  return (
    <section id="privacy-content" ref={rootRef} aria-labelledby="privacy-content-title" className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-20">
      <h2 id="privacy-content-title" className="sr-only">
        Privacy policy details
      </h2>
      <div className="mx-auto max-w-[1280px]">
        <div data-testid="text-privacy-draft-notice" className="dclPrivacyContent__fadeUp border border-[#8bbfe8]/40 bg-[#f2f4f6] px-6 py-5 text-[14px] leading-6 text-[#35404a] sm:px-7">
          {privacyDraftNotice}
        </div>

        <nav aria-label="Section jump navigation" className="dclPrivacyContent__fadeUp mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-[#080a0d]/12 pb-6 lg:hidden">
          {privacySections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleJumpClick(event, section.id)}
              data-testid={`link-privacy-jump-${section.id}`}
              aria-current={activeId === section.id ? 'true' : undefined}
              className="text-[13px] font-medium text-[#35404a] outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              style={{ color: activeId === section.id ? '#080a0d' : undefined, borderBottom: activeId === section.id ? '1px solid #8bbfe8' : '1px solid transparent' }}
            >
              {section.heading}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <nav aria-label="Table of contents" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="dclHome__eyebrow text-[#6b737a]">On This Page</p>
              <ul className="mt-5 flex flex-col gap-1 border-l border-[#080a0d]/12">
                {privacySections.map((section) => {
                  const active = activeId === section.id;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={(event) => handleJumpClick(event, section.id)}
                        data-testid={`link-privacy-toc-${section.id}`}
                        aria-current={active ? 'true' : undefined}
                        className="block py-1.5 pl-4 text-[14px] leading-5 outline-none transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                        style={{
                          color: active ? '#080a0d' : '#6b737a',
                          fontWeight: active ? 600 : 400,
                          borderLeft: active ? '2px solid #8bbfe8' : '2px solid transparent',
                          marginLeft: '-1px',
                        }}
                      >
                        {section.heading}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="lg:col-span-9">
            <div className="flex max-w-[720px] flex-col gap-14">
              {privacySections.map((section) => (
                <div key={section.id} id={section.id} data-testid={`privacy-section-${section.id}`} className="dclPrivacyContent__section scroll-mt-28">
                  <h3 className="dclHome__display text-[1.7rem] leading-[1.15] tracking-[-.01em] text-[#080a0d]">{section.heading}</h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-[16.5px] leading-[1.75] text-[#35404a]">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="flex flex-col gap-3">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-[16.5px] leading-[1.7] text-[#35404a]">
                            <span aria-hidden="true" className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#8bbfe8]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
