import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhoWeAdvise } from './WhoWeAdvise';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhoWeAdvise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, and all three audiences with copy always in the DOM', () => {
    mockDesktop(true);
    render(<WhoWeAdvise />);
    expect(screen.getByTestId('text-advise-eyebrow')).toHaveTextContent('Who we advise');
    expect(screen.getByText(/perspective for decisions that carry weight/i)).toBeInTheDocument();
    for (const title of ['Private Capital', 'Corporate Ambition', 'Strategic Opportunity']) {
      expect(screen.getByTestId(`audience-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('marks the first audience active by default on desktop and updates on focus', () => {
    mockDesktop(true);
    render(<WhoWeAdvise />);
    expect(screen.getByTestId('audience-private-capital')).toHaveAttribute('data-active', 'true');
    fireEvent.focus(screen.getByTestId('audience-corporate-ambition'));
    expect(screen.getByTestId('audience-corporate-ambition')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('audience-private-capital')).toHaveAttribute('data-active', 'false');
  });

  it('shows every audience without requiring interaction on mobile', () => {
    mockDesktop(false);
    render(<WhoWeAdvise />);
    for (const title of ['Private Capital', 'Corporate Ambition', 'Strategic Opportunity']) {
      expect(screen.getByTestId(`audience-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
  });
});
