import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InternationalPerspective } from './InternationalPerspective';

describe('InternationalPerspective', () => {
  it('renders the eyebrow, headline, body, CTA, side statement, and a real image', () => {
    render(<InternationalPerspective />);
    const section = document.getElementById('international-perspective');
    expect(section?.textContent).toMatch(/international perspective/i);
    expect(section?.textContent).toMatch(/perspective/i);
    expect(section?.textContent).toMatch(/without borders/i);

    const cta = screen.getByTestId('link-intl-perspective-cta');
    expect(cta).toHaveTextContent('Explore Our Industries');
    expect(cta).toHaveAttribute('href', '/industries');

    expect(screen.getByTestId('text-intl-perspective-statement')).toHaveTextContent('Global context.');

    const img = screen.getByTestId('img-intl-perspective');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/home/'));
    expect(img).not.toHaveAttribute('src', expect.stringContaining('map'));
  });

  it('does not use a fake world map or connected-node graphic', () => {
    render(<InternationalPerspective />);
    const section = document.getElementById('international-perspective');
    expect(section?.querySelectorAll('svg[class*="map"], [data-testid*="world-map"], [data-testid*="node"]').length).toBe(0);
  });

  it('contains no em-dash characters', () => {
    render(<InternationalPerspective />);
    const section = document.getElementById('international-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
