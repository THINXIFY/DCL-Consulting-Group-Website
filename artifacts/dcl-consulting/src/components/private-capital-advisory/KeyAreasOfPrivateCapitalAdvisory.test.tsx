import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfPrivateCapitalAdvisory } from './KeyAreasOfPrivateCapitalAdvisory';
import { keyAreasOfPrivateCapitalAdvisory } from '@/data/private-capital-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

describe('KeyAreasOfPrivateCapitalAdvisory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four advisory areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfPrivateCapitalAdvisory />);
    expect(screen.getByText(keyAreasOfPrivateCapitalAdvisory.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Supporting better');
    for (const area of keyAreasOfPrivateCapitalAdvisory.areas) {
      const el = screen.getByTestId(`pc-key-area-${slug(area.name)}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.description);
    }
  });

  it('does not promise deal sourcing or direct transaction execution', () => {
    mockDesktop(true);
    render(<KeyAreasOfPrivateCapitalAdvisory />);
    const section = document.getElementById('pc-key-areas');
    expect(section?.textContent?.toLowerCase()).not.toMatch(/we source deals|we execute|guarantee/);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<KeyAreasOfPrivateCapitalAdvisory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfPrivateCapitalAdvisory />);
    const section = document.getElementById('pc-key-areas');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
