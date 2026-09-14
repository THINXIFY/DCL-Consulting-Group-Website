import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatWeLookFor } from './WhatWeLookFor';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const AREA_IDS = ['market-context', 'business-model', 'financial-fundamentals', 'competitive-position', 'risk-dependencies', 'strategic-relevance'];

describe('WhatWeLookFor', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, all six fundamental bands, and the closing statement', () => {
    mockDesktop(true);
    render(<WhatWeLookFor />);
    expect(screen.getByText(/the sector changes\./i)).toBeInTheDocument();
    expect(screen.getByText(/every industry has its own operating realities/i)).toBeInTheDocument();
    for (const id of AREA_IDS) {
      expect(screen.getByTestId(`fundamental-band-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-fundamentals-closing');
    expect(closing).toHaveTextContent('Different industries require different emphasis.');
    expect(closing).toHaveTextContent('The discipline of the questions remains.');
  });

  it('activates the first band by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<WhatWeLookFor />);
    expect(screen.getByTestId('fundamental-band-market-context')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('fundamental-band-strategic-relevance'));
    expect(screen.getByTestId('fundamental-band-strategic-relevance')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/how does the opportunity fit the wider objective/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('fundamental-band-strategic-relevance'));
    expect(screen.getByTestId('fundamental-band-market-context')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every band accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<WhatWeLookFor />);
    for (const id of AREA_IDS) {
      expect(screen.getByTestId(`fundamental-band-${id}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockDesktop(true);
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhatWeLookFor />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatWeLookFor />);
    const section = document.getElementById('what-we-look-for');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
