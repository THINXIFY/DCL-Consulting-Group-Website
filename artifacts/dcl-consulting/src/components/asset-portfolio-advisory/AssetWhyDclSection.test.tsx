import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssetWhyDclSection } from './AssetWhyDclSection';
import { assetWhyDcl } from '@/data/asset-portfolio-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('AssetWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<AssetWhyDclSection />);
    expect(screen.getByText(assetWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Independent insight');
    expect(screen.getByText(assetWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-asset-why-dcl')).toBeInTheDocument();
    for (const principle of assetWhyDcl.principles) {
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
    expect(() => render(<AssetWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<AssetWhyDclSection />);
    const section = document.getElementById('asset-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
