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

  it('renders the eyebrow, headline, and all four qualities', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-eyebrow')).toHaveTextContent('Why DCL');
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('expands only the focused row on desktop and collapses the rest', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const row = screen.getByTestId('quality-analytical-discipline');
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('quality-independent-perspective')).toHaveAttribute('data-active', 'false');
  });

  it('shows every quality expanded on mobile with no interaction required', () => {
    mockDesktop(false);
    render(<WhyDcl />);
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
  });
});
