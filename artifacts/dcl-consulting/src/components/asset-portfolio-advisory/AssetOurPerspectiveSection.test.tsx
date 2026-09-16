import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssetOurPerspectiveSection } from './AssetOurPerspectiveSection';
import { assetOurPerspective } from '@/data/asset-portfolio-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('AssetOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, statement, and link', () => {
    mockDesktop(true);
    render(<AssetOurPerspectiveSection />);
    expect(screen.getAllByText(assetOurPerspective.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('More than individual assets.');
    expect(screen.getByText(assetOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(assetOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-asset-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('asset-our-perspective');
    for (const line of assetOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    const link = screen.getByTestId('link-asset-our-perspective');
    expect(link).toHaveAttribute('href', assetOurPerspective.link.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<AssetOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<AssetOurPerspectiveSection />);
    const section = document.getElementById('asset-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
