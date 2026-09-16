import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OurPerspective } from './OurPerspective';
import { ourPerspective } from '@/data/real-estate-investment-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('OurPerspective', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, link, image, and right statement', () => {
    mockDesktop(true);
    render(<OurPerspective />);
    expect(screen.getByText(ourPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Value goes');
    expect(screen.getByText(ourPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(ourPerspective.body[1])).toBeInTheDocument();
    const link = screen.getByTestId('link-our-perspective');
    expect(link).toHaveTextContent(ourPerspective.link.label);
    expect(link).toHaveAttribute('href', ourPerspective.link.href);
    expect(screen.getByTestId('img-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('our-perspective');
    for (const line of ourPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    expect(section?.textContent).toContain(ourPerspective.microCopy);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<OurPerspective />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<OurPerspective />);
    const section = document.getElementById('our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
