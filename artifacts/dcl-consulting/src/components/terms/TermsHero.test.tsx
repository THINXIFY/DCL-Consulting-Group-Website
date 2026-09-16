import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TermsHero } from './TermsHero';

describe('TermsHero', () => {
  it('renders the legal label, headline, lead, supporting copy, and image statement', () => {
    render(<TermsHero />);
    expect(screen.getByTestId('text-terms-hero-label')).toHaveTextContent('Legal');
    expect(screen.getByTestId('text-terms-hero-title')).toHaveTextContent('Terms & Conditions');
    expect(screen.getByTestId('text-terms-hero-lead')).toHaveTextContent(/these terms & conditions explain/i);
    expect(screen.getByTestId('text-terms-hero-supporting')).toHaveTextContent(/please read these terms carefully/i);
    expect(screen.getByTestId('text-terms-hero-statement')).toHaveTextContent('Clarity');
    expect(screen.getByTestId('text-terms-hero-statement')).toHaveTextContent('Responsibility');
    expect(screen.getByTestId('text-terms-hero-statement')).toHaveTextContent('Trust');
  });

  it('renders the header and a real local image', () => {
    render(<TermsHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    const img = screen.getByTestId('img-terms-hero');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/home/'));
    expect(img).toHaveAttribute('alt', expect.stringMatching(/./));
  });

  it('contains no em-dash characters', () => {
    render(<TermsHero />);
    const section = document.getElementById('terms-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
