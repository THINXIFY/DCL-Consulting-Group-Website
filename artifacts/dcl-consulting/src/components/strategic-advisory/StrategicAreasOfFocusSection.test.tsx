import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrategicAreasOfFocusSection } from './StrategicAreasOfFocusSection';
import { strategicAreasOfFocus } from '@/data/strategic-advisory-content';

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

describe('StrategicAreasOfFocusSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four focus areas', () => {
    mockDesktop(true);
    render(<StrategicAreasOfFocusSection />);
    expect(screen.getByText(strategicAreasOfFocus.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Where we');
    for (const area of strategicAreasOfFocus.areas) {
      const el = screen.getByTestId(`strategic-focus-area-${slug(area.name)}`);
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
    expect(() => render(<StrategicAreasOfFocusSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<StrategicAreasOfFocusSection />);
    const section = document.getElementById('strategic-areas-of-focus');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
