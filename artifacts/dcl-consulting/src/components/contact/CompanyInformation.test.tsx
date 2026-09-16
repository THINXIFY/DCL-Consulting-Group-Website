import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CompanyInformation } from './CompanyInformation';

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

  it('renders exactly the five verified company facts as ruled rows, no cards', () => {
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
  });

  it('links to the real Companies House profile for company number 10086906', () => {
    render(<CompanyInformation />);
    const link = screen.getByTestId('link-company-register');
    expect(link).toHaveAttribute('href', 'https://find-and-update.company-information.service.gov.uk/company/10086906');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('links legal information to the real /terms route rather than an invented page', () => {
    render(<CompanyInformation />);
    expect(screen.getByTestId('link-company-legal')).toHaveAttribute('href', '/terms');
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
});
