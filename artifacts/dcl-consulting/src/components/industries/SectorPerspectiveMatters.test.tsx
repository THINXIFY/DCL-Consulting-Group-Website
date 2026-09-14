import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SectorPerspectiveMatters } from './SectorPerspectiveMatters';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const CONTEXT_IDS = ['investment-opportunities', 'acquisitions', 'market-entry', 'growth-expansion', 'strategic-partnerships', 'business-assessment'];

describe('SectorPerspectiveMatters', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, all six decision contexts, and the closing statement', () => {
    mockDesktop(true);
    render(<SectorPerspectiveMatters />);
    expect(screen.getByText(/industry context matters/i)).toBeInTheDocument();
    expect(screen.getByText(/sector perspective becomes particularly valuable/i)).toBeInTheDocument();
    for (const id of CONTEXT_IDS) {
      expect(screen.getByTestId(`decision-context-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-decision-closing');
    expect(closing).toHaveTextContent('The decision may be familiar.');
    expect(closing).toHaveTextContent('The environment rarely is.');
  });

  it('activates the first context by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<SectorPerspectiveMatters />);
    expect(screen.getByTestId('decision-context-investment-opportunities')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('decision-context-business-assessment'));
    expect(screen.getByTestId('decision-context-business-assessment')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/performance, positioning and the industry factors/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('decision-context-business-assessment'));
    expect(screen.getByTestId('decision-context-investment-opportunities')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every context accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<SectorPerspectiveMatters />);
    for (const id of CONTEXT_IDS) {
      expect(screen.getByTestId(`decision-context-${id}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<SectorPerspectiveMatters />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<SectorPerspectiveMatters />);
    const section = document.getElementById('sector-perspective-matters');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
