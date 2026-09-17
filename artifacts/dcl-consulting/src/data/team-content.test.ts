import { describe, expect, it } from 'vitest';
import { teamDirectory, teamFinalCta, teamHero, teamLeadership } from './team-content';

const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { teamHero, teamLeadership, teamDirectory, teamFinalCta };

describe('team-content', () => {
  it('has the hero eyebrow, headline, intro, and background image', () => {
    expect(teamHero.eyebrow).toBe('Our Team');
    expect(teamHero.headlineLines).toHaveLength(2);
    expect(teamHero.intro).toBeTruthy();
    expect(teamHero.backgroundImage).toMatch(/^https:\/\//);
  });

  it('has exactly the four approved leadership members with real titles, nothing invented', () => {
    expect(teamLeadership.members.map(({ initials, name, role }) => ({ initials, name, role }))).toEqual([
      { initials: 'DL', name: 'David Christopher Lebond', role: 'Chairman' },
      { initials: 'SG', name: 'Sandeep Gupta', role: 'Managing Director' },
      { initials: 'SR', name: 'Stephan Rotstein', role: 'CFO' },
      { initials: 'PG', name: 'Patrick Gabaryan', role: 'COO' },
    ]);
  });

  it('has exactly the seven approved broader-team members with real titles, nothing invented', () => {
    expect(teamDirectory.members.map(({ name, role }) => ({ name, role }))).toEqual([
      { name: 'Steve Johnson', role: 'CRM' },
      { name: 'Thomas Zeman', role: 'Investment Manager' },
      { name: 'Markus Weber', role: 'Investment Analyst' },
      { name: 'Brian Alther', role: 'Sales Manager' },
      { name: 'Johnathan Reynolds', role: 'Finance Manager' },
      { name: 'Rajesh Sharma', role: 'Senior Investment Analyst' },
      { name: 'Sonia Agarwal', role: 'Financial Analyst' },
    ]);
  });

  it('has exactly eleven team members in total across leadership and the broader team', () => {
    expect(teamLeadership.members.length + teamDirectory.members.length).toBe(11);
  });

  it('every team member has a real 20-25 word description, no ellipsis truncation', () => {
    const allMembers = [...teamLeadership.members, ...teamDirectory.members];
    expect(allMembers).toHaveLength(11);
    for (const member of allMembers) {
      expect(member.description).toBeTruthy();
      expect(member.description).not.toContain('...');
      expect(member.description).not.toContain('…');
      const wordCount = member.description.trim().split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(20);
      expect(wordCount).toBeLessThanOrEqual(25);
    }
  });

  it('does not invent biographies, education, LinkedIn links, locations, or years of experience', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const forbidden of ['linkedin', 'university', 'years of experience', 'certified', 'msc', 'mba', 'phd']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('the final CTA routes to the real /contact page', () => {
    expect(teamFinalCta.cta).toEqual({ label: 'Contact DCL', href: '/contact' });
  });

  it('contains no decorative numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
