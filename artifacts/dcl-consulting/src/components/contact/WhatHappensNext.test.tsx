import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatHappensNext } from './WhatHappensNext';
import { whatHappensNext } from '@/data/contact-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

describe('WhatHappensNext', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, and all three stages with no decorative numbering', () => {
    mockDesktop(true);
    render(<WhatHappensNext />);
    expect(screen.getByText(whatHappensNext.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A clear and');
    expect(screen.getByText(whatHappensNext.supporting)).toBeInTheDocument();
    for (const stage of whatHappensNext.stages) {
      const el = screen.getByTestId(`happens-next-stage-${slug(stage.name)}`);
      expect(el).toHaveTextContent(stage.name);
      expect(el).toHaveTextContent(stage.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhatHappensNext />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatHappensNext />);
    const section = document.getElementById('what-happens-next');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
