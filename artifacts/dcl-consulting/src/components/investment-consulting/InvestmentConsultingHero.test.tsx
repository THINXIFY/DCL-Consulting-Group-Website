import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvestmentConsultingHero } from './InvestmentConsultingHero';
import { investmentConsultingHero } from '@/data/investment-consulting-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('InvestmentConsultingHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<InvestmentConsultingHero />);
    expect(screen.getByTestId('text-ic-hero-label')).toHaveTextContent(investmentConsultingHero.label);
    expect(screen.getByTestId('text-ic-hero-title')).toHaveTextContent('Investment');
    expect(screen.getByTestId('text-ic-hero-title')).toHaveTextContent('Consulting');
    expect(screen.getByTestId('text-ic-hero-intro')).toHaveTextContent(investmentConsultingHero.intro);
    const cta = screen.getByTestId('link-ic-hero-cta');
    expect(cta).toHaveTextContent(investmentConsultingHero.cta.label);
    expect(cta).toHaveAttribute('href', investmentConsultingHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of investmentConsultingHero.keywords) {
      expect(screen.getByTestId('text-ic-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-ic-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-ic-hero-statement');
    for (const line of investmentConsultingHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<InvestmentConsultingHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<InvestmentConsultingHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<InvestmentConsultingHero />);
    const section = document.getElementById('investment-consulting-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
