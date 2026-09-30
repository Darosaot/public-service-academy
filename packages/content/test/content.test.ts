import { describe, expect, it } from 'vitest';
import { replay, scoreAttempt } from '@academy/engine';
import { defineMission, missions, validateMissions } from '../src';

describe('content', () => {
  it('passes validation', () => {
    expect(validateMissions(missions)).toEqual([]);
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
});
