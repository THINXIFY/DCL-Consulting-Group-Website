import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CommercialFinancial } from './CommercialFinancial';
import { commercialFinancial } from '@/data/real-estate-investment-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('CommercialFinancial', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all six list items', () => {
    mockDesktop(true);
    render(<CommercialFinancial />);
    expect(screen.getByText(commercialFinancial.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Insight that supports');
    expect(screen.getByText(commercialFinancial.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-commercial-financial')).toBeInTheDocument();
    for (const item of commercialFinancial.list) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<CommercialFinancial />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<CommercialFinancial />);
    const section = document.getElementById('commercial-financial');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
