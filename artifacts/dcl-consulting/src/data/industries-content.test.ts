import { describe, expect, it } from 'vitest';
import { globalPerspective, industriesFinalCta, industriesHero, ourIndustries, whatWeLookFor, whereSectorPerspectiveMatters } from './industries-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { industriesHero, ourIndustries, globalPerspective, whatWeLookFor, whereSectorPerspectiveMatters, industriesFinalCta };

describe('industries-content', () => {
  it('hero has the label, two-line headline, lead, and both CTAs', () => {
    expect(industriesHero.headlineLines).toHaveLength(2);
    expect(industriesHero.primaryCta.href).toBe('/services');
    expect(industriesHero.secondaryCta.href).toBe('/approach');
  });

  it('our industries has exactly twelve sectors across featured and compact groups, with no duplicates', () => {
    const all = [...ourIndustries.featured, ...ourIndustries.compact];
    expect(all).toHaveLength(12);
    const names = all.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('global perspective does not reference fake maps, network nodes, or world diagrams', () => {
    const text = globalPerspective.copy.toLowerCase();
    expect(text).not.toContain('network');
    expect(text).not.toContain('map');
  });

  it('what we look for has exactly six evaluation factors', () => {
    expect(whatWeLookFor.factors).toHaveLength(6);
    for (const factor of whatWeLookFor.factors) {
      expect(factor.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('where sector perspective matters has exactly six situations', () => {
    expect(whereSectorPerspectiveMatters.situations).toHaveLength(6);
  });

  it('final CTA has both CTAs and the closing line', () => {
    expect(industriesFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(industriesFinalCta.secondaryCta.href).toBe('/expertise');
    expect(industriesFinalCta.closing).toBe('Clarity Before Capital.');
  });

  it('does not imply DCL holds money, has custody, executes trades, or guarantees returns', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage']) {
      expect(text).not.toContain(phrase);
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
