import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { insightsFinalCta } from '@/data/insights-content';
import { InsightsFinalCta } from './InsightsFinalCta';

describe('InsightsFinalCta', () => {
  it('renders the eyebrow, headline, copy, and the Contact DCL button routing to /contact', () => {
    render(<InsightsFinalCta />);
    expect(screen.getByTestId('text-insights-final-cta-eyebrow')).toHaveTextContent('Start a Conversation');
    expect(screen.getByTestId('text-insights-final-cta-title')).toHaveTextContent('Turn perspective into');
    expect(screen.getByText(insightsFinalCta.copy)).toBeInTheDocument();
    const cta = screen.getByTestId('link-insights-final-cta');
    expect(cta).toHaveTextContent('Contact DCL');
    expect(cta).toHaveAttribute('href', '/contact');
  });
});
