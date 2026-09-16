import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { dclViewpoint } from '@/data/insights-content';
import { DclViewpoint } from './DclViewpoint';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DclViewpoint', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, copy, and both approach/expertise links', () => {
    mockDesktop(true);
    render(<DclViewpoint />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Clarity begins with');
    expect(screen.getByText(dclViewpoint.copy)).toBeInTheDocument();
    const approach = screen.getByTestId('link-viewpoint-our-approach');
    expect(approach).toHaveAttribute('href', '/approach');
    const expertise = screen.getByTestId('link-viewpoint-our-expertise');
    expect(expertise).toHaveAttribute('href', '/expertise');
  });

  it('renders the restrained architectural image', () => {
    mockDesktop(true);
    render(<DclViewpoint />);
    const img = screen.getByTestId('img-dcl-viewpoint');
    expect(img).toHaveAttribute('src', dclViewpoint.image.src);
    expect(img).toHaveAttribute('alt', dclViewpoint.image.alt);
  });
});
