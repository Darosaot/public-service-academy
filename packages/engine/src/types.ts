/**
 * Core contracts for the mission engine.
 *
 * Pure TypeScript with no React, no DOM and no Math.random, so the same code runs in the
 * browser (to play) and in a server function (to replay and score). Two halves are kept
 * apart on purpose:
 *
 * - the **public** mission: what the player may see (prose, choices), and
 * - the **keys**: how an expert grades each choice (points, rationale, references).
 *
 * The keys never need to reach the browser in assessment mode, so nothing in the public half
 * refers to them except by id.
 */

/** The six competencies of the MVP framework. Ids are stable: results are stored against them. */
export type CompetencyId =
  | 'procurement'
  | 'finance'
  | 'integrity'
  | 'risk'
  | 'transparency'
  | 'judgement';

export const COMPETENCY_IDS: readonly CompetencyId[] = [
  'procurement',
  'finance',
  'integrity',
  'risk',
  'transparency',
  'judgement',
];

/** In-story meters. Flavour only: they are never read by scoring. */
export type MeterId = 'reputation' | 'integrity' | 'stress' | 'politicalCapital';

export type Grade = 'best' | 'acceptable' | 'weak' | 'critical';

/* ------------------------------------------------------------------ public */

export interface PublicChoice {
  id: string;
  label: string;
  /** What happens in the story. Never implies the grade. */
  outcome: string;
  meters?: Partial<Record<MeterId, number>>;
}

export interface DilemmaStep {
  id: string;
  kind: 'dilemma';
  /** Scored steps form the spine every attempt passes through. */
  scored: boolean;
  title: string;
  body: string;
  choices: PublicChoice[];
}

export type Step = DilemmaStep;

export interface PublicMission {
  id: string;
  title: string;
  /** The briefing: who you are, where, and what is on your desk. */
  briefing: string;
  estMinutes: number;
  steps: Step[];
}

/* -------------------------------------------------------------------- keys */

export interface ChoiceKey {
  grade: Grade;
  /** Points on one or two competencies. */
  points: Partial<Record<CompetencyId, number>>;
  rationale: string;
  /** Ids in the reference registry. */
  refs: string[];
}

/** stepId -> choiceId -> key. */
export type MissionKeys = Record<string, Record<string, ChoiceKey>>;

/* ------------------------------------------------------------------- state */

export interface Decision {
  stepId: string;
  choiceId: string;
}

export interface MissionState {
  missionId: string;
  seed: number;
  /** Index of the step awaiting a decision; equals steps.length when finished. */
  stepIndex: number;
  /** Per step, the order the choices are shown in. Seeded, so replays match. */
  choiceOrder: Record<string, string[]>;
  meters: Record<MeterId, number>;
  decisions: Decision[];
}

/* ------------------------------------------------------------------ result */

export interface CompetencyScore {
  earned: number;
  max: number;
  /** 0-100, rounded. */
  pct: number;
}

export interface RedFlag {
  stepId: string;
  choiceId: string;
}

export interface MissionResult {
  missionId: string;
  competencies: Partial<Record<CompetencyId, CompetencyScore>>;
  /** 0-100 across all competencies touched by the spine. */
  total: number;
  stars: 1 | 2 | 3;
  redFlags: RedFlag[];
}
