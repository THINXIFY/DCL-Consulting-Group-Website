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
  industriesSection,
  insights,
  servicesSection,
  whyDcl,
  whyDclImage,
  whyDclSection,
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
  it('has four expertise groups matching the real services taxonomy, with real routes and no numbering fields', () => {
    expect(expertiseSection.groups).toHaveLength(4);
    expect(expertiseSection.groups.map((group) => group.heading)).toEqual([
      'Investment & Private Capital',
      'Real Estate & Assets',
      'Corporate & Strategic',
      'Analysis & Decision Support',
    ]);
    for (const group of expertiseSection.groups) {
      expect(group).not.toHaveProperty('number');
      expect(group.copy).toBeTruthy();
      expect(group.capabilities.length).toBeGreaterThanOrEqual(1);
      expect(group.capabilities.length).toBeLessThanOrEqual(4);
      for (const capability of group.capabilities) {
        expect(capability.label).toBeTruthy();
        expect(capability.href).toMatch(/^\/services\//);
      }
    }
  });

  it('has the expertise CTA routing to /expertise', () => {
    expect(expertiseSection.cta).toEqual({ label: 'Explore All Expertise', href: '/expertise' });
  });

  it('has the homepage industries section CTA routing to /industries and the editorial micro-copy', () => {
    expect(industriesSection.cta).toEqual({ label: 'View All Industries', href: '/industries' });
    expect(industriesSection.microLines).toHaveLength(3);
    expect(industriesSection.backgroundImage).toMatch(/^https:\/\//);
  });

  it('has the homepage services section CTA routing to /services and the editorial micro-copy', () => {
    expect(servicesSection.cta).toEqual({ label: 'Explore All Services', href: '/services' });
    expect(servicesSection.microLabel).toBeTruthy();
    expect(servicesSection.sideMicroLines).toHaveLength(3);
    expect(servicesSection.bottomMicroLines).toHaveLength(2);
    expect(servicesSection.backgroundImage).toMatch(/^https:\/\//);
  });

  it('has four approach stages (Understand, Analyse, Evaluate, Advise), no numbering', () => {
    expect(approach).toHaveLength(4);
    expect(approach.map((stage) => stage.title)).toEqual(['Understand', 'Analyse', 'Evaluate', 'Advise']);
    for (const stage of approach) {
      expect(stage).not.toHaveProperty('number');
      expect(stage.copy).toBeTruthy();
    }
  });

  it('has six industries, each with a real, distinct image, no numbering fields', () => {
    expect(industries).toHaveLength(6);
    for (const item of industries) {
      expect(item).not.toHaveProperty('number');
      expect(item.name).toBeTruthy();
      expect(item.context).toBeTruthy();
      expect(item.image.src).toMatch(/\.webp$/);
      expect(item.image.alt).toBeTruthy();
    }
    const srcs = industries.map((item) => item.image.src);
    expect(new Set(srcs).size).toBe(srcs.length);
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

  it('has five why-dcl qualities (including Long-Term Thinking), each with a real icon, no numbering', () => {
    expect(whyDcl).toHaveLength(5);
    expect(whyDcl.map((item) => item.title)).toContain('Long-Term Thinking');
    for (const item of whyDcl) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
      expect(item.icon).toBeTruthy();
    }
  });

  it('has one real, locally hosted image for why-dcl', () => {
    expect(whyDclImage.src).toContain('/images/home/');
    expect(whyDclImage.alt).toBeTruthy();
  });

  it('has the why-dcl section CTA routing to /approach and the micro-text lines', () => {
    expect(whyDclSection.cta).toEqual({ label: 'Our Approach', href: '/approach' });
    expect(whyDclSection.microLines).toHaveLength(3);
    expect(whyDclSection.microStatementLines).toHaveLength(2);
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

  it('has real, locally hosted images for the hero and the approach band', () => {
    for (const image of [heroContent.image, approachBandImage]) {
      expect(image.src).toContain('/images/home/');
      expect(image.alt).toBeTruthy();
    }
  });

  it('has a real, explicitly sourced image for the about section', () => {
    expect(aboutContent.image.src).toMatch(/^https:\/\//);
    expect(aboutContent.image.alt).toBeTruthy();
  });

  it('has the about CTA, micro statement, image micro-lines, and a real company facts panel', () => {
    expect(aboutContent.cta).toEqual({ label: 'Learn More', href: '/about' });
    expect(aboutContent.microStatementLines).toHaveLength(2);
    expect(aboutContent.imageMicroLines).toHaveLength(3);
    expect(aboutContent.panel.companyName).toBe('DCL Consulting and Investments Limited');
    expect(aboutContent.panel.facts).toEqual([
      { icon: 'building', label: 'Private limited company' },
      { icon: 'file', label: 'Registered in England and Wales' },
      { icon: 'hash', label: 'Company no. 10086906' },
    ]);
    expect(aboutContent.panel.statementLines).toHaveLength(2);
  });
});
