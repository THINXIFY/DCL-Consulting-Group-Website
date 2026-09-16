import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivateCapitalOurPerspectiveSection } from './PrivateCapitalOurPerspectiveSection';
import { privateCapitalOurPerspective } from '@/data/private-capital-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivateCapitalOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, statement, and link', () => {
    mockDesktop(true);
    render(<PrivateCapitalOurPerspectiveSection />);
    expect(screen.getAllByText(privateCapitalOurPerspective.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('More than capital.');
    expect(screen.getByText(privateCapitalOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(privateCapitalOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-pc-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('pc-our-perspective');
    for (const line of privateCapitalOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    const link = screen.getByTestId('link-pc-our-perspective');
    expect(link).toHaveAttribute('href', privateCapitalOurPerspective.link.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<PrivateCapitalOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<PrivateCapitalOurPerspectiveSection />);
    const section = document.getElementById('pc-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
