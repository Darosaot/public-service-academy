/**
 * Structural checks over the whole corpus, in the spirit of publicadmin's `validate.ts`: a bad
 * key or a dangling reference fails the build instead of reaching a consultant's debrief.
 */

import { COMPETENCY_IDS } from '@academy/engine';
import type { AuthoredMission } from './authoring';
import { references } from './references';

export function validateMissions(missions: readonly AuthoredMission[]): string[] {
  const problems: string[] = [];
  const missionIds = new Set<string>();

  for (const { mission, keys } of missions) {
    const where = `mission ${mission.id}`;
    if (missionIds.has(mission.id)) problems.push(`${where}: duplicate id`);
    missionIds.add(mission.id);
    if (mission.steps.length === 0) problems.push(`${where}: no steps`);

    const stepIds = new Set<string>();
    for (const step of mission.steps) {
      const at = `${where} step ${step.id}`;
      if (stepIds.has(step.id)) problems.push(`${at}: duplicate step id`);
      stepIds.add(step.id);
      if (step.choices.length < 2 || step.choices.length > 4) {
        problems.push(`${at}: needs 2 to 4 choices, has ${step.choices.length}`);
      }
      if (new Set(step.choices.map((c) => c.id)).size !== step.choices.length) {
        problems.push(`${at}: duplicate choice id`);
      }
      if (!step.scored) {
        if (keys[step.id]) problems.push(`${at}: unscored step carries keys`);
        continue;
      }

      const stepKeys = keys[step.id] ?? {};
      for (const choice of step.choices) {
        const key = stepKeys[choice.id];
        const c = `${at} choice ${choice.id}`;
        if (!key) {
          problems.push(`${c}: scored choice has no key`);
          continue;
        }
        if (!key.rationale.trim()) problems.push(`${c}: empty rationale`);
        if (key.refs.length === 0) problems.push(`${c}: no reference`);
        for (const ref of key.refs) {
          if (!references[ref]) problems.push(`${c}: unknown reference ${ref}`);
        }
        const touched = Object.keys(key.points);
        if (touched.length > 2) problems.push(`${c}: more than two competencies`);
        for (const comp of touched) {
          if (!(COMPETENCY_IDS as readonly string[]).includes(comp)) {
            problems.push(`${c}: unknown competency ${comp}`);
          }
        }
        if (key.grade === 'critical' && Object.values(key.points).some((p) => (p ?? 0) > 0)) {
          problems.push(`${c}: a critical choice cannot earn points`);
        }
      }
      if (!Object.values(stepKeys).some((k) => k.grade === 'best')) {
        problems.push(`${at}: no choice graded best`);
      }
    }
  }
  return problems;
}
