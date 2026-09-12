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

  it('renders the eyebrow, headline, and all four quality titles', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-eyebrow')).toHaveTextContent('Why DCL');
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('shows the first quality copy in the left quote panel by default, and swaps it on focus (desktop)', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-quote')).toHaveTextContent(/considered view shaped by the opportunity/i);

    fireEvent.focus(screen.getByTestId('quality-clear-communication'));
    expect(screen.getByTestId('quality-clear-communication')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-why-quote')).toHaveTextContent(/complex information translated into a clearer view/i);
  });

  it('shows every quality with its own copy inline on mobile, no interaction required', () => {
    mockDesktop(false);
    render(<WhyDcl />);
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      const row = screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`);
      expect(row).toHaveAttribute('data-active', 'true');
    }
    expect(screen.getByText(/considered view shaped by the opportunity/i)).toBeInTheDocument();
    expect(screen.getByText(/complex information translated into a clearer view/i)).toBeInTheDocument();
  });
});
