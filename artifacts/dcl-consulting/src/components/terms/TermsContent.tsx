import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { termsDraftNotice, termsSections } from '@/data/terms-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

export function TermsContent() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeId, setActiveId] = useState(termsSections[0]!.id);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclTermsContent__fadeUp', '.dclTermsContent__section'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclTermsContent__fadeUp',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 85%' } },
      );
      gsap.utils.toArray<HTMLElement>('.dclTermsContent__section').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const headings = termsSections.map((section) => document.getElementById(section.id)).filter((el): el is HTMLElement => Boolean(el));
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
    <section id="terms-content" ref={rootRef} aria-labelledby="terms-content-title" className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-20">
      <h2 id="terms-content-title" className="sr-only">
        Terms &amp; conditions details
      </h2>
      <div className="mx-auto max-w-[1280px]">
        <div data-testid="text-terms-draft-notice" className="dclTermsContent__fadeUp border border-[#8bbfe8]/40 bg-[#f2f4f6] px-6 py-5 text-[14px] leading-6 text-[#35404a] sm:px-7">
          {termsDraftNotice}
        </div>

        <nav aria-label="Section jump navigation" className="dclTermsContent__fadeUp mt-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-[#080a0d]/12 pb-6 lg:hidden">
          {termsSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleJumpClick(event, section.id)}
              data-testid={`link-terms-jump-${section.id}`}
              aria-current={activeId === section.id ? 'true' : undefined}
              className="text-[13px] font-medium text-[#35404a] outline-none transition-colors duration-300 hover:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              style={{ color: activeId === section.id ? '#080a0d' : undefined, borderBottom: activeId === section.id ? '1px solid #8bbfe8' : '1px solid transparent' }}
            >
              {section.heading}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="dclHome__eyebrow text-[#6b737a]">On This Page</p>
              <ul className="mt-5 flex flex-col gap-1 border-l border-[#080a0d]/12">
                {termsSections.map((section) => {
                  const active = activeId === section.id;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={(event) => handleJumpClick(event, section.id)}
                        data-testid={`link-terms-toc-${section.id}`}
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
              {termsSections.map((section) => (
                <div key={section.id} id={section.id} data-testid={`terms-section-${section.id}`} className="dclTermsContent__section scroll-mt-28">
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
                    {section.facts && (
                      <dl className="mt-2 flex flex-col gap-2 border-t border-[#080a0d]/12 pt-4">
                        {section.facts.map((fact) => (
                          <div key={fact.label} className="flex flex-wrap gap-x-3 text-[15px] leading-6">
                            <dt className="font-semibold text-[#080a0d]">{fact.label}:</dt>
                            <dd className="text-[#35404a]">{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {section.links && (
                      <div className="mt-1 flex flex-wrap gap-x-8 gap-y-2">
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            data-testid={`link-terms-inline-${section.id}`}
                            className="group inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[.08em] text-[#080a0d] transition-colors duration-300 hover:text-[#4f718c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                          >
                            {link.label}
                            <ArrowUpRight size={13} strokeWidth={1.4} className="text-[#4f718c] transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                          </Link>
                        ))}
                      </div>
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
