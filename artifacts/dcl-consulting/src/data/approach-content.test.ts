import { describe, expect, it } from 'vitest';
import {
  analysisToJudgement,
  approachFinalCta,
  approachHero,
  challengeAssumptions,
  evaluationProcess,
  understandingDecision,
  workingWithDcl,
} from './approach-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('approach-content', () => {
  it('has a five-line closing statement on the hero, not numbered steps, and six information terms', () => {
    expect(approachHero.closingLines).toEqual(['Understand.', 'Analyse.', 'Challenge.', 'Assess.', 'Advise.']);
    expect(approachHero.informationTerms).toHaveLength(6);
    for (const term of approachHero.informationTerms) {
      expect(term.label).toBeTruthy();
      expect(term).not.toHaveProperty('number');
    }
  });

  it('has four understanding-the-decision areas, each with a label, question, and copy', () => {
    expect(understandingDecision.areas).toHaveLength(4);
    for (const area of understandingDecision.areas) {
      expect(area).not.toHaveProperty('number');
      expect(area.label).toBeTruthy();
      expect(area.question).toBeTruthy();
      expect(area.copy).toBeTruthy();
    }
  });

  it('has exactly five evaluation stages, in order, each with a name, statement, and description', () => {
    expect(evaluationProcess.stages.map((s) => s.name)).toEqual(['Understand', 'Analyse', 'Challenge', 'Assess', 'Advise']);
    for (const stage of evaluationProcess.stages) {
      expect(stage).not.toHaveProperty('number');
      expect(stage.statement).toBeTruthy();
      expect(stage.description).toBeTruthy();
    }
  });

  it('has four challenge questions, each with a question and copy', () => {
    expect(challengeAssumptions.questions).toHaveLength(4);
    for (const item of challengeAssumptions.questions) {
      expect(item).not.toHaveProperty('number');
      expect(item.question).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has exactly three judgement ideas and ten real (non-numeric) background terms', () => {
    expect(analysisToJudgement.ideas).toHaveLength(3);
    expect(analysisToJudgement.backgroundTerms).toHaveLength(10);
    for (const term of analysisToJudgement.backgroundTerms) {
      expect(term).not.toMatch(/\d/);
    }
  });

  it('has four engagement principles for working with DCL', () => {
    expect(workingWithDcl.principles).toHaveLength(4);
    for (const item of workingWithDcl.principles) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has final CTA content with both CTAs pointing at real destinations', () => {
    expect(approachFinalCta.primaryCta.href).toBe('/#about');
    expect(approachFinalCta.secondaryCta.href).toBe('/expertise');
    expect(approachFinalCta.closing).toBe('Clarity Before Capital.');
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [
      ...allStrings(approachHero),
      ...allStrings(understandingDecision),
      ...allStrings(evaluationProcess),
      ...allStrings(challengeAssumptions),
      ...allStrings(analysisToJudgement),
      ...allStrings(workingWithDcl),
      ...allStrings(approachFinalCta),
    ];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
