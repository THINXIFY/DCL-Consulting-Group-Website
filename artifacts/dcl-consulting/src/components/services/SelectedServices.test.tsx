import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectedServices } from './SelectedServices';
import { selectedServices } from '@/data/services-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('SelectedServices', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, and the view-all link', () => {
    mockDesktop(true);
    render(<SelectedServices />);
    expect(screen.getByText(selectedServices.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('In');
    expect(screen.getByText(selectedServices.supporting)).toBeInTheDocument();
    const viewAll = screen.getByTestId('link-selected-services-view-all');
    expect(viewAll).toHaveTextContent(selectedServices.link.label);
    expect(viewAll).toHaveAttribute('href', selectedServices.link.href);
  });

  it('renders all three featured service tiles with correct routes', () => {
    mockDesktop(true);
    render(<SelectedServices />);
    for (const item of selectedServices.featured) {
      const link = screen.getByTestId(`link-selected-service-${slug(item.title)}`);
      expect(link).toHaveTextContent(item.title);
      expect(link).toHaveTextContent(item.supporting);
      expect(link).toHaveAttribute('href', item.href);
      expect(screen.getByTestId(`img-selected-service-${slug(item.title)}`)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<SelectedServices />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<SelectedServices />);
    const section = document.getElementById('selected-services');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
