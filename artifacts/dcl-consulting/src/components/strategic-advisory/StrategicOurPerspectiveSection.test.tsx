import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrategicOurPerspectiveSection } from './StrategicOurPerspectiveSection';
import { strategicOurPerspective } from '@/data/strategic-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('StrategicOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, statement, and link', () => {
    mockDesktop(true);
    render(<StrategicOurPerspectiveSection />);
    expect(screen.getAllByText(strategicOurPerspective.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A clearer path');
    expect(screen.getByText(strategicOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(strategicOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-strategic-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('strategic-our-perspective');
    for (const line of strategicOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    const link = screen.getByTestId('link-strategic-our-perspective');
    expect(link).toHaveAttribute('href', strategicOurPerspective.link.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<StrategicOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<StrategicOurPerspectiveSection />);
    const section = document.getElementById('strategic-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
