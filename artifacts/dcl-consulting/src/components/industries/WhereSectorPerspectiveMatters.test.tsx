import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhereSectorPerspectiveMatters } from './WhereSectorPerspectiveMatters';
import { whereSectorPerspectiveMatters } from '@/data/industries-content';

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

describe('WhereSectorPerspectiveMatters', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline and all six situations, with no decorative numbering or cards', () => {
    mockDesktop(true);
    render(<WhereSectorPerspectiveMatters />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Industry context matters');
    for (const situation of whereSectorPerspectiveMatters.situations) {
      expect(screen.getByTestId(`sector-matters-item-${slug(situation)}`)).toHaveTextContent(situation);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhereSectorPerspectiveMatters />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhereSectorPerspectiveMatters />);
    const section = document.getElementById('where-sector-perspective-matters');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
