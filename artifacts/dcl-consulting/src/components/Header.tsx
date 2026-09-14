import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

function Mark() {
  return (
    <span className="flex items-center gap-3" aria-label="DCL Consulting and Investments Limited">
      <span className="flex h-8 w-8 items-center justify-center border border-[#8bbfe8] text-[12px] font-bold tracking-[-.08em] text-[#8bbfe8]">DCL</span>
      <span className="hidden text-[11px] font-semibold uppercase leading-[1.1] tracking-[.17em] text-white sm:block">DCL Consulting<br />& Investments</span>
    </span>
  );
}

const NAV_LINKS: Array<[string, string]> = [
  ['About us', '/about'],
  ['Expertise', '/expertise'],
  ['Our approach', '/approach'],
  ['Industries', '/industries'],
];

const DESKTOP_LINK_BASE =
  'border-b-2 pb-1 text-[11px] font-medium uppercase tracking-[.12em] transition-colors hover:text-[#c6e3fa] focus-visible:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]';
const DESKTOP_LINK_ACTIVE = 'border-[#8bbfe8] text-white';
const DESKTOP_LINK_INACTIVE = 'border-transparent text-white/70';

const MOBILE_LINK_BASE = 'block border-b border-white/10 py-4 text-[11px] font-medium uppercase tracking-[.14em] transition-[color,padding-left]';
const MOBILE_LINK_ACTIVE = 'border-l-2 border-[#8bbfe8] pl-3 text-white';
const MOBILE_LINK_INACTIVE = 'pl-0 text-white/80';

function NavLink({
  href,
  className,
  testId,
  onClick,
  isActive,
  children,
}: {
  href: string;
  className: string;
  testId: string;
  onClick?: () => void;
  isActive?: boolean;
  children: ReactNode;
}) {
  if (href.startsWith('#')) {
    return (
      <a href={href} data-testid={testId} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} data-testid={testId} onClick={onClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <Link href="/" data-testid="link-home"><Mark /></Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {NAV_LINKS.map(([label, href]) => {
            const isActive = !href.startsWith('#') && location === href;
            return (
              <NavLink
                key={href}
                href={href}
                isActive={isActive}
                testId={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
                className={`${DESKTOP_LINK_BASE} ${isActive ? DESKTOP_LINK_ACTIVE : DESKTOP_LINK_INACTIVE}`}
              >
                {label}
              </NavLink>
            );
          })}
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
          className="text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] lg:hidden"
        >
          {open ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-[#080a0d] px-6 py-5 lg:hidden" aria-label="Mobile navigation">
          {NAV_LINKS.map(([label, href]) => {
            const isActive = !href.startsWith('#') && location === href;
            return (
              <NavLink
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                isActive={isActive}
                testId={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}
                className={`${MOBILE_LINK_BASE} ${isActive ? MOBILE_LINK_ACTIVE : MOBILE_LINK_INACTIVE}`}
              >
                {label}
              </NavLink>
            );
          })}
        </nav>
      )}
    </header>
  );
}
