import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { whyDclSection } from '@/data/home-content';
import { WhyDcl } from './WhyDcl';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhyDcl', () => {
  afterEach(() => vi.restoreAllMocks());

  const TITLES = ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication', 'Long-Term Thinking'];

  it('renders the eyebrow, two-line headline, body, and all five quality rows with their own copy', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-eyebrow')).toHaveTextContent('Why DCL');
    const section = document.getElementById('why-dcl');
    expect(section?.textContent).toMatch(/a disciplined way/i);
    expect(section?.textContent).toMatch(/to see the decision/i);
    for (const title of TITLES) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
    expect(screen.getByText(/advice shaped by the facts of the situation/i)).toBeInTheDocument();
  });

  it('renders the Our Approach CTA routing to /approach', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const link = screen.getByTestId('link-why-approach');
    expect(link).toHaveTextContent(whyDclSection.cta.label);
    expect(link).toHaveAttribute('href', '/approach');
  });

  it('renders the dominant supporting image', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const img = screen.getByTestId('img-why-dcl');
    expect(img).toHaveAttribute('alt', expect.stringMatching(/./));
  });

  it('marks a row active on hover/focus (desktop)', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const row = screen.getByTestId('quality-long-term-thinking');
    expect(row).toHaveAttribute('data-active', 'false');
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active', 'true');
  });

  it('renders all rows with inline copy on mobile, no interaction required', () => {
    mockDesktop(false);
    render(<WhyDcl />);
    for (const title of TITLES) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toBeInTheDocument();
    }
    expect(screen.getByText(/weighed against what matters beyond/i)).toBeInTheDocument();
  });

  it('contains no em-dash characters', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const section = document.getElementById('why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
