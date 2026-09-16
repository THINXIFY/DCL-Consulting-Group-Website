import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivateCapitalWhyDclSection } from './PrivateCapitalWhyDclSection';
import { privateCapitalWhyDcl } from '@/data/private-capital-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivateCapitalWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<PrivateCapitalWhyDclSection />);
    expect(screen.getByText(privateCapitalWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Independent insight');
    expect(screen.getByText(privateCapitalWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-pc-why-dcl')).toBeInTheDocument();
    for (const principle of privateCapitalWhyDcl.principles) {
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
    expect(() => render(<PrivateCapitalWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<PrivateCapitalWhyDclSection />);
    const section = document.getElementById('pc-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
