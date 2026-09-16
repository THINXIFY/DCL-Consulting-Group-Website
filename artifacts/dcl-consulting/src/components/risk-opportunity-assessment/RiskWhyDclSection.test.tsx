import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskWhyDclSection } from './RiskWhyDclSection';
import { riskWhyDcl } from '@/data/risk-opportunity-assessment-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RiskWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<RiskWhyDclSection />);
    expect(screen.getByText(riskWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Independent insight');
    expect(screen.getByText(riskWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-risk-why-dcl')).toBeInTheDocument();
    const section = document.getElementById('risk-why-dcl');
    for (const principle of riskWhyDcl.principles) {
      expect(section?.textContent).toContain(principle);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RiskWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RiskWhyDclSection />);
    const section = document.getElementById('risk-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
