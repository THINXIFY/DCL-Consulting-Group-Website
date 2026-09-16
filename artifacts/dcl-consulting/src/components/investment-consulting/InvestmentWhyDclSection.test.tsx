import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvestmentWhyDclSection } from './InvestmentWhyDclSection';
import { investmentWhyDcl } from '@/data/investment-consulting-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('InvestmentWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<InvestmentWhyDclSection />);
    expect(screen.getByText(investmentWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A disciplined approach');
    expect(screen.getByText(investmentWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-investment-why-dcl')).toBeInTheDocument();
    for (const principle of investmentWhyDcl.principles) {
      expect(screen.getByText(principle)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<InvestmentWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<InvestmentWhyDclSection />);
    const section = document.getElementById('investment-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
