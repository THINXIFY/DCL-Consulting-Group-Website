import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { leadership } from '@/data/about-content';
import { Leadership } from './Leadership';

describe('Leadership', () => {
  it('renders the eyebrow, headline, intro, and all four leadership members', () => {
    render(<Leadership />);
    expect(screen.getByTestId('text-leadership-eyebrow')).toHaveTextContent('Leadership');
    expect(screen.getByText(/leadership grounded/i)).toBeInTheDocument();

    for (const member of leadership.members) {
      const testId = `leadership-member-${member.name.toLowerCase().replaceAll(' ', '-')}`;
      const el = screen.getByTestId(testId);
      expect(el).toHaveTextContent(member.name);
      expect(el).toHaveTextContent(member.role);
      expect(el).toHaveTextContent(member.initials);
    }
    expect(screen.getByText('David Christopher Lebond')).toBeInTheDocument();
    expect(screen.getByText('Chairman')).toBeInTheDocument();
  });

  it('renders a Meet the Team link routing to the real /team page', () => {
    render(<Leadership />);
    const link = screen.getByTestId('link-leadership-meet-team');
    expect(link).toHaveTextContent('Meet the Team');
    expect(link).toHaveAttribute('href', '/team');
  });

  it('does not render any image (typography-led, no fabricated portrait)', () => {
    render(<Leadership />);
    expect(document.querySelectorAll('img')).toHaveLength(0);
  });

  it('does not invent biography, career history, or credentials', () => {
    render(<Leadership />);
    const section = document.getElementById('leadership');
    const text = section?.textContent?.toLowerCase() ?? '';
    for (const forbidden of ['award', 'qualification', 'years of experience', 'ceo', 'founder of']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('contains no numbering or em-dash characters', () => {
    render(<Leadership />);
    const section = document.getElementById('leadership');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
