import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { insightsArchive } from '@/data/insights-content';
import { InsightsArchive } from './InsightsArchive';

describe('InsightsArchive', () => {
  it('renders every archive item as a rule-divided row, not a card', () => {
    render(<InsightsArchive />);
    for (const item of insightsArchive) {
      const row = screen.getByTestId(`row-archive-${item.slug}`);
      expect(row).toHaveTextContent(item.category);
      expect(row).toHaveTextContent(item.title);
      expect(row).toHaveTextContent(item.excerpt);
      expect(row).toHaveTextContent('Read');
      expect(row).toHaveAttribute('href', `/insights/${item.slug}`);
      expect(row.className).not.toMatch(/rounded|shadow/);
    }
  });

  it('does not render any images in the archive rows (list format, not cards)', () => {
    render(<InsightsArchive />);
    const section = document.getElementById('insights-archive');
    expect(section?.querySelectorAll('img')).toHaveLength(0);
  });

  it('does not fabricate dates in the archive', () => {
    render(<InsightsArchive />);
    const section = document.getElementById('insights-archive');
    expect(section?.textContent).not.toMatch(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/i);
  });
});
