import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OurApproachSection } from './OurApproachSection';
import { ourApproach } from '@/data/investment-consulting-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('OurApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, link, image, and statement', () => {
    mockDesktop(true);
    render(<OurApproachSection />);
    expect(screen.getAllByText(ourApproach.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A clearer view');
    expect(screen.getByText(ourApproach.body[0])).toBeInTheDocument();
    expect(screen.getByText(ourApproach.body[1])).toBeInTheDocument();
    const link = screen.getByTestId('link-our-approach');
    expect(link).toHaveTextContent(ourApproach.link.label);
    expect(link).toHaveAttribute('href', ourApproach.link.href);
    expect(screen.getByTestId('img-our-approach')).toBeInTheDocument();
    const section = document.getElementById('our-approach');
    for (const line of ourApproach.statementLines) {
      expect(section?.textContent).toContain(line);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<OurApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<OurApproachSection />);
    const section = document.getElementById('our-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
