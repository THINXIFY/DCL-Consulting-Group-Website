import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { impressumSections } from '@/data/impressum-content';
import { ImpressumContent } from './ImpressumContent';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ImpressumContent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders every section with its heading and body content', () => {
    mockMatchMedia(false);
    render(<ImpressumContent />);
    for (const section of impressumSections) {
      const el = screen.getByTestId(`impressum-section-${section.id}`);
      expect(el).toHaveTextContent(section.heading);
      for (const paragraph of section.body) {
        expect(el).toHaveTextContent(paragraph);
      }
    }
  });

  it('renders the registered office and London office as two distinct, correctly labelled addresses', () => {
    mockMatchMedia(false);
    render(<ImpressumContent />);
    const registered = screen.getByTestId('impressum-address-registered-office');
    expect(registered).toHaveTextContent('3 Tallow Wharf');
    expect(registered).toHaveTextContent('SG14 1FF');
    expect(registered.querySelector('address')).not.toBeNull();

    const london = screen.getByTestId('impressum-address-london-office');
    expect(london).toHaveTextContent('5 Beaconsfield Street');
    expect(london).toHaveTextContent('N1C 4EW');
  });

  it('links to the real Companies House officers profile in a new tab', () => {
    mockMatchMedia(false);
    render(<ImpressumContent />);
    const link = screen.getByTestId('link-impressum-inline-company-register-view-official-company-profile');
    expect(link).toHaveAttribute('href', 'https://find-and-update.company-information.service.gov.uk/company/10086906/officers');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('links to the real /privacy-policy, /terms, and /contact routes in the copyright section', () => {
    mockMatchMedia(false);
    render(<ImpressumContent />);
    expect(screen.getByTestId('link-impressum-inline-copyright-privacy-policy')).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByTestId('link-impressum-inline-copyright-terms-conditions')).toHaveAttribute('href', '/terms');
    expect(screen.getByTestId('link-impressum-inline-copyright-contact-dcl')).toHaveAttribute('href', '/contact');
  });

  it('builds the sticky table of contents from the real section headings, and clicking scrolls and marks it active', () => {
    mockMatchMedia(false);
    render(<ImpressumContent />);
    for (const section of impressumSections) {
      expect(screen.getByTestId(`link-impressum-toc-${section.id}`)).toHaveTextContent(section.heading);
    }
    const scrollIntoViewMock = vi.fn();
    const target = document.getElementById('company-register')!;
    target.scrollIntoView = scrollIntoViewMock;

    const link = screen.getByTestId('link-impressum-toc-company-register');
    fireEvent.click(link);
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-current', 'true');
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<ImpressumContent />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<ImpressumContent />);
    const section = document.getElementById('impressum-content');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
