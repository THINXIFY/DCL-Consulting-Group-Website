import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OurPhilosophy } from './OurPhilosophy';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('OurPhilosophy', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow and headline inside the same pinned composition as the statements (desktop)', () => {
    mockDesktop(true);
    render(<OurPhilosophy />);
    expect(screen.getByTestId('text-philosophy-eyebrow')).toHaveTextContent('Our philosophy');
    expect(screen.getByText(/clarity before capital/i)).toBeInTheDocument();
    expect(screen.getByTestId('philosophy-pin')).toContainElement(screen.getByTestId('text-philosophy-eyebrow'));
  });

  it('shows only the first statement active on desktop, with its highlight and support copy', () => {
    mockDesktop(true);
    render(<OurPhilosophy />);
    const first = screen.getByTestId('statement-0');
    expect(first).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('statement-1')).toHaveAttribute('data-active', 'false');
    expect(within(first).getByText('Understand')).toHaveClass('dclPhilosophy__highlight');
    expect(screen.getByTestId('support-0')).toHaveTextContent(/establish the context and the facts/i);
  });

  it('renders five progress ticks with the first one marked current', () => {
    mockDesktop(true);
    render(<OurPhilosophy />);
    const ticks = screen.getAllByTestId(/^philosophy-tick-/);
    expect(ticks).toHaveLength(5);
    expect(screen.getByTestId('philosophy-tick-0')).toHaveAttribute('data-active', 'true');
  });

  it('shows every statement and its support copy on mobile with no pinning required', () => {
    mockDesktop(false);
    render(<OurPhilosophy />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`statement-${i}`)).toHaveAttribute('data-active', 'true');
      expect(screen.getByTestId(`support-${i}`)).toBeInTheDocument();
    }
  });
});
