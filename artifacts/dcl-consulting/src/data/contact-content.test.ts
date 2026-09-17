import { describe, expect, it } from 'vitest';
import { companyInformation, contactHero, contactSupportCta, getInTouchBand, howCanWeHelp, whatHappensNext } from './contact-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { contactHero, howCanWeHelp, whatHappensNext, contactSupportCta, companyInformation, getInTouchBand };

describe('contact-content', () => {
  it('hero has the label, two-line headline, lead, and both CTAs', () => {
    expect(contactHero.headlineLines).toHaveLength(2);
    expect(contactHero.primaryCta.href).toBe('#how-can-we-help');
    expect(contactHero.secondaryCta.href).toBe('/approach');
  });

  it('has exactly four enquiry types, each with a unique id', () => {
    expect(howCanWeHelp.enquiryTypes).toHaveLength(4);
    const ids = howCanWeHelp.enquiryTypes.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('the not-connected notice is honest and does not imply the message was actually delivered', () => {
    const text = howCanWeHelp.notConnectedNotice.toLowerCase();
    expect(text).not.toContain('sent');
    expect(text).not.toContain('received your message');
    expect(text).not.toContain('we will respond');
  });

  it('what happens next has exactly three stages, no decorative numbering', () => {
    expect(whatHappensNext.stages).toHaveLength(3);
    for (const stage of whatHappensNext.stages) {
      expect(stage.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('does not contain any fabricated email, phone number, or physical address', () => {
    const text = allStrings(ALL_CONTENT).join(' ');
    expect(text).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(text).not.toMatch(/\+?\d[\d\s()-]{7,}\d/);
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });

  it('company information has exactly the six verified facts, no invented fields', () => {
    expect(companyInformation.facts).toHaveLength(6);
    const labels = companyInformation.facts.map((fact) => fact.label);
    expect(labels).toEqual(['Company Number', 'Director', 'Registered Office', 'London Office', 'Jurisdiction', 'Website']);
    expect(companyInformation.facts.find((fact) => fact.label === 'Company Number')?.lines).toEqual(['10086906']);
    expect(companyInformation.facts.find((fact) => fact.label === 'Director')?.lines).toEqual(['David Christopher Lebond']);
    expect(companyInformation.facts.find((fact) => fact.label === 'London Office')?.lines).toEqual(['5 Beaconsfield Street,', 'London,', 'United Kingdom,', 'N1C 4EW']);
    expect(companyInformation.companiesHouseHref).toBe('https://find-and-update.company-information.service.gov.uk/company/10086906/officers');
    expect(companyInformation.impressumCta).toEqual({ label: 'Impressum', href: '/impressum' });
  });

  it('does not invent an email, phone number, office hours, or social handle for the get-in-touch band', () => {
    const labels = getInTouchBand.verifiedDetails.map((fact) => fact.label);
    expect(labels).toEqual(['Registered Office']);
    const text = allStrings(getInTouchBand).join(' ').toLowerCase();
    for (const forbidden of ['email', 'phone', 'office hours', 'whatsapp', 'fax']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('the registered office address matches exactly between the two sections (only the country line differs)', () => {
    const topLines = companyInformation.facts.find((fact) => fact.label === 'Registered Office')?.lines ?? [];
    const bottomLines = getInTouchBand.verifiedDetails.find((fact) => fact.label === 'Registered Office')?.lines ?? [];
    expect(bottomLines.slice(0, topLines.length)).toEqual(topLines);
  });
});
