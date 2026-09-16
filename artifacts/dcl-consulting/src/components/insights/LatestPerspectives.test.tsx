import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { latestPerspectives } from '@/data/insights-content';
import { LatestPerspectives } from './LatestPerspectives';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('LatestPerspectives', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders every perspective item with its category, title, excerpt, and read link', () => {
    mockDesktop(true);
    render(<LatestPerspectives />);
    for (const item of latestPerspectives) {
      expect(screen.getByTestId(`text-perspective-category-${item.slug}`)).toHaveTextContent(item.category);
      expect(screen.getByTestId(`link-perspective-title-${item.slug}`)).toHaveTextContent(item.title);
      expect(screen.getByTestId(`text-perspective-excerpt-${item.slug}`)).toHaveTextContent(item.excerpt);
      const readLink = screen.getByTestId(`link-perspective-read-${item.slug}`);
      expect(readLink).toHaveAttribute('href', `/insights/${item.slug}`);
    }
  });

  it('renders an image for every variant except the text-led item', () => {
    mockDesktop(true);
    render(<LatestPerspectives />);
    for (const item of latestPerspectives) {
      const img = screen.queryByTestId(`img-perspective-${item.slug}`);
      if (item.variant === 'text') {
        expect(img).not.toBeInTheDocument();
      } else {
        expect(img).toBeInTheDocument();
      }
    }
  });

  it('does not use rounded cards (no border-radius utility classes on items)', () => {
    mockDesktop(true);
    render(<LatestPerspectives />);
    for (const item of latestPerspectives) {
      const article = screen.getByTestId(`item-perspective-${item.slug}`);
      expect(article.className).not.toMatch(/rounded/);
    }
  });
});
