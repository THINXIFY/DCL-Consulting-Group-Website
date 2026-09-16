import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DueDiligenceAreasOfSupportSection } from './DueDiligenceAreasOfSupportSection';
import { dueDiligenceAreasOfSupport } from '@/data/due-diligence-support-content';

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

describe('DueDiligenceAreasOfSupportSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four areas of support', () => {
    mockDesktop(true);
    render(<DueDiligenceAreasOfSupportSection />);
    expect(screen.getByText(dueDiligenceAreasOfSupport.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tailored diligence');
    for (const area of dueDiligenceAreasOfSupport.areas) {
      const el = screen.getByTestId(`dd-support-area-${slug(area.name)}`);
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
    expect(() => render(<DueDiligenceAreasOfSupportSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<DueDiligenceAreasOfSupportSection />);
    const section = document.getElementById('dd-areas-of-support');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
