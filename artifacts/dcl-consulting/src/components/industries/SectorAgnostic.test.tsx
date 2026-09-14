import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SectorAgnostic } from './SectorAgnostic';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const PRINCIPLES = ['sector-context-shapes-the-question', 'fundamentals-still-matter', 'judgement-adapts-to-the-situation'];

describe('SectorAgnostic', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, lead, both body paragraphs, all three principles, and the closing statement', () => {
    mockDesktop(true);
    render(<SectorAgnostic />);
    expect(screen.getByText(/different industries\./i)).toBeInTheDocument();
    expect(screen.getByText(/sector knowledge matters/i)).toBeInTheDocument();
    expect(screen.getByText(/DCL approaches each opportunity/i)).toBeInTheDocument();
    expect(screen.getByText(/without losing sight of the underlying fundamentals/i)).toBeInTheDocument();
    for (const id of PRINCIPLES) {
      expect(screen.getByTestId(`sector-agnostic-principle-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-sector-agnostic-closing');
    expect(closing).toHaveTextContent('The framework is disciplined.');
    expect(closing).toHaveTextContent('The perspective remains adaptable.');
  });

  it('activates the first principle by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<SectorAgnostic />);
    expect(screen.getByTestId('sector-agnostic-principle-sector-context-shapes-the-question')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('sector-agnostic-principle-judgement-adapts-to-the-situation'));
    expect(screen.getByTestId('sector-agnostic-principle-judgement-adapts-to-the-situation')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(screen.getByTestId('sector-agnostic-principle-judgement-adapts-to-the-situation'));
    expect(screen.getByTestId('sector-agnostic-principle-sector-context-shapes-the-question')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every principle accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<SectorAgnostic />);
    for (const id of PRINCIPLES) {
      expect(screen.getByTestId(`sector-agnostic-principle-${id}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<SectorAgnostic />);
    const section = document.getElementById('sector-agnostic-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
