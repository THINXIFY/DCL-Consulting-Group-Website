import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivacyContent } from './PrivacyContent';
import { privacySections } from '@/data/privacy-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivacyContent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the real company facts inside the who-we-are section', () => {
    mockMatchMedia(false);
    render(<PrivacyContent />);
    const section = screen.getByTestId('privacy-section-who-we-are');
    expect(section).toHaveTextContent('10086906');
    expect(section).toHaveTextContent('info@dcl-consulting-group.com');
  });

  it('renders real links to /terms and /contact in the contact section', () => {
    mockMatchMedia(false);
    render(<PrivacyContent />);
    expect(screen.getByTestId('link-privacy-inline-contact-terms-conditions')).toHaveAttribute('href', '/terms');
    expect(screen.getByTestId('link-privacy-inline-contact-contact-dcl')).toHaveAttribute('href', '/contact');
  });

  it('renders every policy section with its heading and body content', () => {
    mockMatchMedia(false);
    render(<PrivacyContent />);
    for (const section of privacySections) {
      const el = screen.getByTestId(`privacy-section-${section.id}`);
      expect(el).toHaveTextContent(section.heading);
      for (const paragraph of section.body) {
        expect(el).toHaveTextContent(paragraph);
      }
      if (section.bullets) {
        for (const bullet of section.bullets) {
          expect(el).toHaveTextContent(bullet);
        }
      }
    }
  });

  it('renders a table-of-contents link for every section', () => {
    mockMatchMedia(false);
    render(<PrivacyContent />);
    for (const section of privacySections) {
      const link = screen.getByTestId(`link-privacy-toc-${section.id}`);
      expect(link).toHaveTextContent(section.heading);
      expect(link).toHaveAttribute('href', `#${section.id}`);
    }
  });

  it('marks the first section active by default, and updates aria-current when a different TOC link is clicked', () => {
    mockMatchMedia(false);
    render(<PrivacyContent />);
    const first = privacySections[0]!;
    const second = privacySections[1]!;
    expect(screen.getByTestId(`link-privacy-toc-${first.id}`)).toHaveAttribute('aria-current', 'true');
    expect(screen.getByTestId(`link-privacy-toc-${second.id}`)).not.toHaveAttribute('aria-current');

    fireEvent.click(screen.getByTestId(`link-privacy-toc-${second.id}`));
    expect(screen.getByTestId(`link-privacy-toc-${second.id}`)).toHaveAttribute('aria-current', 'true');
    expect(screen.getByTestId(`link-privacy-toc-${first.id}`)).not.toHaveAttribute('aria-current');
  });

  it('also renders a mobile jump-navigation link for every section', () => {
    mockMatchMedia(false);
    render(<PrivacyContent />);
    for (const section of privacySections) {
      expect(screen.getByTestId(`link-privacy-jump-${section.id}`)).toHaveAttribute('href', `#${section.id}`);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<PrivacyContent />)).not.toThrow();
  });
});
