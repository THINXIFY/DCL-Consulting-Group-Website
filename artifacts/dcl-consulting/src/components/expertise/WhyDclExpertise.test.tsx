import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhyDclExpertise } from './WhyDclExpertise';
import { whyDclExpertise } from '@/data/expertise-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhyDclExpertise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, image, and all four principles', () => {
    mockDesktop(true);
    render(<WhyDclExpertise />);
    expect(screen.getByText(whyDclExpertise.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A more independent');
    expect(screen.getByText(whyDclExpertise.copy)).toBeInTheDocument();
    expect(screen.getByTestId('img-why-dcl-expertise')).toBeInTheDocument();
    for (const principle of whyDclExpertise.principles) {
      const el = screen.getByTestId(`why-dcl-expertise-principle-${principle.name.toLowerCase().replaceAll(' ', '-')}`);
      expect(el).toHaveTextContent(principle.name);
      expect(el).toHaveTextContent(principle.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhyDclExpertise />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhyDclExpertise />);
    const section = document.getElementById('why-dcl-expertise');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
