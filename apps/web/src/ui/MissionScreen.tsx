/**
 * The mission player: briefing -> steps -> debrief.
 *
 * PHASE 0 ONLY: the keys are imported into the browser here so the debrief can be shown
 * without a backend. Phase 2 moves scoring and keys into Netlify Functions and adds a bundle
 * canary test that fails if any key text reaches this bundle (docs/plan.md, section 3.4).
 */

import { useMemo, useState } from 'react';
import {
  currentStep,
  decide,
  isFinished,
  scoreAttempt,
  startMission,
  type MissionState,
} from '@academy/engine';
import { competencies, missions } from '@academy/content';
import { LawRefs } from './LawRefs';

const authored = missions[0]!;
const { mission, keys } = authored;

function seedFromUrl(): number {
  const raw = new URLSearchParams(window.location.search).get('seed');
  const parsed = raw === null ? NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : Math.floor(Math.random() * 1_000_000);
}

export function MissionScreen({ onOpenStage }: { onOpenStage: (stageId: string) => void }) {
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<MissionState>(() => startMission(mission, seedFromUrl()));
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);

  const finished = isFinished(mission, state);
  const step = currentStep(mission, state);
  const result = useMemo(
    () => (finished ? scoreAttempt(mission, keys, state.decisions) : null),
    [finished, state.decisions],
  );

  if (!started) {
    return (
      <main className="page">
        <p className="eyebrow">Public Service Academy · practice</p>
        <h1>{mission.title}</h1>
        <p className="prose">{mission.briefing}</p>
        <p className="muted">About {mission.estMinutes} minutes.</p>
        <button className="btn btn--primary" onClick={() => setStarted(true)}>
          Start the mission
        </button>
      </main>
    );
  }

  if (lastOutcome !== null) {
    return (
      <main className="page">
        <p className="eyebrow">What happened</p>
        <p className="prose">{lastOutcome}</p>
        <button className="btn btn--primary" onClick={() => setLastOutcome(null)}>
          Continue
        </button>
      </main>
    );
  }

  if (!finished && step) {
    const order = state.choiceOrder[step.id] ?? step.choices.map((c) => c.id);
    return (
      <main className="page">
        <p className="eyebrow">
          Step {state.stepIndex + 1} of {mission.steps.length}
        </p>
        <h1>{step.title}</h1>
        <p className="prose">{step.body}</p>
        <div className="choices">
          {order.map((id) => {
            const choice = step.choices.find((c) => c.id === id)!;
            return (
              <button
                key={id}
                className="choice"
                onClick={() => {
                  setState(decide(mission, state, { stepId: step.id, choiceId: id }));
                  setLastOutcome(choice.outcome);
                }}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Debrief</p>
      <h1>
        {'★'.repeat(result!.stars)}
        {'☆'.repeat(3 - result!.stars)} <span className="score">{result!.total}%</span>
      </h1>
      {result!.redFlags.length > 0 && (
        <p className="redflag">
          Red flag: at least one decision would be treated as a serious breach, whatever else went
          well.
        </p>
      )}

      <h2>Competencies</h2>
      <ul className="bars">
        {Object.entries(result!.competencies).map(([id, s]) => (
          <li key={id}>
            <span>{competencies[id as keyof typeof competencies].name}</span>
            <span className="bar" aria-hidden="true">
              <span style={{ width: `${s!.pct}%` }} />
            </span>
            <span>{s!.pct}%</span>
          </li>
        ))}
      </ul>

      <h2>Your decisions</h2>
      {state.decisions.map((d) => {
        const s = mission.steps.find((x) => x.id === d.stepId)!;
        const key = keys[d.stepId]?.[d.choiceId];
        const best = s.choices.find((c) => keys[s.id]?.[c.id]?.grade === 'best');
        return (
          <section key={d.stepId} className="card">
            <h3>{s.title}</h3>
            <p>
              You chose: <strong>{s.choices.find((c) => c.id === d.choiceId)?.label}</strong>
              {key && <span className={`grade grade--${key.grade}`}>{key.grade}</span>}
            </p>
            {key && key.grade !== 'best' && best && (
              <p className="muted">Preferred: {best.label}</p>
            )}
            {key && <p className="prose">{key.rationale}</p>}
            {key && <LawRefs refs={key.refs} onOpenStage={onOpenStage} />}
          </section>
        );
      })}

      <button
        className="btn"
        onClick={() => {
          setState(startMission(mission, seedFromUrl()));
          setStarted(false);
        }}
      >
        Play again
      </button>
    </main>
  );
}
