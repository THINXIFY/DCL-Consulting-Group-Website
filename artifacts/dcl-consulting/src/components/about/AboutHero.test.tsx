import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutHero } from './AboutHero';

describe('AboutHero', () => {
  it('renders the eyebrow, two-line headline, intro, supporting statement, and a bottom-anchored meta line', () => {
    render(<AboutHero />);
    const section = document.getElementById('about-hero');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-about-hero-eyebrow')).toHaveTextContent('About DCL');

    const title = screen.getByTestId('text-about-hero-title');
    expect(title).toHaveTextContent(/clarity begins/i);
    expect(title).toHaveTextContent(/with understanding/i);

    expect(screen.getByText(/independent investment consulting and strategic decision support/i)).toBeInTheDocument();
    expect(screen.getByText(/commercial understanding, financial perspective/i)).toBeInTheDocument();
    expect(screen.getByTestId('text-about-hero-meta')).toHaveTextContent(/independent perspective\. disciplined analysis\. clearer decisions\./i);
  });

  it('renders a single editorial image (not a full-bleed background)', () => {
    render(<AboutHero />);
    const image = screen.getByAltText(/architectural facade/i);
    expect(image).toBeInTheDocument();
  });

  it('contains no numbering or em-dash characters', () => {
    render(<AboutHero />);
    const section = document.getElementById('about-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
