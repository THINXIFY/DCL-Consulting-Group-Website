import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfRiskAssessment } from './KeyAreasOfRiskAssessment';
import { keyAreasOfRiskAssessment } from '@/data/risk-opportunity-assessment-content';

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

describe('KeyAreasOfRiskAssessment', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four risk areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfRiskAssessment />);
    expect(screen.getByText(keyAreasOfRiskAssessment.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A balanced view');
    for (const area of keyAreasOfRiskAssessment.areas) {
      const el = screen.getByTestId(`risk-key-area-${slug(area.name)}`);
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
    expect(() => render(<KeyAreasOfRiskAssessment />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfRiskAssessment />);
    const section = document.getElementById('risk-key-areas');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
