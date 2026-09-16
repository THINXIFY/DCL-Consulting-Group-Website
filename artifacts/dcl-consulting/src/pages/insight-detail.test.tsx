import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Route, Router } from 'wouter';
import InsightDetailPage from './insight-detail';
import { insightsArchive } from '@/data/insights-content';

function renderAt(path: string) {
  return render(
    <Router hook={() => [path, () => {}]}>
      <Route path="/insights/:slug" component={InsightDetailPage} />
    </Router>,
  );
}

describe('InsightDetailPage', () => {
  it('renders the category, title, and excerpt for a known insight slug', () => {
    const insight = insightsArchive[0]!;
    renderAt(`/insights/${insight.slug}`);
    expect(screen.getByTestId('text-insight-detail-category')).toHaveTextContent(insight.category);
    expect(screen.getByTestId('text-insight-detail-title')).toHaveTextContent(insight.title);
    expect(screen.getByTestId('text-insight-detail-excerpt')).toHaveTextContent(insight.excerpt);
  });

  it('renders a graceful fallback for an unknown insight slug, with no fabricated content', () => {
    renderAt('/insights/not-a-real-insight');
    expect(screen.getByTestId('text-insight-detail-title')).toHaveTextContent('Insight not found.');
  });

  it('links back to the Insights hub', () => {
    const insight = insightsArchive[0]!;
    renderAt(`/insights/${insight.slug}`);
    expect(screen.getByTestId('link-insight-detail-back')).toHaveAttribute('href', '/insights');
  });

  it('renders the header and footer', () => {
    const insight = insightsArchive[0]!;
    renderAt(`/insights/${insight.slug}`);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
