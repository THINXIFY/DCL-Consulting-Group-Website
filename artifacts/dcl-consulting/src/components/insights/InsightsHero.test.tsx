import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InsightsHero } from './InsightsHero';

describe('InsightsHero', () => {
  it('renders the eyebrow, headline, and lead copy', () => {
    render(<InsightsHero />);
    const section = document.getElementById('insights-hero');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-insights-hero-eyebrow')).toHaveTextContent('Insights');
    expect(screen.getByTestId('text-insights-hero-title')).toHaveTextContent('Perspective for');
    expect(screen.getByTestId('text-insights-hero-title')).toHaveTextContent('better decisions.');
    expect(screen.getByTestId('text-insights-hero-lead')).toHaveTextContent('Independent thinking on investment');
  });

  it('renders the global header and a hero image with real alt text', () => {
    render(<InsightsHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    const img = screen.getByTestId('img-insights-hero');
    expect(img).toHaveAttribute('src', expect.stringContaining('.webp'));
    expect(img.getAttribute('alt')).not.toBe('');
  });
});
