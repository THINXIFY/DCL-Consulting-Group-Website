import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustriesWeAssess } from './IndustriesWeAssess';

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
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

  it('renders the eyebrow, headline, intro, and a card for every one of the twelve sectors', () => {
    mockReducedMotion(false);
    render(<IndustriesWeAssess />);
    expect(screen.getByText(/industries we assess/i)).toBeInTheDocument();
    expect(screen.getByText(/perspective across/i)).toBeInTheDocument();
    for (const id of SECTOR_IDS) {
      expect(screen.getByTestId(`sector-card-${id}`)).toBeInTheDocument();
    }
  });

  it('shows the supporting line and full description inline on every card, with no hover or click required', () => {
    mockReducedMotion(false);
    render(<IndustriesWeAssess />);
    const card = screen.getByTestId('sector-card-technology-ai');
    expect(card).toHaveTextContent('Technology & AI');
    expect(card).toHaveTextContent(/evaluating commercial potential behind innovation/i);
    expect(card).toHaveTextContent(/adoption potential/i);
  });

  it('renders the closing statement', () => {
    mockReducedMotion(false);
    render(<IndustriesWeAssess />);
    const closing = screen.getByTestId('text-sectors-closing');
    expect(closing).toHaveTextContent('The sector changes.');
    expect(closing).toHaveTextContent('The need for clarity does not.');
  });

  it('does not throw with reduced motion preferred', () => {
    mockReducedMotion(true);
    expect(() => render(<IndustriesWeAssess />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockReducedMotion(false);
    render(<IndustriesWeAssess />);
    const section = document.getElementById('industries-we-assess');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
