import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { termsSections } from '@/data/terms-content';
import { TermsContent } from './TermsContent';

describe('TermsContent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the draft notice and every section heading with its body copy', () => {
    render(<TermsContent />);
    expect(screen.getByTestId('text-terms-draft-notice')).toHaveTextContent(/working draft/i);
    for (const section of termsSections) {
      const el = screen.getByTestId(`terms-section-${section.id}`);
      expect(el).toHaveTextContent(section.heading);
      expect(el).toHaveTextContent(section.body[0]!);
    }
  });

  it('renders the company facts inside the about-dcl section', () => {
    render(<TermsContent />);
    const section = screen.getByTestId('terms-section-about-dcl');
    expect(section).toHaveTextContent('10086906');
    expect(section).toHaveTextContent('England and Wales');
  });

  it('renders bullet points for the use-of-website section', () => {
    render(<TermsContent />);
    const section = screen.getByTestId('terms-section-use-of-website');
    expect(section).toHaveTextContent(/breaches applicable law/i);
    expect(section.querySelectorAll('li').length).toBeGreaterThanOrEqual(6);
  });

  it('renders a real link to the Privacy Policy page and a real link to Contact', () => {
    render(<TermsContent />);
    expect(screen.getByTestId('link-terms-inline-privacy-cookies')).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByTestId('link-terms-inline-contact')).toHaveAttribute('href', '/contact');
  });

  it('builds the sticky table of contents from the real section headings, and clicking scrolls and marks it active', () => {
    render(<TermsContent />);
    for (const section of termsSections) {
      expect(screen.getByTestId(`link-terms-toc-${section.id}`)).toHaveTextContent(section.heading);
    }
    const scrollIntoViewMock = vi.fn();
    const target = document.getElementById('use-of-website')!;
    target.scrollIntoView = scrollIntoViewMock;

    const link = screen.getByTestId('link-terms-toc-use-of-website');
    fireEvent.click(link);
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-current', 'true');
  });

  it('contains no decorative numbering or em-dash characters', () => {
    render(<TermsContent />);
    const section = document.getElementById('terms-content');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
