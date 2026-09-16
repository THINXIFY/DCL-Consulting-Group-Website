import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { insights } from '@/data/home-content';
import { Insights } from './Insights';

describe('Insights', () => {
  it('renders the eyebrow, headline, and every perspective statement', () => {
    render(<Insights />);
    const section = document.getElementById('insights');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-insights-eyebrow')).toHaveTextContent('Perspective');
    for (const item of insights) {
      const row = screen.getByTestId(`row-insight-${item.theme.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '')}`);
      expect(row).toHaveTextContent(item.theme);
      expect(row).toHaveTextContent(item.statement);
    }
  });

  it('does not fabricate article metadata (no dates, read times, or images)', () => {
    render(<Insights />);
    const section = document.getElementById('insights');
    expect(section?.querySelectorAll('img')).toHaveLength(0);
    expect(section?.textContent).not.toMatch(/\bmin read\b/i);
    expect(section?.textContent).not.toMatch(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/i);
  });

  it('contains no em-dash characters', () => {
    render(<Insights />);
    const section = document.getElementById('insights');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
