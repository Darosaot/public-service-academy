# Plan: "Public Service Academy", a training and assessment game built from Public Service Story

## Context

The user (Manager at an IT consulting firm in Brussels) wants to test and train consultants on
public administration functions. The existing repo `darosaot/publicadmin` is an entertainment
career simulator with an unusually solid engine and realistic dilemmas, but it has no right
answers, no scoring, no identity and no backend. The goal is a **separate product** (new private
repo, own Netlify deployment, own database) that reuses the engine, authoring model and content
as seed material, and turns them into short, scored, gamified missions with expert feedback and a
manager dashboard. **`darosaot/publicadmin` is not modified** and stays live.

## Decisions taken

| Question | Decision |
| --- | --- |
| Purpose | Practice + assessment: practice with instant feedback; assessment campaigns with results for managers |
| Player role | Public official, deciding from inside the administration (as in the current game) |
| Legal frame | Fictional Valmara as an EU member state; every graded decision cites the EU Directive article **and its Spanish transposition in Ley 9/2017 (LCSP)**, deep-linked to EUR-Lex and the BOE; where they differ, the stricter national rule decides the grade. Principles where both are silent |
| MVP functions | Procurement and contracts; budget, finance and EU funds |

---

## 1. Analysis of the current game

"Public Service Story" is a single-player browser game (React 18, TypeScript, Vite; static on
Netlify; `localStorage` save; no backend). A 120-turn, 30-year career in Valmara: each turn you
split effort points over an oversubscribed task board, then face 1 to 3 dilemmas whose
consequences can return years later.

| Area | Size | Notes |
| --- | --- | --- |
| `src/engine` | 26 files, 6.9k lines | Pure TS, no React; seeded RNG cursor in state; deterministic |
| `src/content` | 47 files, 16.5k lines | 285 events, 86 task templates, 27 initiatives, 14 bodies, 15 posts, 7 departments |
| `src/i18n` | 45 files, 5.9k lines | Full EN + ES, parity enforced by test |
| `src/ui`, `src/state` | 31 files, 4k lines | Phase-driven screens; reducer bridges UI to engine |
| `tests` | 33 files, 8.5k lines | 524 unit tests pass, typecheck clean, Playwright e2e, balance bot |

**Worth carrying over**
- **Authoring model**: `defineEvent` / `defineTask` (`src/content/authoring.ts`) keep structure
  and prose together and derive i18n keys; a Condition/Effect DSL (`src/engine/effects.ts`) with
  conditional outcomes and scheduled follow-ups (`src/engine/events.ts`).
- **Determinism**: `src/engine/rng.ts` (mulberry32, cursor in state). Same seed plus same
  decisions gives the same run, which is what makes **server-side replay and fair scoring** cheap.
- **Guardrail culture**: `src/content/validate.ts` fails the build on broken content; the
  autoplay bot (`tests/engine/autoplay.ts`) measures the game with personas.
- **Realistic dilemmas that already read like case studies**: collusion signals
  (`evt.procurement.shared_address`), tailored specs, conflicts of interest, emergency direct
  awards, milestone misreporting, ineligible costs, use-it-or-lose-it underspend.
- **UI and identity**: `Modal`, `EventModal`, `Meter`, `Portrait`, `TaskCard`, `EffortStepper`,
  `ValmaraMap`, `LanguageSwitcher`, tokens in `src/styles/tokens.css`; the recurring cast.

**What blocks training and assessment use**
1. **No right answers by design.** Choices trade off stats; no answer key, rationale or legal
   reference. The design doc states nothing maps to real law.
2. **Luck decides outcomes.** Weighted outcomes make the same decision land differently.
3. **Length.** Hours per run; training needs 15 to 30 minute missions.
4. **No identity or backend.** One editable local save, `?seed=` in the URL, nothing a manager
   can see, nothing tamper-proof.
5. **Mechanics that are game, not competence**: rival, climate, perks, savings, decay curves.
6. **Everything ships in the client bundle**, so answer keys (and cases) would be readable.

---

## 2. Product design

### 2.1 Modes and roles
- **Practice**: replayable missions, per-decision feedback, XP and badges.
- **Assessment**: a manager creates a campaign (missions, window, invitees); everyone gets the
  same variant, one attempt, optional time limit; feedback released when the campaign closes.
  Assessment missions are not playable in practice while a campaign using them is open.
- Principle: **the story can be unlucky, the score never is.** Narrative dice stay for realism;
  the score is computed only from decisions, deterministically.
- Roles: participant, manager (cohorts, campaigns, results), author/SME (preview with keys), admin.

### 2.2 Mission structure and step types
Briefing (role, objective, documents) -> **scored spine** of 4 to 8 steps that every attempt
passes through -> unscored consequence scenes triggered by flags (the follow-up mechanic) ->
epilogue with the cast -> debrief. A fixed spine keeps scores comparable across candidates;
branches add story, not measurement. Choice order is shuffled per attempt (seeded).

