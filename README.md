# Public Service Academy

Short, scored missions on public administration functions, for training and assessing
consultants. Built from the engine and content of
[Public Service Story](https://github.com/Darosaot/publicadmin) (imported from `b524760`), set in
the same fictional EU member state, Valmara.

You play a public official. Each mission is a briefing and a handful of decisions; the debrief
shows how an expert would grade each one, why, and which EU rule applies. **The story can be
unlucky, the score never is**: scoring reads only your decisions, deterministically.

**The law behind every grade.** Each graded choice cites the rule in
[Directive 2014/24/EU](https://eur-lex.europa.eu/eli/dir/2014/24/oj/eng) and how Spain transposes
it in [Ley 9/2017 (LCSP)](https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902), linked to the
article. Validation fails the build if a Directive citation lacks its LCSP counterpart. The
**Legislation & process** view walks an open procedure stage by stage with both texts side by
side, plus a Directive-to-LCSP concordance (`packages/content/src/law/`).

The full design and roadmap are in [`docs/plan.md`](docs/plan.md). Current content: mission
**P2, "Six bids, four evaluators"** (evaluation and award of a harmonised tender), with draft
answer keys pending SME review.

## Layout

| Path | What |
| --- | --- |
| `packages/engine` | Pure TypeScript: seeded RNG, mission runner, replay, scoring. No React, no DOM. |
| `packages/content` | Missions, competencies, EU-law references, validation. Keys are authored next to the prose and split out by `defineMission`. |
| `apps/web` | React + Vite player and debrief. |
| `tests/e2e` | Playwright smoke test against the production build. |

## Running it

```bash
npm install
npm run dev         # dev server
npm run typecheck   # TypeScript, strict
npm test            # engine, scoring guardrails, content validation
npm run test:e2e    # Playwright smoke test
```

Add `?seed=42` to the URL to fix the choice order.

## Deployment

Netlify builds `main` to production and every pull request to a deploy preview
(`netlify.toml`: `npm run build` -> `apps/web/dist`).

## Answer keys

In Phase 0 the hello mission's keys ship to the browser so the debrief works without a backend.
From Phase 2 keys live only in server functions, and CI fails if key text reaches the web
bundle. Keep this repository private: the keys are in the source.
