import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhoWeAre } from './WhoWeAre';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhoWeAre', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, lead, image, both body paragraphs, and the closing statement', () => {
    mockDesktop(true);
    render(<WhoWeAre />);
    expect(screen.getByTestId('text-whoweare-title')).toHaveTextContent('Independent thinking');
    expect(screen.getByTestId('text-whoweare-title')).toHaveTextContent('for decisions that matter.');
    expect(screen.getByTestId('text-whoweare-lead')).toHaveTextContent(/develop a clearer understanding/i);
    expect(screen.getByTestId('img-whoweare')).toBeInTheDocument();
    expect(screen.getByText(/examine the wider picture/i)).toBeInTheDocument();
    expect(screen.getByText(/rather than approaching every situation/i)).toBeInTheDocument();
    const closing = screen.getByTestId('text-whoweare-closing');
    expect(closing).toHaveTextContent('The objective is simple:');
    expect(closing).toHaveTextContent('a better-informed view');
    expect(closing).toHaveTextContent('closer attention.');
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhoWeAre />);
    const section = document.getElementById('who-we-are');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });

  it('does not throw when rendered without desktop matchMedia support', () => {
    mockDesktop(false);
    expect(() => render(<WhoWeAre />)).not.toThrow();
  });
});
