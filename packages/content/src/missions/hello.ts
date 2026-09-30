/**
 * Phase 0 hello mission: proves the pipeline end to end (author -> split -> play -> score).
 *
 * Prose adapted from darosaot/publicadmin@b524760, `evt.procurement.committee_pressure` and
 * `evt.procurement.shared_address`. The keys are a DRAFT pending SME review; they will be
 * reworked into mission P2 ("Six bids, four evaluators") in Phase 1.
 *
 * Graded against Directive 2014/24/EU as transposed by the LCSP. Where the two differ the
 * stricter national rule decides the grade: LCSP art. 150.1 makes referral to the competition
 * authority the required route for well-founded collusion signs in a harmonised contract, so
 * excluding the two bidders on your own, which the Directive would allow, grades weak here.
 */

import { defineMission } from '../authoring';

export const hello = defineMission('m.hello', {
  title: 'Two problems before Friday',
  briefing:
    'You are the procurement officer at Northbridge City Council, running a four-hundred-thousand-euro services tender, above the EU threshold and so a harmonised contract. The evaluation committee meets this week and the award is due on Friday.',
  estMinutes: 5,
  steps: [
    {
      id: 'm.hello.address',
      kind: 'dilemma',
      scored: true,
      title: 'Two bidders, one address',
      body: 'Checking the paperwork, you notice that two of the three bidders are registered at the same address. Their bids are different enough to look competitive and similar enough to have been written by the same person.',
      choices: [
        {
          id: 'suspend',
          label: 'Suspend the procedure and refer it',
          outcome:
            'You send a detailed note and the whole file, every bid included, to the competition authority. The tender is suspended the same day; the bidders are not told why. Three weeks later the report comes back: the indications are well founded.',
          meters: { integrity: 6, politicalCapital: -5, stress: 8 },
          key: {
            grade: 'best',
            points: { risk: 3, procurement: 2 },
            rationale:
              'A shared address plus near-identical bids is a classic collusion indicator. In a harmonised contract the LCSP makes this the required route: before award, refer the well-founded signs to the CNMC (or the regional authority) with a reasoned explanation and the full file. The referral suspends the tender, and the bidders are not notified. The Directive would also let you exclude, but national law asks for the competent authority first.',
            refs: ['dir2014_24.art57_4_d', 'lcsp.150', 'lcsp.132'],
          },
        },
        {
          id: 'exclude',
          label: 'Exclude both and award to the third',
          outcome:
            'Quick, and the third bid is nine per cent more expensive. Nobody investigates the other two, who bid again next year.',
          meters: { integrity: 3, stress: 4 },
          key: {
            grade: 'weak',
            points: { risk: 1 },
            rationale:
              'You acted on the red flag, which matters, and the Directive does allow exclusion on sufficiently plausible indications. But the LCSP requires referral to the competition authority before award in a harmonised contract, and requires any sign of collusion to be reported. Excluding on your own skips the body able to establish the facts, invites a challenge from the excluded bidders, and leaves the pattern free to continue elsewhere.',
            refs: ['dir2014_24.art57_4_d', 'lcsp.150', 'lcsp.132'],
          },
        },
        {
          id: 'proceed',
          label: 'Note it and proceed',
          outcome:
            'Shared addresses prove nothing and the deadline is Friday. You write one line in the file recording that you noticed.',
          meters: { integrity: -5 },
          key: {
            grade: 'critical',
            points: {},
            rationale:
              'Recording a red flag and then ignoring it is the worst of both: the risk stays, and the file now proves you knew. Authorities must safeguard free competition throughout the procedure and report any sign of collusion.',
            refs: ['dir2014_24.art18', 'lcsp.132'],
          },
        },
      ],
    },
    {
      id: 'm.hello.committee',
      kind: 'dilemma',
      scored: true,
      title: 'A member of the committee has a view',
      body: 'In the evaluation meeting, one member is arguing hard for a bid that scored third on quality. His arguments are not unreasonable. He is also, you happen to know, a former colleague of that bidder’s project director.',
      choices: [
        {
          id: 'declare',
          label: 'Ask everyone to restate their conflicts of interest',
          outcome:
            'You put it to the whole committee as a procedural step. He declares the connection and recuses himself, angrily. The scoring stands.',
          meters: { integrity: 5, politicalCapital: -4 },
          key: {
            grade: 'best',
            points: { integrity: 3, procurement: 2 },
            rationale:
              'A possible conflict must be declared and managed before the evaluation continues. Under the LCSP anyone who knows of a possible conflict must report it immediately to the contracting authority, and you do. Asking the whole committee keeps it procedural rather than personal.',
            refs: ['dir2014_24.art24', 'lcsp.64'],
          },
        },
        {
          id: 'record',
          label: 'Record his arguments in the minutes verbatim',
          outcome:
            'Every word, attributed. The committee votes on the scores as they stand. He stops arguing when he sees the minute-taker writing.',
          meters: { integrity: 4, politicalCapital: -1 },
          key: {
            grade: 'acceptable',
            points: { integrity: 1, procurement: 1 },
            rationale:
              'Good record-keeping, but the conflict itself is never declared or managed, and you knew of it: the LCSP expects you to report it, not only to minute around it. The evaluation stays exposed to challenge.',
            refs: ['dir2014_24.art24', 'lcsp.64'],
          },
        },
        {
          id: 'concede',
          label: 'Let the committee be persuaded',
          outcome:
            'The scores are revisited "for consistency" and the third bid becomes the first. Everything is documented. Nothing is defensible.',
          meters: { integrity: -6, politicalCapital: 4 },
          key: {
            grade: 'critical',
            points: {},
            rationale:
              'Re-scoring under the influence of an undeclared conflict breaches equal treatment and the duty to prevent and resolve conflicts of interest, and invites annulment.',
            refs: ['dir2014_24.art24', 'lcsp.64', 'dir2014_24.art18', 'lcsp.132'],
          },
        },
      ],
    },
  ],
});
