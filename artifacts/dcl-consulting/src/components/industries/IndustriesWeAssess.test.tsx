import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustriesWeAssess } from './IndustriesWeAssess';

function mockViewport({ desktop = false, tabletUp = false, reducedMotion = true }: { desktop?: boolean; tabletUp?: boolean; reducedMotion?: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    let matches = false;
    if (query.includes('1024')) matches = desktop;
    else if (query.includes('768')) matches = tabletUp;
    else if (query.includes('reduced-motion')) matches = reducedMotion;
    return {
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  }) as unknown as typeof window.matchMedia;
}

const SECTOR_IDS = [
  'real-estate-property',
  'technology-ai',
  'healthcare-life-sciences',
  'energy-infrastructure',
  'financial-services',
  'industrial-manufacturing',
  'consumer-retail',
  'logistics-supply-chain',
  'hospitality-leisure',
  'natural-resources-materials',
  'professional-business-services',
  'emerging-special-situations',
];

describe('IndustriesWeAssess', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, all twelve sectors in the field, and the closing statement on desktop', () => {
    mockViewport({ desktop: true, tabletUp: true });
    render(<IndustriesWeAssess />);
    expect(screen.getByText(/industries we assess/i)).toBeInTheDocument();
    expect(screen.getByText(/perspective across/i)).toBeInTheDocument();
    for (const id of SECTOR_IDS) {
      expect(screen.getByTestId(`sector-field-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-sectors-closing');
    expect(closing).toHaveTextContent('The sector changes.');
    expect(closing).toHaveTextContent('The need for clarity does not.');
  });

  it('activates the first sector by default and shows a different one on hover, updating the shared detail strip', () => {
    mockViewport({ desktop: true, tabletUp: true });
    render(<IndustriesWeAssess />);
    expect(screen.getByTestId('sector-field-real-estate-property')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('sector-detail-name')).toHaveTextContent('Real Estate & Property');

    fireEvent.mouseEnter(screen.getByTestId('sector-field-technology-ai'));
    expect(screen.getByTestId('sector-field-technology-ai')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('sector-detail-name')).toHaveTextContent('Technology & AI');
    expect(screen.getByTestId('sector-detail-description')).toHaveTextContent(/adoption potential/i);
  });

  it('keeps a clicked sector active after the pointer leaves', () => {
    mockViewport({ desktop: true, tabletUp: true });
    render(<IndustriesWeAssess />);
    fireEvent.click(screen.getByTestId('sector-field-financial-services'));
    fireEvent.mouseEnter(screen.getByTestId('sector-field-financial-services'));
    fireEvent.mouseLeave(screen.getByTestId('sector-field-financial-services'));
    expect(screen.getByTestId('sector-detail-name')).toHaveTextContent('Financial Services');
  });

  it('renders a tap-to-expand accordion with proper aria semantics on mobile, one sector expanded at a time', () => {
    mockViewport({ desktop: false, tabletUp: false });
    render(<IndustriesWeAssess />);
    for (const id of SECTOR_IDS) {
      expect(screen.getByTestId(`sector-accordion-${id}`)).toBeInTheDocument();
    }
    const firstToggle = screen.getByTestId('sector-accordion-real-estate-property').querySelector('button')!;
    expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    expect(firstToggle).toHaveAttribute('aria-controls', 'sector-panel-real-estate-property');

    fireEvent.click(firstToggle);
    expect(firstToggle).toHaveAttribute('aria-expanded', 'true');

    const secondToggle = screen.getByTestId('sector-accordion-technology-ai').querySelector('button')!;
    fireEvent.click(secondToggle);
    expect(secondToggle).toHaveAttribute('aria-expanded', 'true');
    expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not throw with reduced motion preferred', () => {
    mockViewport({ desktop: true, tabletUp: true, reducedMotion: true });
    expect(() => render(<IndustriesWeAssess />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockViewport({ desktop: true, tabletUp: true });
    render(<IndustriesWeAssess />);
    const section = document.getElementById('industries-we-assess');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
