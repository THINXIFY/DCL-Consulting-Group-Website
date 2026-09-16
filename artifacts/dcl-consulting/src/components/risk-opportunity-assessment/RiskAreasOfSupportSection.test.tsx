import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskAreasOfSupportSection } from './RiskAreasOfSupportSection';
import { riskAreasOfSupport } from '@/data/risk-opportunity-assessment-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

describe('RiskAreasOfSupportSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four areas of support', () => {
    mockDesktop(true);
    render(<RiskAreasOfSupportSection />);
    expect(screen.getByText(riskAreasOfSupport.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Where we');
    for (const area of riskAreasOfSupport.areas) {
      const el = screen.getByTestId(`risk-support-area-${slug(area.name)}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RiskAreasOfSupportSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RiskAreasOfSupportSection />);
    const section = document.getElementById('risk-areas-of-support');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
