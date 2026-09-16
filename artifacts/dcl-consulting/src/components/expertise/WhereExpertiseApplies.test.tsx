import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhereExpertiseApplies } from './WhereExpertiseApplies';
import { whereExpertiseApplies } from '@/data/expertise-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('WhereExpertiseApplies', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, and the view-all link', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    expect(screen.getByText(whereExpertiseApplies.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Across markets.');
    expect(screen.getByText(whereExpertiseApplies.copy)).toBeInTheDocument();
    const viewAll = screen.getByTestId('link-applies-view-all');
    expect(viewAll).toHaveTextContent(whereExpertiseApplies.link.label);
    expect(viewAll).toHaveAttribute('href', whereExpertiseApplies.link.href);
  });

  it('renders all six application area tiles with images and correct routes', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    expect(whereExpertiseApplies.areas).toHaveLength(6);
    for (const area of whereExpertiseApplies.areas) {
      const tile = screen.getByTestId(`applies-tile-${slug(area.title)}`);
      expect(tile).toHaveTextContent(area.title);
      expect(tile).toHaveTextContent(area.description);
      expect(tile).toHaveAttribute('href', area.href);
      expect(screen.getByTestId(`img-applies-${slug(area.title)}`)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhereExpertiseApplies />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    const section = document.getElementById('where-expertise-applies');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
