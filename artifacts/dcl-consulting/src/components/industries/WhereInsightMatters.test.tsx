import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhereInsightMatters } from './WhereInsightMatters';
import { whereInsightMatters } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('WhereInsightMatters', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all eight items as ruled rows', () => {
    mockDesktop(true);
    render(<WhereInsightMatters />);
    expect(screen.getByText(whereInsightMatters.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(whereInsightMatters.headlineLines[0]);
    expect(whereInsightMatters.items).toHaveLength(8);
    for (const item of whereInsightMatters.items) {
      expect(screen.getByTestId(`where-insight-item-${slug(item)}`)).toHaveTextContent(item);
    }
  });

  it('does not render items as rounded pill or card elements', () => {
    mockDesktop(true);
    render(<WhereInsightMatters />);
    for (const item of whereInsightMatters.items) {
      const row = screen.getByTestId(`where-insight-item-${slug(item)}`);
      expect(row.className).not.toMatch(/rounded|shadow/);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhereInsightMatters />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhereInsightMatters />);
    const section = document.getElementById('where-insight-matters');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/\b0?[1-9]\s*\//);
  });
});
