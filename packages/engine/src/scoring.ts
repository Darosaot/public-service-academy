/**
 * Scoring an attempt.
 *
 * Pure and computed only from decisions: the story can be unlucky, the score never is. Each
 * competency is scored as a share of the best points available on the spine, so a mission that
 * touches integrity three times and finance once reports both on the same 0-100 scale.
 */

import type {
  CompetencyId,
  CompetencyScore,
  Decision,
  MissionKeys,
  MissionResult,
  PublicMission,
  RedFlag,
} from './types';

export const THREE_STARS_PCT = 80;
export const TWO_STARS_PCT = 60;

export function scoreAttempt(
  mission: PublicMission,
  keys: MissionKeys,
  decisions: readonly Decision[],
): MissionResult {
  const earned: Partial<Record<CompetencyId, number>> = {};
  const max: Partial<Record<CompetencyId, number>> = {};
  const redFlags: RedFlag[] = [];
  const chosen = new Map(decisions.map((d) => [d.stepId, d.choiceId]));

  for (const step of mission.steps) {
    if (!step.scored) continue;
    const stepKeys = keys[step.id];
    if (!stepKeys) throw new Error(`No keys for scored step ${step.id}`);

    // The maximum for each competency is the best any single choice on this step offers.
    const best: Partial<Record<CompetencyId, number>> = {};
    for (const key of Object.values(stepKeys)) {
      for (const [c, p] of Object.entries(key.points)) {
        const id = c as CompetencyId;
        best[id] = Math.max(best[id] ?? 0, p ?? 0);
      }
    }
    for (const [c, p] of Object.entries(best)) {
      const id = c as CompetencyId;
      max[id] = (max[id] ?? 0) + (p ?? 0);
    }

    const choiceId = chosen.get(step.id);
    const key = choiceId ? stepKeys[choiceId] : undefined;
    if (!key || !choiceId) continue; // an unanswered step earns nothing
    for (const [c, p] of Object.entries(key.points)) {
      const id = c as CompetencyId;
      earned[id] = (earned[id] ?? 0) + (p ?? 0);
    }
    if (key.grade === 'critical') redFlags.push({ stepId: step.id, choiceId });
  }

  const competencies: Partial<Record<CompetencyId, CompetencyScore>> = {};
  let earnedTotal = 0;
  let maxTotal = 0;
  for (const [c, m] of Object.entries(max)) {
    const id = c as CompetencyId;
    if (!m) continue;
    const e = Math.max(0, earned[id] ?? 0);
    competencies[id] = { earned: e, max: m, pct: Math.round((e / m) * 100) };
    earnedTotal += e;
    maxTotal += m;
  }

  const total = maxTotal === 0 ? 0 : Math.round((earnedTotal / maxTotal) * 100);
  const stars: 1 | 2 | 3 =
    redFlags.length > 0 ? 1 : total >= THREE_STARS_PCT ? 3 : total >= TWO_STARS_PCT ? 2 : 1;

  return { missionId: mission.id, competencies, total, stars, redFlags };
}
