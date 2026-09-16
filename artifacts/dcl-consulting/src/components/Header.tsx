import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { servicesMegaMenu } from '@/data/services-nav-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

type Theme = 'dark' | 'light';

const LIGHT_PAGE_ROUTES = new Set(['/privacy-policy', '/terms']);
const SCROLL_THRESHOLD = 60;
const MEGA_MENU_CLOSE_DELAY = 160;
const LOGO_SRC = '/images/brand/dcl-logo.png';

function Mark({ theme }: { theme: Theme }) {
  // The logo artwork is a white/light-blue wordmark, so it only reads
  // correctly on dark surfaces. The header is briefly light (bg-white)
  // on /privacy-policy and /terms before the user scrolls - that one
  // state keeps the original text-based monogram instead.
  if (theme === 'dark') {
    return <img src={LOGO_SRC} data-testid="img-header-logo" alt="DCL Consulting and Investments Limited" className="h-7 w-auto sm:h-8 lg:h-9" />;
  }
  return (
    <span className="flex items-center gap-3" aria-label="DCL Consulting and Investments Limited">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#8bbfe8] text-[12px] font-bold tracking-[-.08em] text-[#8bbfe8]">DCL</span>
      <span aria-hidden="true" className="hidden h-5 w-px bg-[#080a0d]/15 sm:block" />
      <span className="hidden text-[11px] font-semibold uppercase leading-[1.1] tracking-[.15em] text-[#080a0d] sm:block">
        DCL Consulting
        <br />
        &amp; Investments
      </span>
    </span>
  );
}

function isNavLinkActive(href: string, location: string): boolean {
  if (href.startsWith('#')) return false;
  if (href === '/') return location === '/';
  if (href === '/services') return location === '/services' || location.startsWith('/services/');
  if (href === '/insights') return location === '/insights' || location.startsWith('/insights/');
  return location === href;
}

function slug(label: string) {
  return label.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

const NAV_LINKS: Array<[string, string]> = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Expertise', '/expertise'],
  ['Approach', '/approach'],
  ['Industries', '/industries'],
  ['Insights', '#insights'],
];

function desktopLinkClass(theme: Theme, isActive: boolean) {
  const base =
    'group relative inline-flex items-center pb-1.5 text-[13px] font-medium tracking-[.02em] outline-none transition-colors duration-[250ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]';
  if (theme === 'light') {
    return `${base} ${isActive ? 'text-[#080a0d]' : 'text-[#080a0d]/60 hover:text-[#080a0d]'}`;
  }
  return `${base} ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`;
}

