import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Approach } from './Approach';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Approach', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders all five stages with no numbering and no eyebrow', () => {
    render(<Approach />);
    const section = document.getElementById('approach');
    for (const title of ['Understand', 'Analyse', 'Challenge', 'Assess', 'Advise']) {
      expect(screen.getByTestId(`text-stage-${title.toLowerCase()}`)).toHaveTextContent(title);
    }
    expect(section?.querySelector('.dclHome__eyebrow')).toBeNull();
  });

  it('marks the first stage active by default on desktop', () => {
    mockDesktop(true);
    render(<Approach />);
    expect(screen.getByTestId('text-stage-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-stage-advise')).toHaveAttribute('data-active', 'false');
  });

  it('marks every stage active on mobile (no dimming without a pinned scroll story)', () => {
    mockDesktop(false);
    render(<Approach />);
    expect(screen.getByTestId('text-stage-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-stage-advise')).toHaveAttribute('data-active', 'true');
  });
});
