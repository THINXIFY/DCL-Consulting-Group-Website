import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CrossSectorPerspective } from './CrossSectorPerspective';
import { crossSectorPerspective } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('CrossSectorPerspective', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, and image', () => {
    mockDesktop(true);
    render(<CrossSectorPerspective />);
    expect(screen.getByText(crossSectorPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(crossSectorPerspective.headlineLines[0]);
    expect(screen.getByText(crossSectorPerspective.copy)).toBeInTheDocument();
    const img = screen.getByTestId('img-cross-sector');
    expect(img).toHaveAttribute('src', crossSectorPerspective.image.src);
    expect(img).toHaveAttribute('alt', crossSectorPerspective.image.alt);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<CrossSectorPerspective />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<CrossSectorPerspective />);
    const section = document.getElementById('cross-sector-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
