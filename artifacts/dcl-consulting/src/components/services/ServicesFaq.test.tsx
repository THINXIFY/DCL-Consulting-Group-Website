import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServicesFaq } from './ServicesFaq';
import { servicesFaq } from '@/data/services-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ServicesFaq', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, and every question', () => {
    mockDesktop(true);
    render(<ServicesFaq />);
    expect(screen.getByText(servicesFaq.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Frequently asked');
    expect(screen.getByText(servicesFaq.intro)).toBeInTheDocument();
    for (const item of servicesFaq.items) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });

  it('opens the first question by default and toggles others, keeping only one open', () => {
    mockDesktop(true);
    render(<ServicesFaq />);
    const buttons = servicesFaq.items.map((item) =>
      screen.getByRole('button', { name: new RegExp(item.question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }),
    );
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(buttons[1]!);
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the side CTA with image, headline, and link', () => {
    mockDesktop(true);
    render(<ServicesFaq />);
    expect(screen.getByTestId('img-services-faq-side')).toBeInTheDocument();
    expect(screen.getByText(servicesFaq.sideCta.headline)).toBeInTheDocument();
    const cta = screen.getByTestId('link-services-faq-side-cta');
    expect(cta).toHaveTextContent(servicesFaq.sideCta.cta.label);
    expect(cta).toHaveAttribute('href', servicesFaq.sideCta.cta.href);
  });

  it('does not imply DCL holds custody, executes trades, or provides discretionary management', () => {
    mockDesktop(true);
    render(<ServicesFaq />);
    const section = document.getElementById('services-faq');
    const text = section?.textContent?.toLowerCase() ?? '';
    for (const phrase of ['custody of', 'execute trades', 'discretionary management', 'we manage your']) {
      expect(text).not.toContain(phrase);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<ServicesFaq />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<ServicesFaq />);
    const section = document.getElementById('services-faq');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
