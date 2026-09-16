import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DueDiligenceProcessSection } from './DueDiligenceProcessSection';
import { dueDiligenceProcess } from '@/data/due-diligence-support-content';

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

describe('DueDiligenceProcessSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all four process rows', () => {
    mockDesktop(true);
    render(<DueDiligenceProcessSection />);
    expect(screen.getByText(dueDiligenceProcess.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A structured approach');
    expect(screen.getByText(dueDiligenceProcess.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-dd-process-cta');
    expect(cta).toHaveTextContent(dueDiligenceProcess.cta.label);
    expect(cta).toHaveAttribute('href', dueDiligenceProcess.cta.href);
    for (const row of dueDiligenceProcess.rows) {
      const el = screen.getByTestId(`dd-process-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<DueDiligenceProcessSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<DueDiligenceProcessSection />);
    const section = document.getElementById('dd-process');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
