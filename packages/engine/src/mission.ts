/**
 * Playing a mission: a state goes in with a decision, a new state comes out.
 *
 * Deterministic from the seed. The only randomness is the order the choices are shown in,
 * shuffled per attempt so that "pick the second option" cannot be passed around. Replaying the
 * same seed and decisions always reproduces the same state, which is what lets a server
 * function verify an attempt instead of trusting the browser.
 */

import { nextInt, seedToState } from './rng';
import type { Decision, MeterId, MissionState, PublicMission } from './types';

export const STARTING_METERS: Record<MeterId, number> = {
  reputation: 50,
  integrity: 70,
  stress: 20,
  politicalCapital: 30,
};

/** Seeded Fisher-Yates. Returns a new array and the advanced cursor. */
function shuffle<T>(items: readonly T[], rngState: number): { value: T[]; rngState: number } {
  const out = [...items];
  let state = rngState;
  for (let i = out.length - 1; i > 0; i--) {
    const roll = nextInt(state, 0, i);
    state = roll.rngState;
    const j = roll.value;
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return { value: out, rngState: state };
}

export function startMission(mission: PublicMission, seed: number): MissionState {
  let rngState = seedToState(seed);
  const choiceOrder: Record<string, string[]> = {};
  for (const step of mission.steps) {
    const shuffled = shuffle(
      step.choices.map((c) => c.id),
      rngState,
    );
    rngState = shuffled.rngState;
    choiceOrder[step.id] = shuffled.value;
  }

  return {
    missionId: mission.id,
    seed,
    stepIndex: 0,
    choiceOrder,
    meters: { ...STARTING_METERS },
    decisions: [],
  };
}

export function currentStep(mission: PublicMission, state: MissionState) {
  return mission.steps[state.stepIndex];
}

export function isFinished(mission: PublicMission, state: MissionState): boolean {
  return state.stepIndex >= mission.steps.length;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Applies one decision. Throws on a decision that is not legal at this point: the wrong step,
 * an unknown choice, or a finished mission. The server relies on this to reject tampering.
 */
export function decide(
  mission: PublicMission,
  state: MissionState,
  decision: Decision,
): MissionState {
  const step = currentStep(mission, state);
  if (!step) throw new Error(`Mission ${mission.id} is already finished`);
  if (step.id !== decision.stepId) {
    throw new Error(`Expected a decision on ${step.id}, got ${decision.stepId}`);
  }
  const choice = step.choices.find((c) => c.id === decision.choiceId);
  if (!choice) throw new Error(`Unknown choice ${decision.choiceId} on ${step.id}`);

  const meters = { ...state.meters };
  for (const [meter, delta] of Object.entries(choice.meters ?? {})) {
    meters[meter as MeterId] = clamp(meters[meter as MeterId] + (delta ?? 0));
  }

  return {
    ...state,
    stepIndex: state.stepIndex + 1,
    meters,
    decisions: [...state.decisions, { ...decision }],
  };
}

/** Rebuilds an attempt from its seed and decision log, rejecting any illegal move. */
export function replay(
  mission: PublicMission,
  seed: number,
  decisions: readonly Decision[],
): MissionState {
  return decisions.reduce((state, d) => decide(mission, state, d), startMission(mission, seed));
}
