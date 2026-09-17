import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { termsSections } from '@/data/terms-content';
import { TermsContent } from './TermsContent';

describe('TermsContent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders every section heading with its body copy', () => {
    render(<TermsContent />);
    for (const section of termsSections) {
      const el = screen.getByTestId(`terms-section-${section.id}`);
      expect(el).toHaveTextContent(section.heading);
      expect(el).toHaveTextContent(section.body[0]!);
    }
  });

  it('renders the real company facts inside the about-dcl section', () => {
    render(<TermsContent />);
    const section = screen.getByTestId('terms-section-about-dcl');
    expect(section).toHaveTextContent('10086906');
    expect(section).toHaveTextContent('info@dcl-consulting-group.com');
  });

  it('renders bullet points for the use-of-the-website section', () => {
    render(<TermsContent />);
    const section = screen.getByTestId('terms-section-use-of-the-website');
    expect(section).toHaveTextContent(/breaches applicable law/i);
    expect(section.querySelectorAll('li').length).toBeGreaterThanOrEqual(6);
  });

  it('renders a real link to the Privacy Policy page and real links in the contact section', () => {
    render(<TermsContent />);
    expect(screen.getByTestId('link-terms-inline-privacy-privacy-policy')).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByTestId('link-terms-inline-contact-privacy-policy')).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByTestId('link-terms-inline-contact-contact-dcl')).toHaveAttribute('href', '/contact');
  });

  it('builds the sticky table of contents from the real section headings, and clicking scrolls and marks it active', () => {
    render(<TermsContent />);
    for (const section of termsSections) {
      expect(screen.getByTestId(`link-terms-toc-${section.id}`)).toHaveTextContent(section.heading);
    }
    const scrollIntoViewMock = vi.fn();
    const target = document.getElementById('use-of-the-website')!;
    target.scrollIntoView = scrollIntoViewMock;

    const link = screen.getByTestId('link-terms-toc-use-of-the-website');
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
