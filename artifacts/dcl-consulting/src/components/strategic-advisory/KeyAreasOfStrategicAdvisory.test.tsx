import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfStrategicAdvisory } from './KeyAreasOfStrategicAdvisory';
import { keyAreasOfStrategicAdvisory } from '@/data/strategic-advisory-content';

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

describe('KeyAreasOfStrategicAdvisory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four strategic areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfStrategicAdvisory />);
    expect(screen.getByText(keyAreasOfStrategicAdvisory.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Supporting meaningful');
    for (const area of keyAreasOfStrategicAdvisory.areas) {
      const el = screen.getByTestId(`key-strategic-area-${slug(area.name)}`);
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
    expect(() => render(<KeyAreasOfStrategicAdvisory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfStrategicAdvisory />);
    const section = document.getElementById('key-areas-of-strategic-advisory');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