| Step type | Interaction | Reuses | Scoring |
| --- | --- | --- | --- |
| Dilemma | 2 to 4 choices | `EventModal`, event DSL | keyed grade + competency points per choice |
| Triage | split a week's hours over files with deadlines; move date / cut back / say no | `TaskCard`, `EffortStepper`, `src/engine/negotiate.ts` | statutory deadlines kept, must-dos done, negotiation used well |
| Document review | flag problem clauses in a spec, evaluation report, timesheet or payment claim | new `DocumentReview` | precision and recall against keyed flags |
| Ordering | put procedure steps in order | new, small | distance from keyed order |

### 2.3 Scoring and competencies (MVP set of six)
1. Procurement rules
2. Financial rules and EU funds
3. Integrity and conflicts of interest
4. Risk and control awareness (red flags, audit trail)
5. Transparency and accountability
6. Judgement under pressure (stakeholders, prioritisation, deadlines)

- Every scored choice carries a **key**: grade (`best` / `acceptable` / `weak` / `critical`),
  points on 1 or 2 competencies, a rationale, and reference ids.
- `scoreAttempt(keys, decisions)` is pure: per-competency % of the spine maximum, total, stars
  (3: 80%+, 2: 60%+, else 1).
- **Critical choices** (bribe accepted, collusion ignored, false certification) and missed
  critical flags in document reviews are reported as **red flags** and cap the mission at one
  star, whatever the average.
- In-story meters (reputation, integrity, stress, political capital) stay for flavour and never
  feed the score.
- A competency is reported in assessment mode only once the catalogue has at least 8 scored
  items for it; below that it shows as "indicative" (enforced by a validator rule).

### 2.4 Gamification (practice only; assessment shows completion only)
- XP and ranks reusing the career titles (Administrative Officer to Director-General); rank
  unlocks practitioner and expert missions.
- Badges as content with predicates over results (e.g. "Clean hands": five missions, no red flags).
- Valmara map as mission select (institutions from `src/content/bodies.ts`, locked missions fogged).
- Recurring cast: Sofia Lindqvist, the auditor, writes "the auditor's note" in each debrief.
- Printable certificate per completed track; team-level opt-in leaderboard only.
- Visual: keep the Valmara identity and tokens, calmer "Academy" theme with a readable body font.

### 2.5 MVP catalogue (tutorial + 6 missions; refs confirmed in SME review)
| Mission | Function | Seed content from publicadmin | Example refs |
| --- | --- | --- | --- |
| T. First week at Northbridge (unscored) | tutorial | common events | none |
| P1. A very specific requirement | procurement | `evt.procurement.tailored_spec`, `incumbent`, `local_firm`, `task.procurement.specification`, `clarifications` | Dir. 2014/24/EU arts 18, 42, 58 |
| P2. Six bids, four evaluators | procurement | `committee_pressure`, `shared_address`, `late_bid`, `lunch`, `task.procurement.evaluation`, `award_publication`, `challenge_response` | arts 24, 57(4)(d), 67, 69; standstill (Dir. 2007/66/EC) |
| P3. The heating has failed | procurement | `genuine_emergency`, `task.procurement.direct_award`, `framework_renewal`, `supplier_review` | art. 32, art. 72 |
| F1. Closing the year | finance | `evt.finance.year_end_hole`, `no_purchase_order`, `optimistic_forecast`, `jump_the_queue`, `task.finance.monthly_close`, `invoice_backlog` | Late Payment Dir. 2011/7/EU; annuality, commitment before expenditure |
| F2. Substantially complete | EU funds | `evt.projects.milestone_fiction`, `partner_costs`, `underspend`, `related_subcontractor`, `task.projects.eligibility_check`, `payment_claim` | CPR (Reg. 2021/1060) |
| F3. The auditors are here (capstone) | procurement x EU funds | `evt.projects.auditors_on_site`, `task.finance.audit_response`, `evt.followup.audit_letter` | financial-corrections guidelines C(2019) 3452 |

Post-MVP functions (legal, transparency and data; digital projects) reuse the same model.

---

## 3. Architecture

### 3.1 New repo `darosaot/public-service-academy` (private, npm workspaces)
```
packages/engine/     pure TS: rng, conditions/effects, mission runner, scoring, replay
packages/content/    missions, steps, documents, competencies, references, badges;
                     validate.ts; build step emitting public.json + keys.json
apps/web/            React + Vite + React Router: map, player, debrief, manager dashboard,
                     author preview (role-gated)
netlify/functions/   start-attempt, step-feedback, submit-attempt (only code that loads content)
supabase/migrations/ schema, RLS policies, analytics views, RLS tests
analytics/           R or Python notebook for item analysis
tests/e2e/           Playwright against the production build
docs/                design doc, content guide, competency framework, generated answer-key book
```

