import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskHero } from './RiskHero';
import { riskHero } from '@/data/risk-opportunity-assessment-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RiskHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<RiskHero />);
    expect(screen.getByTestId('text-risk-hero-label')).toHaveTextContent(riskHero.label);
    expect(screen.getByTestId('text-risk-hero-title')).toHaveTextContent('Risk & Opportunity');
    expect(screen.getByTestId('text-risk-hero-title')).toHaveTextContent('Assessment');
    expect(screen.getByTestId('text-risk-hero-intro')).toHaveTextContent(riskHero.intro);
    const cta = screen.getByTestId('link-risk-hero-cta');
    expect(cta).toHaveTextContent(riskHero.cta.label);
    expect(cta).toHaveAttribute('href', riskHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of riskHero.keywords) {
      expect(screen.getByTestId('text-risk-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-risk-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-risk-hero-statement');
    for (const line of riskHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<RiskHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RiskHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RiskHero />);
    const section = document.getElementById('risk-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
