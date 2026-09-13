import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CompanyFoundations } from './CompanyFoundations';

describe('CompanyFoundations', () => {
  it('renders the headline, intro, and the exact five confirmed facts', () => {
    render(<CompanyFoundations />);
    expect(screen.getByText(/built on a clear foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/registered in england and wales/i)).toBeInTheDocument();

    for (const [label, value] of [
      ['Company', 'DCL Consulting and Investments Limited'],
      ['Company Type', 'Private Limited Company'],
      ['Registered In', 'England & Wales'],
      ['Company Number', '10086906'],
      ['Director', 'David Christopher Lebond'],
    ]) {
      const row = screen.getByTestId(`foundation-fact-${label.toLowerCase().replaceAll(' ', '-')}`);
      expect(row).toHaveTextContent(label);
      expect(row).toHaveTextContent(value);
    }
  });

  it('renders the closing anchor line as the full company name', () => {
    render(<CompanyFoundations />);
    const anchor = screen.getByTestId('text-foundations-anchor');
    expect(anchor).toHaveTextContent('DCL Consulting');
    expect(anchor).toHaveTextContent('and Investments Limited');
  });

  it('does not invent unconfirmed statistics', () => {
    render(<CompanyFoundations />);
    const section = document.getElementById('company-foundations');
    const text = section?.textContent?.toLowerCase() ?? '';
    for (const forbidden of ['assets under management', 'clients', 'years in business', 'countries']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('contains no em-dash characters', () => {
    render(<CompanyFoundations />);
    const section = document.getElementById('company-foundations');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
