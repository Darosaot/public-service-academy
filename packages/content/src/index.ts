import type { AuthoredMission } from './authoring';
import { p2 } from './missions/p2';

export { defineMission, type AuthoredMission } from './authoring';
export { competencies, type Competency } from './competencies';
export * from './law';
export { validateLaw, validateMissions } from './validate';

export const missions: readonly AuthoredMission[] = [p2];

export interface Citation {
  missionId: string;
  missionTitle: string;
  stepId: string;
  stepTitle: string;
}

/**
 * Where the game uses each article: article id -> the steps whose keys cite it.
 *
 * Deliberately step-level, never choice-level: the knowledge page may say "this decision turns
 * on Article 64" without revealing which answer is graded best.
 */
export function citationsByArticle(list: readonly AuthoredMission[] = missions) {
  const out: Record<string, Citation[]> = {};
  for (const { mission, keys } of list) {
    for (const step of mission.steps) {
      const refs = new Set(Object.values(keys[step.id] ?? {}).flatMap((k) => k.refs));
      for (const ref of refs) {
        (out[ref] ??= []).push({
          missionId: mission.id,
          missionTitle: mission.title,
          stepId: step.id,
          stepTitle: step.title,
        });
      }
    }
  }
  return out;
}
