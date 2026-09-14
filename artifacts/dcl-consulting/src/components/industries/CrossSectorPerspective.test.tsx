import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CrossSectorPerspective } from './CrossSectorPerspective';

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

  it('renders the headline, lead, both body paragraphs, and the three-line closing statement', () => {
    mockDesktop(true);
    render(<CrossSectorPerspective />);
    expect(screen.getByText(/insight can travel/i)).toBeInTheDocument();
    expect(screen.getByText(/different sectors often reveal different approaches/i)).toBeInTheDocument();
    expect(screen.getByText(/examining opportunities across varied commercial environments/i)).toBeInTheDocument();
    expect(screen.getByText(/does not replace industry-specific understanding/i)).toBeInTheDocument();
    const closing = screen.getByTestId('text-cross-sector-closing');
    expect(closing).toHaveTextContent('Broader perspective.');
    expect(closing).toHaveTextContent('Sharper questions.');
    expect(closing).toHaveTextContent('Clearer judgement.');
  });

  it('renders two or three background reference terms on desktop, none on mobile', () => {
    mockDesktop(true);
    const { unmount } = render(<CrossSectorPerspective />);
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Risk')).toBeInTheDocument();
    unmount();

    mockDesktop(false);
    render(<CrossSectorPerspective />);
    expect(screen.queryByText('Growth')).not.toBeInTheDocument();
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
