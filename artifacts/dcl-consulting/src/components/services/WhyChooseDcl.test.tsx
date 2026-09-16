import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhyChooseDcl } from './WhyChooseDcl';
import { whyChooseDcl } from '@/data/services-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhyChooseDcl', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, image, and all five principles', () => {
    mockDesktop(true);
    render(<WhyChooseDcl />);
    expect(screen.getByText(whyChooseDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A more independent');
    expect(screen.getByText(whyChooseDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-why-choose-dcl')).toBeInTheDocument();
    const cta = screen.getByTestId('link-why-dcl-cta');
    expect(cta).toHaveTextContent(whyChooseDcl.cta.label);
    expect(cta).toHaveAttribute('href', whyChooseDcl.cta.href);
    whyChooseDcl.principles.forEach((principle, index) => {
      expect(screen.getByTestId(`why-dcl-principle-${index}`)).toHaveTextContent(principle);
    });
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhyChooseDcl />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhyChooseDcl />);
    const section = document.getElementById('why-choose-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
