import { describe, expect, it } from 'vitest';
import { dclCompany } from './company';

describe('company', () => {
  it('has the verified DCL company and legal facts, nothing invented', () => {
    expect(dclCompany.name).toBe('DCL Consulting and Investments Limited');
    expect(dclCompany.number).toBe('10086906');
    expect(dclCompany.type).toBe('Private Limited Company');
    expect(dclCompany.jurisdiction).toBe('England and Wales');
    expect(dclCompany.email).toBe('info@dcl-consulting-group.com');
    expect(dclCompany.website).toBe('dcl-consulting-group.com');
    expect(dclCompany.companiesHouseUrl).toBe('https://find-and-update.company-information.service.gov.uk/company/10086906/officers');
  });

  it('has the registered office and London office as separate, correctly labelled addresses', () => {
    expect(dclCompany.registeredOfficeLines).toEqual(['3 Tallow Wharf', 'Birchley Green', 'Hertford', 'Hertfordshire', 'England', 'SG14 1FF']);
    expect(dclCompany.londonOfficeLines).toEqual(['5 Beaconsfield Street', 'London', 'United Kingdom', 'N1C 4EW']);
  });
});
