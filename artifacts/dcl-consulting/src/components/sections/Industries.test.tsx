import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Industries } from './Industries';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Industries', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders all twelve industries with no numbering', () => {
    mockDesktop(true);
    render(<Industries />);
    expect(screen.getAllByTestId(/^item-industry-/)).toHaveLength(12);
    expect(screen.queryByText(/^0?[1-9][/.)-]/)).not.toBeInTheDocument();
  });

  it('updates the active industry and context copy on focus (desktop)', () => {
    mockDesktop(true);
    render(<Industries />);
    const secondItem = screen.getByTestId('item-industry-technology');
    fireEvent.focus(secondItem);
    expect(secondItem).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-industry-context')).toHaveTextContent(/technology enabled/i);
  });

  it('renders a plain list with no sticky image on mobile', () => {
    mockDesktop(false);
    render(<Industries />);
    expect(screen.queryByTestId('image-industry-sticky')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/^item-industry-/)).toHaveLength(12);
  });
});
