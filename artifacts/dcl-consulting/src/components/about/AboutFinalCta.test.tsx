import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutFinalCta } from './AboutFinalCta';

describe('AboutFinalCta', () => {
  it('renders the headline, supporting copy, both CTAs, and the closing line', () => {
    render(<AboutFinalCta />);
    expect(screen.getByTestId('text-about-final-title')).toHaveTextContent('Bring greater clarity');
    expect(screen.getByTestId('text-about-final-title')).toHaveTextContent('to the next decision.');
    expect(screen.getByTestId('text-about-final-supporting')).toHaveTextContent(/independent perspective focused on what matters/i);

    const primary = screen.getByTestId('link-about-final-primary');
    expect(primary).toHaveTextContent('Start a Conversation');
    expect(primary).toHaveAttribute('href', '/#about');

    const secondary = screen.getByTestId('link-about-final-secondary');
    expect(secondary).toHaveTextContent('Explore Our Expertise');
    expect(secondary).toHaveAttribute('href', '/#expertise');

    expect(screen.getByTestId('text-about-final-closing')).toHaveTextContent('Clarity Before Capital.');
  });

  it('gives the primary CTA an explicit dark text color regardless of inherited styles', () => {
    render(<AboutFinalCta />);
    const primary = screen.getByTestId('link-about-final-primary');
    expect(primary.className).toContain('text-[#080a0d]');
  });

  it('contains no em-dash characters', () => {
    render(<AboutFinalCta />);
    const section = document.getElementById('about-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
