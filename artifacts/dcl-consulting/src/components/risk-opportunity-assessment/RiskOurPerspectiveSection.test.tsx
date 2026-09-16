import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskOurPerspectiveSection } from './RiskOurPerspectiveSection';
import { riskOurPerspective } from '@/data/risk-opportunity-assessment-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RiskOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, statement, and link', () => {
    mockDesktop(true);
    render(<RiskOurPerspectiveSection />);
    expect(screen.getByText(riskOurPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Better decisions');
    expect(screen.getByText(riskOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(riskOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-risk-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('risk-our-perspective');
    for (const line of riskOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    const link = screen.getByTestId('link-risk-perspective-approach');
    expect(link).toHaveAttribute('href', riskOurPerspective.link.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RiskOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RiskOurPerspectiveSection />);
    const section = document.getElementById('risk-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
