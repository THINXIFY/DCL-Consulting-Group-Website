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

  it('renders the eyebrow and the updated heading', () => {
    mockDesktop(true);
    render(<Industries />);
    expect(screen.getByTestId('text-industries-eyebrow')).toHaveTextContent('Industries we assess');
    const section = document.getElementById('industries');
    expect(section?.textContent).toMatch(/insight across/i);
    expect(section?.textContent).toMatch(/every sector/i);
  });

  it('renders all six industries with no numbering', () => {
    mockDesktop(true);
    render(<Industries />);
    expect(screen.getAllByTestId(/^item-industry-/)).toHaveLength(6);
    expect(screen.queryByText(/^0?[1-9][/.)-]/)).not.toBeInTheDocument();
  });

  it('updates the active industry and context copy on focus (desktop)', () => {
    mockDesktop(true);
    render(<Industries />);
    const secondItem = screen.getByTestId('item-industry-technology-ai');
    fireEvent.focus(secondItem);
    expect(secondItem).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-industry-context')).toHaveTextContent(/technology, software/i);
  });

  it('renders a single dominant sticky image on desktop, not per-item crossfades', () => {
    mockDesktop(true);
    render(<Industries />);
    expect(screen.getByTestId('image-industry-sticky').querySelectorAll('img')).toHaveLength(1);
  });

  it('renders a plain list with no sticky image on mobile', () => {
    mockDesktop(false);
    render(<Industries />);
    expect(screen.queryByTestId('image-industry-sticky')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/^item-industry-/)).toHaveLength(6);
  });
});
