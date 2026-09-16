import { describe, expect, it } from 'vitest';
import {
  aboutContent,
  approach,
  approachBandImage,
  companyFacts,
  expertiseSection,
  faq,
  heroContent,
  industries,
  industriesImage,
  insights,
  whyDcl,
  whyDclImage,
} from './home-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(allStrings);
  }
  return [];
}

describe('home-content', () => {
  it('has four expertise areas with a real icon, headline, copy, and link, no numbering fields', () => {
    expect(expertiseSection.areas).toHaveLength(4);
    expect(expertiseSection.areas.map((area) => area.label)).toEqual(['Commercial Analysis', 'Financial Review', 'Strategic Insight', 'Risk Evaluation']);
    for (const area of expertiseSection.areas) {
      expect(area).not.toHaveProperty('number');
      expect(area.headlineLines).toHaveLength(2);
      expect(area.copy).toBeTruthy();
      expect(area.href).toBeTruthy();
    }
  });

  it('has a real, locally hosted image for the expertise section', () => {
    expect(expertiseSection.image.src).toContain('/images/home/');
    expect(expertiseSection.image.alt).toBeTruthy();
  });

  it('has four approach stages (Understand, Analyse, Evaluate, Advise), no numbering', () => {
    expect(approach).toHaveLength(4);
    expect(approach.map((stage) => stage.title)).toEqual(['Understand', 'Analyse', 'Evaluate', 'Advise']);
    for (const stage of approach) {
      expect(stage).not.toHaveProperty('number');
      expect(stage.copy).toBeTruthy();
    }
  });

  it('has six industries with no numbering or per-item image fields', () => {
    expect(industries).toHaveLength(6);
    for (const item of industries) {
      expect(item).not.toHaveProperty('number');
      expect(item).not.toHaveProperty('image');
      expect(item.name).toBeTruthy();
      expect(item.context).toBeTruthy();
    }
  });

  it('has exactly one dominant industries image, not per-item crossfades', () => {
    expect(industriesImage.src).toContain('/images/home/');
    expect(industriesImage.alt).toBeTruthy();
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [...allStrings(expertiseSection), ...allStrings(approach), ...allStrings(industries)].filter(
      (s) => !s.startsWith('http') && !s.startsWith('/'),
    );
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });

  it('has five why-dcl qualities (including Long-Term Thinking), no numbering', () => {
    expect(whyDcl).toHaveLength(5);
    expect(whyDcl.map((item) => item.title)).toContain('Long-Term Thinking');
    for (const item of whyDcl) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has one real, locally hosted image for why-dcl', () => {
    expect(whyDclImage.src).toContain('/images/home/');
    expect(whyDclImage.alt).toBeTruthy();
  });

  it('has exactly the five real company facts from the brief, nothing invented', () => {
    expect(companyFacts).toEqual([
      { label: 'Company', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company Type', value: 'Private Limited Company' },
      { label: 'Registered In', value: 'England & Wales' },
      { label: 'Company Number', value: '10086906' },
      { label: 'Director', value: 'David Christopher Lebond' },
    ]);
  });

  it('has no numbering or em-dash characters in the why-dcl or company-facts arrays', () => {
    const strings = [...allStrings(whyDcl), ...allStrings(companyFacts)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });

  it('has five FAQ items with no numbering or em-dash characters', () => {
    expect(faq).toHaveLength(5);
    expect(faq.map((item) => item.question)).toEqual([
      'What does DCL do?',
      'Who does DCL work with?',
      'How is DCL different?',
      'Does DCL manage or execute investments?',
      'How do we start a conversation?',
    ]);
    for (const item of faq) {
      expect(item).not.toHaveProperty('number');
      expect(item.answer).toBeTruthy();
    }
    for (const s of allStrings(faq)) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });

  it('has three insight perspective statements with no fabricated article metadata', () => {
    expect(insights).toHaveLength(3);
    for (const item of insights) {
      expect(item).not.toHaveProperty('date');
      expect(item).not.toHaveProperty('readTime');
      expect(item).not.toHaveProperty('author');
      expect(item).not.toHaveProperty('image');
      expect(item).not.toHaveProperty('route');
      expect(item).not.toHaveProperty('href');
      expect(item.theme).toBeTruthy();
      expect(item.statement).toBeTruthy();
    }
  });

  it('has real, locally hosted images for hero, about and the approach band', () => {
    for (const image of [heroContent.image, aboutContent.image, approachBandImage]) {
      expect(image.src).toContain('/images/home/');
      expect(image.alt).toBeTruthy();
    }
  });

  it('has exactly three about principles', () => {
    expect(aboutContent.principles).toHaveLength(3);
    for (const principle of aboutContent.principles) {
      expect(principle.title).toBeTruthy();
      expect(principle.copy).toBeTruthy();
    }
  });
});
