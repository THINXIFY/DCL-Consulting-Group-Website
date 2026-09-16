import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PartnersHero } from './PartnersHero';

describe('PartnersHero', () => {
  it('renders the eyebrow, headline, lead, body, both CTAs, and the statement', () => {
    render(<PartnersHero />);
    expect(screen.getByTestId('text-partners-hero-label')).toHaveTextContent('Strategic Partnerships');
    expect(screen.getByTestId('text-partners-hero-title')).toHaveTextContent('Stronger perspectives');
    expect(screen.getByTestId('text-partners-hero-title')).toHaveTextContent('through collaboration.');
    expect(screen.getByTestId('text-partners-hero-lead')).toHaveTextContent(/the right relationships/i);
    expect(screen.getByTestId('text-partners-hero-body')).toHaveTextContent(/dcl works with organisations/i);

    const primary = screen.getByTestId('link-partners-hero-primary');
    expect(primary).toHaveTextContent('Discuss a Partnership');
    expect(primary).toHaveAttribute('href', '/contact');
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-partners-hero-secondary');
    expect(secondary).toHaveTextContent('Our Approach');
    expect(secondary).toHaveAttribute('href', '/approach');

    expect(screen.getByTestId('text-partners-hero-statement')).toHaveTextContent('Shared thinking.');
  });

  it('renders a real, locally hosted image', () => {
    render(<PartnersHero />);
    const img = screen.getByTestId('img-partners-hero');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/home/'));
    expect(img).toHaveAttribute('alt', expect.stringMatching(/./));
  });

  it('contains no em-dash characters', () => {
    render(<PartnersHero />);
    const section = document.getElementById('partners-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
