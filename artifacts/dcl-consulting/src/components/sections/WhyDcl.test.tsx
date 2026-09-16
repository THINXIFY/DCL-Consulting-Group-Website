import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  it('renders the eyebrow, headline, and all five quality titles', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-eyebrow')).toHaveTextContent('Why DCL');
    for (const title of TITLES) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('renders the dominant supporting image', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const img = document.querySelector('.dclWhy__imageWrap img');
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('alt', expect.stringMatching(/./));
  });

  it('shows the first quality copy in the left quote panel by default, and swaps it on focus (desktop)', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-quote')).toHaveTextContent(/advice shaped by the facts of the situation/i);

    fireEvent.focus(screen.getByTestId('quality-long-term-thinking'));
    expect(screen.getByTestId('quality-long-term-thinking')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-why-quote')).toHaveTextContent(/weighed against what matters beyond/i);
  });

  it('shows every quality with its own copy inline on mobile, no interaction required', () => {
    mockDesktop(false);
    render(<WhyDcl />);
    for (const title of TITLES) {
      const row = screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`);
      expect(row).toHaveAttribute('data-active', 'true');
    }
    expect(screen.getByText(/advice shaped by the facts of the situation/i)).toBeInTheDocument();
    expect(screen.getByText(/weighed against what matters beyond/i)).toBeInTheDocument();
  });
});
