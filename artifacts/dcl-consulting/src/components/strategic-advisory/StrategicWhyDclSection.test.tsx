import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrategicWhyDclSection } from './StrategicWhyDclSection';
import { strategicWhyDcl } from '@/data/strategic-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('StrategicWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<StrategicWhyDclSection />);
    expect(screen.getByText(strategicWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Independent perspective');
    expect(screen.getByText(strategicWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-strategic-why-dcl')).toBeInTheDocument();
    for (const principle of strategicWhyDcl.principles) {
      expect(screen.getByText(principle)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<StrategicWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<StrategicWhyDclSection />);
    const section = document.getElementById('strategic-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