### 3.2 Reuse map (copied from `darosaot/publicadmin@b524760` with a provenance note)
| Source | Destination | How |
| --- | --- | --- |
| `src/engine/rng.ts` | `packages/engine/src/rng.ts` | as is |
| `src/engine/effects.ts` (`flagValue`, `checkCondition`, `conditionMet`, `applyEffects`) | `packages/engine/src/conditions.ts`, `effects.ts` | trimmed to a mission Condition/Effect subset |
| `src/engine/events.ts` (`rollOutcome`, `applyChoice`, follow-up queue) | `packages/engine/src/steps.ts` | adapted to steps inside one mission |
| `src/engine/save.ts` | `packages/engine/src/save.ts` | versioned local cache for resume |
| `src/content/authoring.ts` | `packages/content/src/authoring.ts` | extended: `defineMission`, `defineStep`, `defineDocument`, `defineCompetency`, `defineReference`, `defineBadge`, key split |
| `src/content/validate.ts` | `packages/content/src/validate.ts` | pattern kept, assessment rules added |
| `src/content/cast.ts`, `bodies.ts` | `packages/content/src/world/` | setting, characters, map coordinates |
| `src/content/events/{procurement,finance,projects}.ts` and `src/i18n/es/content/events/*` | mission steps | seed prose (ES comes along for later) |
| `src/i18n/translate.ts`, `src/i18n/index.tsx` | `apps/web/src/i18n/` | as is; EN for MVP, FR/ES later |
| `src/ui/components/*` listed in section 1 | `apps/web/src/ui/` | `ValmaraMap` refactored to take markers instead of `GameState` |
| `src/state/gameReducer.ts`, `GameProvider.tsx` | `apps/web/src/state/` | pattern for the mission player |
| `tests/engine/autoplay.ts` | `packages/engine/test/personas.ts` | persona bots for scoring guardrails |
| `scripts/generate-script.ts` | `packages/content/scripts/answer-key-book.ts` | SME review book: every step, key, rationale, ref |
| `.github/workflows/ci.yml`, `playwright.config.ts`, `netlify.toml`, `vite.config.ts` | root | baseline, extended for workspaces and functions |

Not ported: job offers, staff and budget simulation, rival, climate, perks, initiatives,
directives, money, record screen.

### 3.3 Content model (authoring stays in one file, split at build time)
```ts
defineStep('m.p2.conflict', {
  kind: 'dilemma', scored: true,
  title: 'A member of the committee has a view',
  body: 'In the evaluation meeting, one member is arguing hard for a bid that scored third...',
  choices: [
    { id: 'declare', label: 'Ask everyone to restate their conflicts of interest',
      text: 'He declares the connection and recuses himself...',
      effects: [{ kind: 'meter', meter: 'politicalCapital', delta: -4 }],
      key: { grade: 'best', points: { integrity: 3, procurement: 2 },
             rationale: 'A conflict must be declared and managed before scoring continues...',
             refs: ['dir2014_24.art24'] } },
    // ...
  ],
});
```
The content build emits `public.json` (prose, choices, documents) and `keys.json` (keys,
rationale, refs). Both are bundled **only into the functions**; the web bundle holds the engine,
UI and tutorial. Validator rules added: every scored choice keyed with rationale and at least one
resolvable ref; at least one `best` per scored step; scored steps unconditional (the spine);
competency item counts; document keys point at real segments; estimated minutes within 15 to 30.

### 3.4 Backend, trusted scoring, content protection
- **Supabase** (EU region) for auth, Postgres and RLS; **Netlify Functions** for everything that
  needs the content or keys (same repo and toolchain as the web app, deploy previews included).
- **Auth**: magic-link invitations (anyone) plus optional Microsoft Entra ID for staff; email-domain
  allowlist for self sign-up.
- **Tables**: `profiles`, `cohorts`, `cohort_members`, `campaigns` (missions, window, feedback
  policy, fixed seed, time limit), `attempts` (seed, content hash, status), `decisions`
  (append-only, per step, with time taken), `results` (competency scores, red flags, stars,
  engine version, verified), `xp_events`, `badge_awards`, `invitations`.
- **RLS**: participants write only their own in-progress attempts' decisions and read their own
  results (assessment: after close); `results`, XP and badges are written only by functions
  (service role); managers read their own cohorts; admins read all.
- **Flow**: `start-attempt` checks eligibility, fixes the seed, returns the mission's public
  content -> client appends decisions -> `step-feedback` returns the key for the last decision if
  the policy allows -> `submit-attempt` replays seed and decisions with the shared engine (illegal
  moves rejected), scores with `keys.json`, writes `results`, awards XP and badges.
