/**
 * The authoring layer.
 *
 * A mission is written in one place, with each choice's expert key sitting next to its prose,
 * because that is how a subject-matter expert reviews it. `defineMission` then splits it into
 * the two halves the engine keeps apart: the public mission (safe for the browser) and the
 * keys (for the scoring function). Same idea as publicadmin's `authoring.ts`, which splits
 * structure from prose at import time.
 */

import type {
  ChoiceKey,
  DilemmaStep,
  MeterId,
  MissionKeys,
  PublicMission,
} from '@academy/engine';

export interface ChoiceSpec {
  id: string;
  label: string;
  outcome: string;
  meters?: Partial<Record<MeterId, number>>;
  /** Required on scored steps. */
  key?: ChoiceKey;
}

export interface StepSpec {
  id: string;
  kind: 'dilemma';
  scored: boolean;
  title: string;
  body: string;
  choices: ChoiceSpec[];
}

export interface MissionSpec {
  title: string;
  briefing: string;
  estMinutes: number;
  steps: StepSpec[];
}

export interface AuthoredMission {
  mission: PublicMission;
  keys: MissionKeys;
}

export function defineMission(id: string, spec: MissionSpec): AuthoredMission {
  const keys: MissionKeys = {};

  const steps: DilemmaStep[] = spec.steps.map((step) => {
    const stepKeys: Record<string, ChoiceKey> = {};
    const choices = step.choices.map(({ key, ...pub }) => {
      if (key) stepKeys[pub.id] = key;
      return pub;
    });
    if (Object.keys(stepKeys).length > 0) keys[step.id] = stepKeys;
    return { ...step, choices };
  });

  return {
    mission: { id, title: spec.title, briefing: spec.briefing, estMinutes: spec.estMinutes, steps },
    keys,
  };
}