function DesktopUnderline({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-px origin-left bg-[#8bbfe8] transition-transform duration-[250ms] ease-out group-hover:scale-x-100"
      style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
    />
  );
}

function NavLink({
  href,
  className,
  testId,
  onClick,
  isActive,
  showUnderline = true,
  children,
}: {
  href: string;
  className: string;
  testId: string;
  onClick?: () => void;
  isActive?: boolean;
  showUnderline?: boolean;
  children: ReactNode;
}) {
  const content = (
    <>
      {children}
      {showUnderline && <DesktopUnderline isActive={Boolean(isActive)} />}
    </>
  );
  if (href.startsWith('#')) {
    return (
      <a href={href} data-testid={testId} onClick={onClick} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} data-testid={testId} onClick={onClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {content}
    </Link>
  );
}

function mobileLinkClass(isActive: boolean) {
  return `dclHome__display flex items-center justify-between border-b border-white/10 py-4 text-[clamp(1.6rem,5.5vw,2.1rem)] leading-none tracking-[-.01em] outline-none transition-colors duration-[250ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] ${
    isActive ? 'text-white' : 'text-white/70'
  }`;
}

export function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const servicesTriggerRef = useRef<HTMLAnchorElement>(null);
  const servicesPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressServicesFocusOpen = useRef(false);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const isLightTop = !scrolled && LIGHT_PAGE_ROUTES.has(location);
  const theme: Theme = isLightTop ? 'light' : 'dark';

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    if (!headerRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(headerRef.current, { clearProps: 'all' });
        return;
      }
      gsap.fromTo(headerRef.current, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }, headerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    mobileCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function cancelServicesClose() {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
  }

  function scheduleServicesClose() {
    cancelServicesClose();
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), MEGA_MENU_CLOSE_DELAY);
  }

  useEffect(() => () => cancelServicesClose(), []);

  function handleServicesBlur(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (next && (servicesTriggerRef.current?.contains(next) || servicesPanelRef.current?.contains(next))) return;
    scheduleServicesClose();
  }

  function handleServicesKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setServicesOpen(false);
      // Refocusing the trigger below can itself fire a fresh focus event
      // (e.g. when the menu was opened by hover rather than focus, so the
      // trigger was never genuinely focused) - without this guard, that
      // focus event re-triggers the open handler and undoes the close.
      suppressServicesFocusOpen.current = true;
      servicesTriggerRef.current?.focus();
      suppressServicesFocusOpen.current = false;
    }
  }

  function handleMobileKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setMobileOpen(false);
      mobileMenuButtonRef.current?.focus();
    }
  }

  const servicesActive = isNavLinkActive('/services', location);
  const barPaddingY = scrolled ? 'py-5' : 'py-7 lg:py-8';
  const headerBgClass = scrolled
    ? 'bg-[#080a0d]/[0.96] border-white/10 backdrop-blur-sm'
    : isLightTop
      ? 'bg-white border-[#080a0d]/10'
      : 'bg-transparent border-white/10';

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color] duration-[350ms] ease-out ${headerBgClass}`}
    >
      <div className={`mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-[padding] duration-[350ms] ease-out sm:px-10 lg:px-16 ${barPaddingY}`}>
        <Link href="/" data-testid="link-home" className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]">
          <Mark theme={theme} />
        </Link>

        <nav className="hidden items-center gap-9 min-[1180px]:flex" aria-label="Primary navigation">
          {NAV_LINKS.map(([label, href]) => {
            const isActive = isNavLinkActive(href, location);
            if (label === 'Services') {
              return (
                <Link
                  key={href}
                  ref={servicesTriggerRef}
                  href="/services"
                  data-testid="link-nav-services"
                  aria-current={isActive ? 'page' : undefined}
                  aria-haspopup="true"
                  aria-expanded={servicesOpen}
                  aria-controls="services-mega-menu"
                  className={`${desktopLinkClass(theme, isActive)} inline-flex gap-1.5`}
                  onMouseEnter={() => {
                    cancelServicesClose();
                    setServicesOpen(true);
                  }}
                  onMouseLeave={scheduleServicesClose}
                  onFocus={() => {
                    if (suppressServicesFocusOpen.current) return;
                    cancelServicesClose();
                    setServicesOpen(true);
                  }}
                  onBlur={handleServicesBlur}
                  onKeyDown={handleServicesKeyDown}
                >
                  Services
                  <ChevronDown size={12} strokeWidth={1.6} aria-hidden="true" className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                  <DesktopUnderline isActive={isActive || servicesOpen} />
                </Link>
              );
            }
            return (
              <NavLink key={href} href={href} isActive={isActive} testId={`link-nav-${slug(label)}`} className={desktopLinkClass(theme, isActive)}>
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            data-testid="link-header-contact"
            className="group hidden shrink-0 items-center gap-3 bg-[#c6e3fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:bg-[#8bbfe8] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d] sm:inline-flex"
          >
            Get in Touch
            <ArrowRight size={14} strokeWidth={1.4} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
          </Link>

          <button
            ref={mobileMenuButtonRef}
            type="button"
            data-testid="button-mobile-menu"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-panel"
            onClick={() => setMobileOpen((value) => !value)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center outline-none transition-colors duration-[250ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] min-[1180px]:hidden ${
              theme === 'light' ? 'text-[#080a0d]' : 'text-white'
            }`}
          >
            {mobileOpen ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      <div
        ref={servicesPanelRef}
        id="services-mega-menu"
        role="menu"
        aria-label="Services menu"
        data-testid="services-mega-menu"
        data-open={servicesOpen}
        onMouseEnter={cancelServicesClose}
        onMouseLeave={scheduleServicesClose}
        onBlur={handleServicesBlur}
        onKeyDown={handleServicesKeyDown}
        className={`absolute inset-x-0 top-full hidden transition-[opacity,transform] ease-out min-[1180px]:block ${prefersReducedMotion ? 'duration-[0ms]' : 'duration-300'} ${
          servicesOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="border-t border-white/10 bg-[#0a0c10]/[0.98] shadow-[0_28px_70px_rgba(0,0,0,.5)]">
          <div className="mx-auto max-h-[calc(100dvh-160px)] max-w-[1440px] overflow-y-auto px-6 py-11 sm:px-10 lg:px-16 lg:py-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
              <div className="border-b border-white/10 pb-8 lg:border-b-0 lg:border-r lg:border-white/10 lg:pb-0 lg:pr-12">
                <p className="dclHome__eyebrow text-[#8bbfe8]">{servicesMegaMenu.label}</p>
                <p className="dclHome__display mt-4 max-w-[24ch] text-[1.3rem] leading-[1.22] text-white">{servicesMegaMenu.description}</p>
                <Link
                  href={servicesMegaMenu.viewAll.href}
                  data-testid="link-mega-view-all"
                  className="group mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-white outline-none transition-colors duration-300 hover:text-[#8bbfe8] focus-visible:text-[#8bbfe8]"
                >
                  {servicesMegaMenu.viewAll.label}
                  <ArrowRight size={13} strokeWidth={1.4} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
                {servicesMegaMenu.groups.map((group, groupIndex) => (
                  <div
                    key={group.heading}
                    style={servicesOpen && !prefersReducedMotion ? { transitionDelay: `${groupIndex * 40}ms` } : undefined}
                    className={`transition-[opacity,transform] duration-300 ease-out ${servicesOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-white/35">{group.heading}</p>
                    <div className="mt-4 flex flex-col gap-3.5 border-t border-white/10 pt-4">
                      {group.services.map((service) => {
                        const serviceActive = location === service.href;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            data-testid={`link-mega-${slug(service.label)}`}
                            aria-current={serviceActive ? 'page' : undefined}
                            className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                          >
                            <span
                              className={`inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors duration-300 ${
                                serviceActive ? 'text-[#8bbfe8]' : 'text-white group-hover:text-[#8bbfe8]'
                              }`}
                            >
                              {service.label}
                              <ArrowRight
                                size={12}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className={`transition-all duration-300 ${serviceActive ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:translate-x-1 group-hover:opacity-100'}`}
                              />
                            </span>
                            <span className={`mt-1.5 block h-px bg-[#8bbfe8] transition-all duration-300 ${serviceActive ? 'w-7' : 'w-0 group-hover:w-7'}`} />
                            <span
                              className={`mt-1.5 block max-w-[30ch] text-[12.5px] leading-5 transition-colors duration-300 ${
                                serviceActive ? 'text-white/70' : 'text-white/40 group-hover:text-white/70'
                              }`}
                            >
                              {service.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-navigation-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onKeyDown={handleMobileKeyDown}
          className="fixed inset-0 top-0 z-[70] flex flex-col bg-[#080a0d] min-[1180px]:hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 sm:px-10">
            <Link href="/" data-testid="link-mobile-home-logo" onClick={() => setMobileOpen(false)} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]">
              <Mark theme="dark" />
            </Link>
            <button
              ref={mobileCloseRef}
              type="button"
              data-testid="button-mobile-menu-close"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              <X size={22} strokeWidth={1.4} />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-6 pb-8 sm:px-10">
            {NAV_LINKS.map(([label, href]) => {
              const isActive = isNavLinkActive(href, location);
              if (label === 'Services') {
                return (
                  <div key={href} className="border-b border-white/10">
                    <div className="flex items-center">
                      <NavLink
                        href="/services"
                        onClick={() => setMobileOpen(false)}
                        isActive={servicesActive}
                        showUnderline={false}
                        testId="link-mobile-services"
                        className={`${mobileLinkClass(servicesActive)} flex-1 border-b-0`}
                      >
                        Services
                      </NavLink>
                      <button
                        type="button"
                        data-testid="button-mobile-services-toggle"
                        aria-expanded={mobileServicesOpen}
                        aria-controls="mobile-services-panel"
                        aria-label={mobileServicesOpen ? 'Collapse Services menu' : 'Expand Services menu'}
                        onClick={() => setMobileServicesOpen((value) => !value)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center text-white/70 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                      >
                        <ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {mobileServicesOpen && (
                      <div id="mobile-services-panel" className="flex flex-col pb-4 pl-1">
                        <Link
                          href={servicesMegaMenu.viewAll.href}
                          onClick={() => setMobileOpen(false)}
                          data-testid="link-mobile-mega-view-all"
                          className="flex min-h-[44px] items-center border-b border-white/10 text-[11px] font-semibold uppercase tracking-[.12em] text-white/70"
                        >
                          {servicesMegaMenu.viewAll.label}
                        </Link>
                        {servicesMegaMenu.groups.map((group) => (
                          <div key={group.heading}>
                            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.14em] text-white/35">{group.heading}</p>
                            {group.services.map((service) => {
                              const serviceActive = location === service.href;
                              return (
                                <Link
                                  key={service.href}
                                  href={service.href}
                                  onClick={() => setMobileOpen(false)}
                                  data-testid={`link-mobile-mega-${slug(service.label)}`}
                                  aria-current={serviceActive ? 'page' : undefined}
                                  className={`flex min-h-[44px] items-center border-b border-white/10 py-2 text-[14px] font-medium ${serviceActive ? 'text-[#8bbfe8]' : 'text-white/85'}`}
                                >
                                  {service.label}
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  isActive={isActive}
                  showUnderline={false}
                  testId={`link-mobile-${slug(label)}`}
                  className={mobileLinkClass(isActive)}
                >
                  {label}
                </NavLink>
              );
            })}
            <Link
              href="/partners"
              onClick={() => setMobileOpen(false)}
              data-testid="link-mobile-partners"
              aria-current={isNavLinkActive('/partners', location) ? 'page' : undefined}
              className={mobileLinkClass(isNavLinkActive('/partners', location))}
            >
              Partners
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              data-testid="link-mobile-contact"
              aria-current={isNavLinkActive('/contact', location) ? 'page' : undefined}
              className={mobileLinkClass(isNavLinkActive('/contact', location))}
            >
              Contact
            </Link>

            <div className="mt-10 flex flex-col gap-6">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                data-testid="link-mobile-cta"
                className="group inline-flex w-fit items-center gap-3 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:bg-[#8bbfe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                Get in Touch
                <ArrowRight size={14} strokeWidth={1.4} className="text-[#080a0d] transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
              <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-white/35">Clarity Before Capital.</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