- **Frozen content**: missions used by an open campaign are listed in `frozen-missions.json` and
  CI blocks edits to them; results store the content hash.
- **Analytics views**: competency matrix, item statistics (difficulty, discrimination,
  distractors), campaign progress; read-only DB role for the notebook.
- Repo access stays with authors and admins; consultants never get it (keys live in source).

### 3.5 Environments
Netlify site (production from `main`, deploy preview per PR); two Supabase projects (staging for
previews, production), both EU region; secrets as Netlify env vars, service role key only
visible to functions.

---

## 4. Delivery phases

Indicative durations assume the Claude-assisted pace publicadmin was built at. **The critical
path is SME time for keying and review (roughly 1 to 2 days per mission for two reviewers),
not code.**

| Phase | Scope | Exit criteria | Indicative |
| --- | --- | --- | --- |
| 0. Setup | create the private repo and attach it to a session; monorepo scaffold; engine import; CI; Netlify site; two Supabase projects; this plan committed as `docs/plan.md` | CI green; hello-mission on a preview URL | 1 to 2 days |
| 1. Engine + scoring, local | mission runner, 4 step types, `scoreAttempt`, replay, authoring API, validator rules, build split, answer-key book, player + debrief + author preview UI; tutorial, **P2** and **F2** (proves the model on both functions) | both missions playable locally; key book reviewed by the user; guardrail tests green | 1 to 2 weeks |
| 2. Accounts + trusted scoring | schema, RLS, auth, the three functions, server-side resume, practice vs assessment policies | verified results in staging; forged decisions and results rejected by tests | 1 week |
| 3. Dashboard + pilot | cohorts, campaigns, invitations, progress, competency heatmap, attempt replay, CSV export, analytics notebook; pilot with 5 to 10 consultants on P2 and F2 | pilot report (item stats, feedback); items fixed or retired | 1 to 2 weeks build, 2 to 3 weeks pilot |
| 4. Catalogue + gamification | P1, P3, F1, F3 keyed and reviewed; XP, ranks, badges, map, cast, certificates; pass marks set with SMEs (modified Angoff) | MVP catalogue live; first real assessment campaign | 2 to 3 weeks |
| 5. Optional | FR and ES; legal/transparency and digital-projects missions; free-text answers with LLM-assisted, human-confirmed grading; authoring assistant; xAPI/SCORM export; parametric variants | per feature | later |

---

## 5. Validity, governance, data protection
- Each key reviewed independently by 2 or more SMEs; disagreement means rewrite or practice-only.
- No mission is used for assessment before pilot item analysis; pass marks by modified Angoff.
- GDPR: transparency notice (what is measured, who sees it, retention), EU data residency,
  configurable retention for raw decisions, own-data export; a DPIA is likely needed if results
  inform staffing or performance decisions.
- EU AI Act: scoring stays deterministic and rule-based; any LLM feature is coaching or a draft a
  human confirms (evaluating workers with AI is a high-risk use).
- Present it as a development tool first; align with HR and employee representatives before
  evaluative use.
- Accessibility: WCAG 2.1 AA, keyboard play, readable fonts.

## 6. Verification
- `npm run typecheck`; `npm test` (engine, content validation, scoring guardrails);
  `npm run test:e2e` (production build: tutorial to debrief; P2 in practice mode).
- **Scoring guardrails as tests** (the autoplay idea, repurposed): an integrity-first persona
  beats a corner-cutter on integrity; a random clicker lands below 2 stars; every spine is fully
  scorable; same seed and decisions always give the same result; shuffled choice order never
  changes a score.
- `supabase test db` for RLS: a participant cannot read others' data or write results; a manager
  sees only their cohorts.
- Function tests: replay rejects illegal or out-of-order decisions; tampered payloads rejected;
  feedback withheld in assessment mode until close.
- Bundle canary: CI fails if any key string or assessment-mission prose appears in the web bundle.
- Manual end-to-end on a staging preview: play P2 in practice (per-step feedback), create an
  assessment campaign as manager, play it as a participant (no feedback), close it, see the
  heatmap and replay, export CSV.

## 7. Confirmed for execution
- **Repo**: `darosaot/public-service-academy`, **private** (confirmed by the user). Creating it
  through the GitHub integration failed (403: the integration may not create repositories), so
  **the user creates the empty private repo on GitHub** (and installs the Claude GitHub App on it
  if prompted, via https://claude.ai/connect-github). Then either attach it here with `add_repo`
  or start a new Claude Code session on it, and run Phase 0 there.
- **Sign-in for the pilot**: magic links only (confirmed). Microsoft Entra ID can be added later.
- Still to confirm when we reach them: the Netlify site and the two Supabase projects (each an
  outward-facing step), a second SME for keying, and the pilot group.
