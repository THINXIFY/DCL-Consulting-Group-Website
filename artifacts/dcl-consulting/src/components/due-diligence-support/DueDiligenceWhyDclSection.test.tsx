import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DueDiligenceWhyDclSection } from './DueDiligenceWhyDclSection';
import { dueDiligenceWhyDcl } from '@/data/due-diligence-support-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DueDiligenceWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<DueDiligenceWhyDclSection />);
    expect(screen.getByText(dueDiligenceWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Independent analysis');
    expect(screen.getByText(dueDiligenceWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-dd-why-dcl')).toBeInTheDocument();
    const section = document.getElementById('dd-why-dcl');
    for (const principle of dueDiligenceWhyDcl.principles) {
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
    expect(() => render(<DueDiligenceWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<DueDiligenceWhyDclSection />);
    const section = document.getElementById('dd-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
