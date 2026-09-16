import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MaOurPerspectiveSection } from './MaOurPerspectiveSection';
import { maOurPerspective } from '@/data/ma-acquisition-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MaOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, and statement', () => {
    mockDesktop(true);
    render(<MaOurPerspectiveSection />);
    expect(screen.getByText(maOurPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('More than a transaction.');
    expect(screen.getByText(maOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(maOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-ma-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('ma-our-perspective');
    for (const line of maOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MaOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MaOurPerspectiveSection />);
    const section = document.getElementById('ma-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
