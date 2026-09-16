import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfDueDiligence } from './KeyAreasOfDueDiligence';
import { keyAreasOfDueDiligence } from '@/data/due-diligence-support-content';

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

describe('KeyAreasOfDueDiligence', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four due diligence areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfDueDiligence />);
    expect(screen.getByText(keyAreasOfDueDiligence.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A comprehensive,');
    for (const area of keyAreasOfDueDiligence.areas) {
      const el = screen.getByTestId(`dd-key-area-${slug(area.name)}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.description);
    }
  });

  it('does not imply DCL itself provides formal legal opinion', () => {
    mockDesktop(true);
    render(<KeyAreasOfDueDiligence />);
    const section = document.getElementById('dd-key-areas');
    expect(section?.textContent?.toLowerCase()).not.toContain('we provide legal opinion');
    expect(section?.textContent).toContain('specialist legal');
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<KeyAreasOfDueDiligence />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfDueDiligence />);
    const section = document.getElementById('dd-key-areas');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
