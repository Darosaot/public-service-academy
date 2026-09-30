import { describe, expect, it } from 'vitest';
import { replay, scoreAttempt } from '@academy/engine';
import {
  articleLabel,
  articleList,
  articles,
  articleUrl,
  citationsByArticle,
  defineMission,
  missions,
  validateLaw,
  validateMissions,
} from '../src';

describe('content', () => {
  it('passes validation', () => {
    expect(validateMissions(missions)).toEqual([]);
    expect(validateLaw()).toEqual([]);
  });

  it('keeps keys out of the public mission', () => {
    for (const { mission } of missions) {
      expect(JSON.stringify(mission)).not.toMatch(/"rationale"|"grade"|"refs"/);
    }
  });

  it('can play and score every mission on its best path', () => {
    for (const { mission, keys } of missions) {
      const decisions = mission.steps.map((step) => {
        const best = step.choices.find((c) => keys[step.id]?.[c.id]?.grade === 'best');
        return { stepId: step.id, choiceId: (best ?? step.choices[0])!.id };
      });
      replay(mission, 1, decisions);
      expect(scoreAttempt(mission, keys, decisions).stars).toBe(3);
    }
  });

  it('catches an unkeyed choice and an unknown reference (the guard can fire)', () => {
    const broken = defineMission('m.broken', {
      title: 'Broken',
      briefing: 'Broken',
      estMinutes: 5,
      steps: [
        {
          id: 's',
          kind: 'dilemma',
          scored: true,
          title: 't',
          body: 'b',
          choices: [
            {
              id: 'a',
              label: 'a',
              outcome: 'a',
              key: { grade: 'best', points: { integrity: 1 }, rationale: 'r', refs: ['nope'] },
            },
            { id: 'b', label: 'b', outcome: 'b' },
          ],
        },
      ],
    });
    const problems = validateMissions([broken]).join('\n');
    expect(problems).toMatch(/unknown reference nope/);
    expect(problems).toMatch(/choice b: scored choice has no key/);
  });

  it('refuses a Directive citation without its LCSP transposition', () => {
    const unpaired = defineMission('m.unpaired', {
      title: 'Unpaired',
      briefing: 'Unpaired',
      estMinutes: 5,
      steps: [
        {
          id: 's',
          kind: 'dilemma',
          scored: true,
          title: 't',
          body: 'b',
          choices: [
            {
              id: 'a',
              label: 'a',
              outcome: 'a',
              key: { grade: 'best', points: { integrity: 1 }, rationale: 'r', refs: ['dir2014_24.art24'] },
            },
            {
              id: 'b',
              label: 'b',
              outcome: 'b',
              key: { grade: 'weak', points: {}, rationale: 'r', refs: ['dir2014_24.art24', 'lcsp.64'] },
            },
          ],
        },
      ],
    });
    const problems = validateMissions([unpaired]);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/choice a: cites dir2014_24.art24 without its LCSP transposition/);
  });

  it('cites paragraphs the way the Official Journal does', () => {
    expect(articleLabel(articles['dir2014_24.art57_4_d']!)).toBe('Dir. 2014/24/EU, art. 57(4)(d)');
    expect(articleLabel(articles['lcsp.64']!)).toBe('LCSP, art. 64');
  });

  it('links every article to the right official text', () => {
    for (const a of articleList) {
      const url = articleUrl(a);
      if (a.source === 'lcsp') {
        expect(url).toMatch(/^https:\/\/www\.boe\.es\/buscar\/act\.php\?id=BOE-A-2017-12902#a\d+(-\d+)?$/);
      } else {
        expect(url).toMatch(/^https:\/\/eur-lex\.europa\.eu\/eli\/dir\/2014\/24\/oj\/eng#art_\d+$/);
      }
    }
  });

  it('tells the knowledge page which steps cite an article, never which answer is right', () => {
    const cites = citationsByArticle();
    expect(cites['lcsp.150']?.map((c) => c.stepId)).toEqual(['m.hello.address']);
    expect(cites['lcsp.64']?.map((c) => c.stepId)).toEqual(['m.hello.committee']);
    expect(JSON.stringify(cites)).not.toMatch(/grade|best|critical|rationale/);
  });
});
