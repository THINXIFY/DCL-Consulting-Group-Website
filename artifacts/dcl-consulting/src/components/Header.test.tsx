import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import { allMegaMenuServices, servicesMegaMenu } from '@/data/services-nav-content';

function setPath(path: string) {
  window.history.pushState({}, '', path);
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
  fireEvent.scroll(window);
}

function slug(label: string) {
  return label.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('Header', () => {
  afterEach(() => {
    setPath('/');
    setScrollY(0);
    document.body.style.overflow = '';
  });

  it('renders the primary desktop nav links with no numbering', () => {
    render(<Header />);
    for (const label of ['Home', 'About', 'Services', 'Expertise', 'Approach', 'Industries', 'Team']) {
      const link = screen.getByTestId(`link-nav-${slug(label)}`);
      expect(link).toHaveTextContent(label);
      expect(link.textContent).not.toMatch(/\d/);
    }
  });

  it('links the logo home and routes every primary nav item correctly', () => {
    render(<Header />);
    expect(screen.getByTestId('link-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('link-nav-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('link-nav-about')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('link-nav-services')).toHaveAttribute('href', '/services');
    expect(screen.getByTestId('link-nav-expertise')).toHaveAttribute('href', '/expertise');
    expect(screen.getByTestId('link-nav-approach')).toHaveAttribute('href', '/approach');
    expect(screen.getByTestId('link-nav-industries')).toHaveAttribute('href', '/industries');
    expect(screen.getByTestId('link-nav-team')).toHaveAttribute('href', '/team');
  });

  it('renders the "Get in Touch" CTA routing to /contact, never with white text', () => {
    render(<Header />);
    const cta = screen.getByTestId('link-header-contact');
    expect(cta).toHaveTextContent('Get in Touch');
    expect(cta).toHaveAttribute('href', '/contact');
    expect(cta.className).not.toMatch(/text-white/);
  });

  it('marks Home active only at "/", and inactive elsewhere', () => {
    render(<Header />);
    expect(screen.getByTestId('link-nav-home')).toHaveAttribute('aria-current', 'page');

    setPath('/about');
    render(<Header />);
    expect(screen.getAllByTestId('link-nav-home').at(-1)).not.toHaveAttribute('aria-current');
  });

  it('marks About as active on /about', () => {
    setPath('/about');
    render(<Header />);
    expect(screen.getByTestId('link-nav-about')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('link-nav-expertise')).not.toHaveAttribute('aria-current');
  });

  it('marks Services active on /services and on nested service detail routes', () => {
    setPath('/services/real-estate-investment-advisory');
    render(<Header />);
    expect(screen.getByTestId('link-nav-services')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('link-nav-about')).not.toHaveAttribute('aria-current');
  });

  it('marks Expertise, Approach and Industries active on their own routes', () => {
    setPath('/expertise');
    render(<Header />);
    expect(screen.getByTestId('link-nav-expertise')).toHaveAttribute('aria-current', 'page');

    setPath('/approach');
    render(<Header />);
    expect(screen.getAllByTestId('link-nav-approach').at(-1)).toHaveAttribute('aria-current', 'page');

    setPath('/industries');
    render(<Header />);
    expect(screen.getAllByTestId('link-nav-industries').at(-1)).toHaveAttribute('aria-current', 'page');
  });

  describe('scroll state', () => {
    it('starts transparent/hero and switches to the solid scrolled background past the threshold', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header')!;
      expect(header.className).toMatch(/bg-transparent/);

      setScrollY(120);
      expect(header.className).toMatch(/bg-\[#080a0d\]/);
    });

    it('stays transparent with the real logo at the top of Privacy Policy and Terms (both have dark heroes, not the light header state)', () => {
      for (const path of ['/privacy-policy', '/terms']) {
        setPath(path);
        const { container, unmount } = render(<Header />);
        const header = container.querySelector('header')!;
        expect(header.className).toMatch(/bg-transparent/);
        expect(header.className).not.toMatch(/bg-white/);
        expect(screen.getByTestId('img-header-logo')).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('Services mega menu (desktop)', () => {
    it('opens on hover/focus of the Services trigger and lists all ten service pages plus View All Services', () => {
      render(<Header />);
      const trigger = screen.getByTestId('link-nav-services');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.mouseEnter(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('services-mega-menu')).toHaveAttribute('data-open', 'true');

      const viewAll = screen.getByTestId('link-mega-view-all');
      expect(viewAll).toHaveTextContent(servicesMegaMenu.viewAll.label);
      expect(viewAll).toHaveAttribute('href', servicesMegaMenu.viewAll.href);

      for (const service of allMegaMenuServices) {
        const link = screen.getByTestId(`link-mega-${slug(service.label)}`);
        expect(link).toHaveTextContent(service.label);
        expect(link).toHaveTextContent(service.description);
        expect(link).toHaveAttribute('href', service.href);
      }
    });

    it('closes after the pointer leaves both the trigger and the panel', () => {
      vi.useFakeTimers();
      render(<Header />);
      const trigger = screen.getByTestId('link-nav-services');
      fireEvent.mouseEnter(trigger);
      expect(screen.getByTestId('services-mega-menu')).toHaveAttribute('data-open', 'true');

      fireEvent.mouseLeave(trigger);
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByTestId('services-mega-menu')).toHaveAttribute('data-open', 'false');
      vi.useRealTimers();
    });

    it('closes on Escape and returns focus to the trigger', () => {
      render(<Header />);
      const trigger = screen.getByTestId('link-nav-services');
      fireEvent.focus(trigger);
      expect(screen.getByTestId('services-mega-menu')).toHaveAttribute('data-open', 'true');
      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(screen.getByTestId('services-mega-menu')).toHaveAttribute('data-open', 'false');
      expect(trigger).toHaveFocus();
    });

    it('highlights the active service inside the mega menu with aria-current', () => {
      setPath('/services/investment-consulting');
      render(<Header />);
      fireEvent.mouseEnter(screen.getByTestId('link-nav-services'));
      expect(screen.getByTestId('link-mega-investment-consulting')).toHaveAttribute('aria-current', 'page');
      expect(screen.getByTestId('link-mega-asset-portfolio-advisory')).not.toHaveAttribute('aria-current');
    });

    it('lists all four service families with their headings', () => {
      render(<Header />);
      fireEvent.mouseEnter(screen.getByTestId('link-nav-services'));
      for (const group of servicesMegaMenu.groups) {
        expect(screen.getByText(group.heading)).toBeInTheDocument();
      }
    });

    it('does not use decorative numbering anywhere in the mega menu', () => {
      render(<Header />);
      fireEvent.mouseEnter(screen.getByTestId('link-nav-services'));
      const menu = screen.getByTestId('services-mega-menu');
      expect(menu.textContent).not.toMatch(/\b0?[1-9]\b\s*[.)]/);
    });
  });

  describe('mobile navigation', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('opens a full-screen panel on menu button click, with aria-expanded/aria-modal wired correctly', () => {
      render(<Header />);
      const button = screen.getByTestId('button-mobile-menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const panel = screen.getByTestId('mobile-navigation-panel');
      expect(panel).toHaveAttribute('aria-modal', 'true');
      expect(panel).toHaveAttribute('data-open', 'true');
      expect(panel).toHaveAttribute('aria-hidden', 'false');
      expect(screen.getByTestId('link-mobile-about')).toBeInTheDocument();
    });

    it('locks body scroll while open and restores it once the close animation finishes', () => {
      vi.useFakeTimers();
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));
      expect(document.body.style.overflow).toBe('hidden');

      fireEvent.click(screen.getByTestId('button-mobile-menu-close'));
      expect(document.body.style.overflow).toBe('hidden');

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(document.body.style.overflow).toBe('');
      expect(screen.queryByTestId('mobile-navigation-panel')).not.toBeInTheDocument();
    });

    it('closes on Escape immediately (signaled via data-open) and returns focus to the menu trigger, then unmounts after the close animation', () => {
      vi.useFakeTimers();
      render(<Header />);
      const trigger = screen.getByTestId('button-mobile-menu');
      fireEvent.click(trigger);
      const panel = screen.getByTestId('mobile-navigation-panel');
      fireEvent.keyDown(panel, { key: 'Escape' });

      expect(panel).toHaveAttribute('data-open', 'false');
      expect(trigger).toHaveFocus();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.queryByTestId('mobile-navigation-panel')).not.toBeInTheDocument();
    });

    it('traps Tab focus inside the panel while open', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));
      const panel = screen.getByTestId('mobile-navigation-panel');
      const focusables = panel.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      last.focus();
      fireEvent.keyDown(panel, { key: 'Tab' });
      expect(first).toHaveFocus();

      first.focus();
      fireEvent.keyDown(panel, { key: 'Tab', shiftKey: true });
      expect(last).toHaveFocus();
    });

    it('renders exactly the Home/About/Services/Expertise/Approach/Industries/Team set as the primary mobile nav', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));
      for (const label of ['home', 'about', 'services', 'expertise', 'approach', 'industries', 'team']) {
        expect(screen.getByTestId(`link-mobile-${label}`)).toBeInTheDocument();
      }
      expect(screen.getByTestId('link-mobile-about')).toHaveAttribute('href', '/about');
    });

    it('renders the bottom utility area with Insights, the legal pages, the verified email, and a prominent Get in Touch CTA', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));

      const insights = screen.getByTestId('link-mobile-insights');
      expect(insights).toHaveAttribute('href', '/insights');

      expect(screen.getByTestId('link-mobile-privacy-policy')).toHaveAttribute('href', '/privacy-policy');
      expect(screen.getByTestId('link-mobile-terms-conditions')).toHaveAttribute('href', '/terms');
      expect(screen.getByTestId('link-mobile-impressum')).toHaveAttribute('href', '/impressum');

      const email = screen.getByTestId('link-mobile-email');
      expect(email).toHaveTextContent('info@dcl-consulting-group.com');
      expect(email).toHaveAttribute('href', 'mailto:info@dcl-consulting-group.com');

      const cta = screen.getByTestId('link-mobile-cta');
      expect(cta).toHaveTextContent('Get in Touch');
      expect(cta).toHaveAttribute('href', '/contact');
    });

    describe('Services accordion', () => {
      function openMobileMenu() {
        fireEvent.click(screen.getByTestId('button-mobile-menu'));
      }

      it('expands to show View All Services and all ten service pages, grouped under headings, and collapses again', () => {
        render(<Header />);
        openMobileMenu();
        const toggle = screen.getByTestId('button-mobile-services-toggle');
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');

        const viewAll = screen.getByTestId('link-mobile-mega-view-all');
        expect(viewAll).toHaveAttribute('href', servicesMegaMenu.viewAll.href);
        for (const service of allMegaMenuServices) {
          expect(screen.getByTestId(`link-mobile-mega-${slug(service.label)}`)).toHaveAttribute('href', service.href);
        }

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('link-mobile-mega-view-all')).not.toBeInTheDocument();
      });

      it('renders all four group headings in the mobile accordion', () => {
        render(<Header />);
        openMobileMenu();
        fireEvent.click(screen.getByTestId('button-mobile-services-toggle'));
        const panel = document.getElementById('mobile-services-panel');
        for (const group of servicesMegaMenu.groups) {
          expect(panel?.textContent).toContain(group.heading);
        }
      });

      it('highlights the active service when already on a nested service route', () => {
        setPath('/services/wealth-strategy-advisory');
        render(<Header />);
        openMobileMenu();
        fireEvent.click(screen.getByTestId('button-mobile-services-toggle'));
        expect(screen.getByTestId('link-mobile-mega-wealth-strategy-advisory')).toHaveAttribute('aria-current', 'page');
      });

      it('closes the whole mobile menu immediately after tapping a service link, since navigation itself resets it', () => {
        render(<Header />);
        openMobileMenu();
        fireEvent.click(screen.getByTestId('button-mobile-services-toggle'));
        fireEvent.click(screen.getByTestId('link-mobile-mega-investment-consulting'));
        expect(screen.queryByTestId('mobile-navigation-panel')).not.toBeInTheDocument();
      });
    });
  });
});
