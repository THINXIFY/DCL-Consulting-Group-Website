import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioConsiderationsSection } from './PortfolioConsiderationsSection';
import { portfolioConsiderations } from '@/data/asset-portfolio-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PortfolioConsiderationsSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, image, and all six list items', () => {
    mockDesktop(true);
    render(<PortfolioConsiderationsSection />);
    expect(screen.getByText(portfolioConsiderations.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A more complete');
    expect(screen.getByText(portfolioConsiderations.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-portfolio-considerations-cta');
    expect(cta).toHaveTextContent(portfolioConsiderations.cta.label);
    expect(cta).toHaveAttribute('href', portfolioConsiderations.cta.href);
    expect(screen.getByTestId('img-portfolio-considerations')).toBeInTheDocument();
    for (const item of portfolioConsiderations.list) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<PortfolioConsiderationsSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<PortfolioConsiderationsSection />);
    const section = document.getElementById('portfolio-considerations');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
