import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutHero } from './AboutHero';

describe('AboutHero', () => {
  it('renders the eyebrow, two-line headline kept as specified, intro, supporting copy, and the closing statement as one line (not pills)', () => {
    render(<AboutHero />);
    const section = document.getElementById('about-hero');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-about-hero-eyebrow')).toHaveTextContent('About DCL');

    const title = screen.getByTestId('text-about-hero-title');
    expect(title).toHaveTextContent('Clarity begins');
    expect(title).toHaveTextContent('with understanding.');

    expect(screen.getByText(/independent investment consulting and strategic decision support/i)).toBeInTheDocument();
    expect(screen.getByText(/commercial understanding, financial perspective/i)).toBeInTheDocument();

    const meta = screen.getByTestId('text-about-hero-meta');
    expect(meta).toHaveTextContent('Independent perspective. Disciplined analysis. Clearer decisions.');
    // Rendered as one quiet line, not three separate pill/badge elements.
    expect(meta.querySelectorAll('span, div')).toHaveLength(0);
  });

  it('renders a single institutional image, not nature/landscape imagery', () => {
    render(<AboutHero />);
    const image = screen.getByTestId('img-about-hero');
    expect(image.getAttribute('alt')?.toLowerCase()).not.toMatch(/mountain|forest|tree|landscape|nature/);
  });

  it('contains no numbering or em-dash characters', () => {
    render(<AboutHero />);
    const section = document.getElementById('about-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
