import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { teamFinalCta } from '@/data/team-content';
import { TeamFinalCta } from './TeamFinalCta';

describe('TeamFinalCta', () => {
  it('renders the eyebrow, headline, copy, and the Contact DCL button routing to /contact', () => {
    render(<TeamFinalCta />);
    expect(screen.getByTestId('text-team-final-eyebrow')).toHaveTextContent(teamFinalCta.eyebrow);
    expect(screen.getByTestId('text-team-final-title')).toHaveTextContent(teamFinalCta.headlineLines.join(''));
    const cta = screen.getByTestId('link-team-final-cta');
    expect(cta).toHaveTextContent(teamFinalCta.cta.label);
    expect(cta).toHaveAttribute('href', '/contact');
  });
});
