import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Mark() {
  return (
    <span className="flex items-center gap-3" aria-label="DCL Consulting and Investments Limited">
      <span className="flex h-8 w-8 items-center justify-center border border-[#8bbfe8] text-[12px] font-bold tracking-[-.08em] text-[#8bbfe8]">DCL</span>
      <span className="hidden text-[11px] font-semibold uppercase leading-[1.1] tracking-[.17em] text-white sm:block">DCL Consulting<br />& Investments</span>
    </span>
  );
}

const NAV_LINKS: Array<[string, string]> = [
  ['About us', '#about'],
  ['Our expertise', '#expertise'],
  ['Our approach', '#approach'],
  ['Industries', '#industries'],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <a href="#top" data-testid="link-home"><Mark /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
              className="text-[11px] font-medium uppercase tracking-[.12em] text-white/70 transition-colors hover:text-[#c6e3fa] focus-visible:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#about"
          data-testid="link-start-conversation"
          className="hidden border-b border-[#8bbfe8] pb-1 text-[11px] font-semibold uppercase tracking-[.15em] text-white transition-colors hover:text-[#c6e3fa] focus-visible:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] sm:block"
        >
          Start a conversation
        </a>
        <button
          type="button"
          data-testid="button-mobile-menu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] md:hidden"
        >
          {open ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-[#080a0d]/95 px-6 py-5 md:hidden" aria-label="Mobile navigation">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}
              className="block border-b border-white/10 py-4 text-[11px] font-medium uppercase tracking-[.14em] text-white/80"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
