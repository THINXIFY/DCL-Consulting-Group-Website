import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { featuredInsight } from '@/data/insights-content';
import { FeaturedInsight } from './FeaturedInsight';

describe('FeaturedInsight', () => {
  it('renders the category, title, excerpt, and a link to the insight detail route', () => {
    render(<FeaturedInsight />);
    expect(screen.getByTestId('text-featured-insight-category')).toHaveTextContent(featuredInsight.category);
    expect(screen.getByTestId('text-featured-insight-title')).toHaveTextContent(featuredInsight.title);
    expect(screen.getByTestId('text-featured-insight-excerpt')).toHaveTextContent(featuredInsight.excerpt);
    const link = screen.getByTestId('link-featured-insight');
    expect(link).toHaveTextContent('Read Insight');
    expect(link).toHaveAttribute('href', `/insights/${featuredInsight.slug}`);
  });

  it('renders the featured image with real alt text, not a generic card', () => {
    render(<FeaturedInsight />);
    const img = screen.getByTestId('img-featured-insight');
    expect(img).toHaveAttribute('src', featuredInsight.image?.src);
    expect(img.getAttribute('alt')).toBe(featuredInsight.image?.alt);
  });
});
