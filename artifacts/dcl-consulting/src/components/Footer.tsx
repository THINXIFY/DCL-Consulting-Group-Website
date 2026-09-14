import { Link } from 'wouter';
import { companyFacts } from '@/data/home-content';

const NAV_LINKS: Array<[string, string]> = [
  ['About us', '/about'],
  ['Expertise', '/expertise'],
  ['Our approach', '/approach'],
  ['Industries', '/industries'],
];

const REGISTRATION_FACTS = companyFacts.filter((fact) => fact.label !== 'Director');

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#080a0d] px-6 py-16 text-white sm:px-10 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 border-b border-white/12 pb-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" data-testid="link-footer-home" className="flex items-center gap-3" aria-label="DCL Consulting and Investments Limited">
              <span className="flex h-8 w-8 items-center justify-center border border-[#8bbfe8] text-[12px] font-bold tracking-[-.08em] text-[#8bbfe8]">DCL</span>
              <span className="text-[11px] font-semibold uppercase leading-[1.1] tracking-[.17em] text-white">
                DCL Consulting
                <br />& Investments
              </span>
            </Link>
            <p className="mt-6 max-w-[320px] text-[15px] leading-6 text-white/55">
              Independent investment consulting and strategic decision support.
            </p>
            <a
              href="/#about"
              data-testid="link-footer-cta"
              className="mt-8 inline-flex items-center border-b border-[#8bbfe8] pb-1 text-[11px] font-semibold uppercase tracking-[.15em] text-white transition-colors hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Start a conversation
            </a>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="dclHome__eyebrow text-white/40">Navigate</p>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Footer navigation">
              {NAV_LINKS.map(([label, href]) =>
                href.startsWith('/#') ? (
                  <a
                    key={href}
                    href={href}
                    data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}
                    className="text-[14px] text-white/70 transition-colors hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}
                    className="text-[14px] text-white/70 transition-colors hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                  >
                    {label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="lg:col-span-4 lg:col-start-10">
            <p className="dclHome__eyebrow text-white/40">Company</p>
            <div className="mt-5 flex flex-col gap-3">
              {REGISTRATION_FACTS.map((fact) => (
                <p key={fact.label} data-testid={`text-footer-fact-${fact.label.toLowerCase().replaceAll(' ', '-')}`} className="text-[14px] leading-6 text-white/55">
                  <span className="text-white/35">{fact.label}: </span>
                  {fact.value}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p data-testid="text-footer-copyright" className="text-[11px] uppercase tracking-[.12em] text-white/35">
            &copy; {year} DCL Consulting and Investments Limited.
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#8bbfe8]">Clarity Before Capital.</p>
        </div>
      </div>
    </footer>
  );
}
