import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DisciplinedApproach } from './DisciplinedApproach';
import { disciplinedApproach } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DisciplinedApproach', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, and all four columns', () => {
    mockDesktop(true);
    render(<DisciplinedApproach />);
    expect(screen.getByText(disciplinedApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(disciplinedApproach.headlineLines[0]);
    expect(screen.getByText(disciplinedApproach.copy)).toBeInTheDocument();
    expect(disciplinedApproach.columns).toHaveLength(4);
    for (const column of disciplinedApproach.columns) {
      const el = screen.getByTestId(`disciplined-approach-column-${column.name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-')}`);
      expect(el).toHaveTextContent(column.name);
      expect(el).toHaveTextContent(column.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<DisciplinedApproach />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<DisciplinedApproach />);
    const section = document.getElementById('disciplined-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/\b0?[1-9]\s*\//);
  });
});
