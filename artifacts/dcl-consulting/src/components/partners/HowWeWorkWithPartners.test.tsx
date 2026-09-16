import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowWeWorkWithPartners } from './HowWeWorkWithPartners';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HowWeWorkWithPartners', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, and all four stages with no step numbers', () => {
    mockDesktop(true);
    render(<HowWeWorkWithPartners />);
    expect(screen.getByTestId('text-how-we-work-eyebrow')).toHaveTextContent('How We Work With Partners');
    for (const label of ['Understand', 'Align', 'Collaborate', 'Deliver']) {
      expect(screen.getByTestId(`how-we-work-stage-${label.toLowerCase()}`)).toHaveTextContent(label);
    }
    const section = document.getElementById('how-we-work-with-partners');
    expect(section?.textContent).not.toMatch(/\b0[1-4]\b/);
  });

  it('marks the first stage active by default on desktop and responds to focus', () => {
    mockDesktop(true);
    render(<HowWeWorkWithPartners />);
    expect(screen.getByTestId('how-we-work-stage-understand')).toHaveAttribute('data-active', 'true');
    fireEvent.focus(screen.getByTestId('how-we-work-stage-deliver'));
    expect(screen.getByTestId('how-we-work-stage-deliver')).toHaveAttribute('data-active', 'true');
  });

  it('marks every stage active on mobile (no interaction required)', () => {
    mockDesktop(false);
    render(<HowWeWorkWithPartners />);
    expect(screen.getByTestId('how-we-work-stage-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('how-we-work-stage-deliver')).toHaveAttribute('data-active', 'true');
  });
});
