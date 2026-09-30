import { describe, expect, it } from 'vitest';
import {
  decide,
  isFinished,
  replay,
  scoreAttempt,
  startMission,
  type MissionKeys,
  type PublicMission,
} from '../src';

const mission: PublicMission = {
  id: 'm.test',
  title: 'Test',
  briefing: 'Test',
  estMinutes: 5,
  steps: [
    {
      id: 's1',
      kind: 'dilemma',
      scored: true,
      title: 'One',
      body: 'One',
      choices: [
        { id: 'a', label: 'A', outcome: 'A', meters: { integrity: 5 } },
        { id: 'b', label: 'B', outcome: 'B' },
        { id: 'c', label: 'C', outcome: 'C' },
      ],
    },
    {
      id: 's2',
      kind: 'dilemma',
      scored: true,
      title: 'Two',
      body: 'Two',
      choices: [
        { id: 'x', label: 'X', outcome: 'X' },
        { id: 'y', label: 'Y', outcome: 'Y' },
      ],
    },
    {
      id: 's3',
      kind: 'dilemma',
      scored: false,
      title: 'Story',
      body: 'Story',
      choices: [
        { id: 'p', label: 'P', outcome: 'P' },
        { id: 'q', label: 'Q', outcome: 'Q' },
      ],
    },
  ],
};

const keys: MissionKeys = {
  s1: {
    a: { grade: 'best', points: { integrity: 3, procurement: 2 }, rationale: 'r', refs: [] },
    b: { grade: 'acceptable', points: { integrity: 1 }, rationale: 'r', refs: [] },
    c: { grade: 'critical', points: {}, rationale: 'r', refs: [] },
  },
  s2: {
    x: { grade: 'best', points: { risk: 2 }, rationale: 'r', refs: [] },
    y: { grade: 'weak', points: {}, rationale: 'r', refs: [] },
  },
};

const path = (s1: string, s2: string) => [
  { stepId: 's1', choiceId: s1 },
  { stepId: 's2', choiceId: s2 },
  { stepId: 's3', choiceId: 'p' },
];

describe('mission runner', () => {
  it('is deterministic from the seed', () => {
    expect(startMission(mission, 42)).toEqual(startMission(mission, 42));
    expect(replay(mission, 7, path('a', 'x'))).toEqual(replay(mission, 7, path('a', 'x')));
  });

  it('shuffles choice order per seed without losing any choice', () => {
    const orders = new Set<string>();
    for (let seed = 1; seed <= 30; seed++) {
      const order = startMission(mission, seed).choiceOrder.s1 ?? [];
      expect([...order].sort()).toEqual(['a', 'b', 'c']);
      orders.add(order.join());
    }
    expect(orders.size).toBeGreaterThan(1);
  });

  it('applies meters and finishes', () => {
    const state = replay(mission, 1, path('a', 'x'));
    expect(state.meters.integrity).toBe(75);
    expect(isFinished(mission, state)).toBe(true);
  });

  it('rejects illegal decisions, which is what server replay relies on', () => {
    const start = startMission(mission, 1);
    expect(() => decide(mission, start, { stepId: 's2', choiceId: 'x' })).toThrow();
    expect(() => decide(mission, start, { stepId: 's1', choiceId: 'zzz' })).toThrow();
    expect(() => replay(mission, 1, [...path('a', 'x'), { stepId: 's3', choiceId: 'p' }])).toThrow();
  });
});

describe('scoring guardrails', () => {
  it('gives the best path full marks and three stars', () => {
    const result = scoreAttempt(mission, keys, path('a', 'x'));
    expect(result.total).toBe(100);
    expect(result.stars).toBe(3);
    expect(result.competencies.integrity).toEqual({ earned: 3, max: 3, pct: 100 });
  });

  it('caps a critical choice at one star and reports a red flag', () => {
    const result = scoreAttempt(mission, keys, path('c', 'x'));
    expect(result.redFlags).toEqual([{ stepId: 's1', choiceId: 'c' }]);
    expect(result.stars).toBe(1);
  });

  it('ranks a careful player above a corner-cutter', () => {
    const careful = scoreAttempt(mission, keys, path('a', 'x'));
    const middling = scoreAttempt(mission, keys, path('b', 'x'));
    const cutter = scoreAttempt(mission, keys, path('c', 'y'));
    expect(careful.total).toBeGreaterThan(middling.total);
    expect(middling.total).toBeGreaterThan(cutter.total);
  });

  it('never depends on the seed or on unscored steps', () => {
    const decisions = path('b', 'x');
    const a = scoreAttempt(mission, keys, decisions);
    const b = scoreAttempt(mission, keys, [...decisions.slice(0, 2), { stepId: 's3', choiceId: 'q' }]);
    expect(a).toEqual(b);
  });
});
