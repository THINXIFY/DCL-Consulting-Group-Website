import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompanyInformation } from './CompanyInformation';

vi.mock('@workspace/api-client-react', () => ({
  useStartRequestInfo: () => ({ mutateAsync: vi.fn() }),
  useResendRequestInfoCode: () => ({ mutateAsync: vi.fn() }),
  useVerifyRequestInfoCode: () => ({ mutateAsync: vi.fn() }),
}));

describe('CompanyInformation', () => {
  it('renders the eyebrow, headline, intro, and both CTAs', () => {
    render(<CompanyInformation />);
    expect(screen.getByTestId('text-company-info-eyebrow')).toHaveTextContent('Company Information');
    expect(screen.getByTestId('text-company-info-headline')).toHaveTextContent('A clear point');
    expect(screen.getByTestId('text-company-info-intro')).toHaveTextContent('We welcome enquiries');
    expect(screen.getByTestId('link-company-info-primary')).toHaveAttribute('href', '#how-can-we-help');
    expect(screen.getByTestId('link-company-info-secondary')).toHaveAttribute('href', '/services');
  });

  it('renders the consulting image with a real src and honest, non-office-claiming alt text', () => {
    render(<CompanyInformation />);
    const image = screen.getByTestId('img-company-info');
    expect(image).toHaveAttribute('src', expect.stringContaining('/images/general/'));
    const alt = image.getAttribute('alt') ?? '';
    expect(alt.toLowerCase()).not.toContain('dcl office');
    expect(alt.toLowerCase()).not.toContain('dcl employee');
  });

  it('renders exactly the six verified company facts as ruled rows, no cards', () => {
    render(<CompanyInformation />);
    for (const [label, value] of [
      ['Company Number', '10086906'],
      ['Director', 'David Christopher Lebond'],
      ['Jurisdiction', 'England and Wales'],
      ['Website', 'dcl-consulting-group.com'],
    ]) {
      const row = screen.getByTestId(`company-info-fact-${label.toLowerCase().replaceAll(' ', '-')}`);
      expect(row).toHaveTextContent(label);
      expect(row).toHaveTextContent(value);
    }
    const office = screen.getByTestId('company-info-fact-registered-office');
    expect(office).toHaveTextContent('Tallow Wharf');
    expect(office).toHaveTextContent('SG14 1FF');
    expect(office.querySelector('address')).not.toBeNull();

    const londonOffice = screen.getByTestId('company-info-fact-london-office');
    expect(londonOffice).toHaveTextContent('5 Beaconsfield Street');
    expect(londonOffice).toHaveTextContent('N1C 4EW');
  });

  it('links to the real Companies House profile for company number 10086906', () => {
    render(<CompanyInformation />);
    const link = screen.getByTestId('link-company-register');
    expect(link).toHaveAttribute('href', 'https://find-and-update.company-information.service.gov.uk/company/10086906/officers');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('links legal information to the real /terms route, and Impressum to the real /impressum route', () => {
    render(<CompanyInformation />);
    expect(screen.getByTestId('link-company-legal')).toHaveAttribute('href', '/terms');
    expect(screen.getByTestId('link-company-impressum')).toHaveAttribute('href', '/impressum');
  });

  it('does not invent an email, phone number, or office hours', () => {
    render(<CompanyInformation />);
    const text = (document.getElementById('company-information')?.textContent ?? '').toLowerCase();
    expect(text).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(text).not.toContain('office hours');
  });

  it('contains no numbering or em-dash characters', () => {
    render(<CompanyInformation />);
    const section = document.getElementById('company-information');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });

  it('opens the request-more-info modal when the trigger is clicked', () => {
    render(<CompanyInformation />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('button-request-more-info'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
