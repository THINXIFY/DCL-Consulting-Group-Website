import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServiceDirectory } from './ServiceDirectory';
import { serviceDirectory, serviceDirectoryIntro } from '@/data/services-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(label: string) {
  return label.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('ServiceDirectory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the intro label, headline, supporting copy, and statement', () => {
    mockDesktop(true);
    render(<ServiceDirectory />);
    expect(screen.getByText(serviceDirectoryIntro.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Expertise for');
    expect(screen.getByText(serviceDirectoryIntro.supporting)).toBeInTheDocument();
    const section = document.getElementById('service-directory');
    for (const line of serviceDirectoryIntro.statementLines) {
      expect(section?.textContent).toContain(line);
    }
  });

  it('renders all four service families with their line and image', () => {
    mockDesktop(true);
    render(<ServiceDirectory />);
    for (const family of serviceDirectory.families) {
      const el = screen.getByTestId(`service-family-${slug(family.heading)}`);
      expect(el).toHaveTextContent(family.heading);
      expect(el).toHaveTextContent(family.line);
      expect(screen.getByTestId(`img-service-family-${slug(family.heading)}`)).toBeInTheDocument();
    }
  });

  it('renders all ten service links across the four families with correct routes', () => {
    mockDesktop(true);
    render(<ServiceDirectory />);
    const allServices = serviceDirectory.families.flatMap((f) => f.services);
    expect(allServices).toHaveLength(10);
    for (const service of allServices) {
      const link = screen.getByTestId(`link-service-directory-${slug(service.label)}`);
      expect(link).toHaveTextContent(service.label);
      expect(link).toHaveAttribute('href', service.href);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<ServiceDirectory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<ServiceDirectory />);
    const section = document.getElementById('service-directory');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
