import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { insightThemes } from '@/data/insights-content';
import { InsightThemes } from './InsightThemes';

describe('InsightThemes', () => {
  it('renders the headline and every theme as a text link, not a rounded pill', () => {
    render(<InsightThemes />);
    expect(screen.getByTestId('text-insight-themes-title')).toHaveTextContent('Explore by perspective.');
    for (const theme of insightThemes) {
      const link = screen.getByTestId(`link-theme-${theme.toLowerCase().replaceAll(' ', '-')}`);
      expect(link).toHaveTextContent(theme);
      expect(link.className).not.toMatch(/rounded/);
    }
  });
});
