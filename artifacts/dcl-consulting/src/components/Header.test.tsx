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
    for (const label of ['Home', 'About', 'Services', 'Expertise', 'Approach', 'Industries', 'Insights']) {
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
    expect(screen.getByTestId('link-nav-insights')).toHaveAttribute('href', '/insights');
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

    it('uses a solid light background at the top of a light-page route, and switches to the dark scrolled background once scrolled', () => {
      setPath('/privacy-policy');
      const { container } = render(<Header />);
      const header = container.querySelector('header')!;
      expect(header.className).toMatch(/bg-white/);

      setScrollY(120);
      expect(header.className).toMatch(/bg-\[#080a0d\]/);
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
    it('opens a full-screen panel on menu button click, with aria-expanded/aria-modal wired correctly', () => {
      render(<Header />);
      const button = screen.getByTestId('button-mobile-menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      const panel = screen.getByTestId('button-mobile-menu-close').closest('[role="dialog"]');
      expect(panel).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByTestId('link-mobile-about')).toBeInTheDocument();
    });

    it('locks body scroll while open and restores it on close', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));
      expect(document.body.style.overflow).toBe('hidden');
      fireEvent.click(screen.getByTestId('button-mobile-menu-close'));
      expect(document.body.style.overflow).toBe('');
    });

    it('closes on Escape and returns focus to the menu trigger', () => {
      render(<Header />);
      const trigger = screen.getByTestId('button-mobile-menu');
      fireEvent.click(trigger);
      const panel = screen.getByTestId('button-mobile-menu-close').closest('[role="dialog"]')!;
      fireEvent.keyDown(panel, { key: 'Escape' });
      expect(screen.queryByTestId('button-mobile-menu-close')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it('includes Partners and Contact as plain links, in addition to the Home/About/Services/Expertise/Approach/Industries/Insights set', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));
      for (const label of ['home', 'about', 'services', 'expertise', 'approach', 'industries', 'insights', 'partners', 'contact']) {
        expect(screen.getByTestId(`link-mobile-${label}`)).toBeInTheDocument();
      }
      expect(screen.getByTestId('link-mobile-partners')).toHaveAttribute('href', '/partners');
    });

    it('renders the Get in Touch CTA and the closing tagline at the bottom', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('button-mobile-menu'));
      const cta = screen.getByTestId('link-mobile-cta');
      expect(cta).toHaveTextContent('Get in Touch');
      expect(cta).toHaveAttribute('href', '/contact');
      expect(screen.getByText('Clarity Before Capital.')).toBeInTheDocument();
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

      it('closes the whole mobile menu after tapping a service link', () => {
        render(<Header />);
        openMobileMenu();
        fireEvent.click(screen.getByTestId('button-mobile-services-toggle'));
        fireEvent.click(screen.getByTestId('link-mobile-mega-investment-consulting'));
        expect(screen.queryByTestId('link-mobile-mega-investment-consulting')).not.toBeInTheDocument();
      });
    });
  });
});
