import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DueDiligenceOurPerspectiveSection } from './DueDiligenceOurPerspectiveSection';
import { dueDiligenceOurPerspective } from '@/data/due-diligence-support-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DueDiligenceOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, and statement', () => {
    mockDesktop(true);
    render(<DueDiligenceOurPerspectiveSection />);
    expect(screen.getByText(dueDiligenceOurPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Better decisions');
    expect(screen.getByText(dueDiligenceOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(dueDiligenceOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-dd-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('dd-our-perspective');
    for (const line of dueDiligenceOurPerspective.statementLines) {
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
    expect(() => render(<DueDiligenceOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<DueDiligenceOurPerspectiveSection />);
    const section = document.getElementById('dd-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
