import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UnderstandingDecision } from './UnderstandingDecision';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const LABELS = ['The Objective', 'The Context', 'The Information', 'The Priorities'];

describe('UnderstandingDecision', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, all four areas, the image, and the closing statement', () => {
    mockDesktop(true);
    render(<UnderstandingDecision />);
    expect(screen.getByText(/before analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/every engagement begins/i)).toBeInTheDocument();
    for (const label of LABELS) {
      expect(screen.getByTestId(`understand-row-${label.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(label);
    }
    expect(screen.getByTestId('img-understand')).toHaveAttribute('src', 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp');
    const closing = screen.getByTestId('text-understand-closing');
    expect(closing).toHaveTextContent('Clarity begins by defining');
    expect(closing).toHaveTextContent('the question correctly.');
  });

  it('activates The Objective by default on desktop, and previews a different area on hover', () => {
    mockDesktop(true);
    render(<UnderstandingDecision />);
    expect(screen.getByTestId('understand-row-the-objective')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('understand-row-the-priorities'));
    expect(screen.getByTestId('understand-row-the-priorities')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/separate critical factors from background information/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('understand-row-the-priorities'));
    expect(screen.getByTestId('understand-row-the-objective')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every area accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<UnderstandingDecision />);
    for (const label of LABELS) {
      expect(screen.getByTestId(`understand-row-${label.toLowerCase().replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<UnderstandingDecision />);
    const section = document.getElementById('understanding-decision');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
