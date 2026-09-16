import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Route, Router } from 'wouter';
import ServiceDetailPage from './service-detail';
import { allServices } from '@/data/services-content';

function renderAt(path: string) {
  return render(
    <Router hook={() => [path, () => {}]}>
      <Route path="/services/:slug" component={ServiceDetailPage} />
    </Router>,
  );
}

describe('ServiceDetailPage', () => {
  it('renders the approved name and description for a known service slug', () => {
    const service = allServices[0]!;
    renderAt(`/services/${service.slug}`);
    expect(screen.getByTestId('text-service-detail-title')).toHaveTextContent(service.name);
    expect(screen.getByTestId('text-service-detail-description')).toHaveTextContent(service.description);
  });

  it('renders a graceful fallback for an unknown service slug, with no fabricated content', () => {
    renderAt('/services/not-a-real-service');
    expect(screen.getByTestId('text-service-detail-title')).toHaveTextContent('Service not found.');
  });

  it('links back to the Services hub', () => {
    const service = allServices[0]!;
    renderAt(`/services/${service.slug}`);
    expect(screen.getByTestId('link-service-detail-back')).toHaveAttribute('href', '/services');
  });

  it('renders the header and footer', () => {
    const service = allServices[0]!;
    renderAt(`/services/${service.slug}`);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
