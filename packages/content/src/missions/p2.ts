/**
 * Mission P2, "Six bids, four evaluators": the evaluation and award of a harmonised services
 * tender, from the committee meeting to the signature.
 *
 * Seed prose from darosaot/publicadmin@b524760 (`evt.procurement.committee_pressure`,
 * `evt.procurement.shared_address`, `task.procurement.evaluation`,
 * `task.procurement.award_publication`, `task.procurement.challenge_response`). Steps 1 and 3
 * absorb the Phase 0 hello mission.
 *
 * Graded against Directive 2014/24/EU as transposed by the LCSP; where the two differ the
 * stricter national rule decides the grade. Every key is a DRAFT pending SME review.
 */

import { defineMission } from '../authoring';

export const p2 = defineMission('m.p2', {
  title: 'Six bids, four evaluators',
  briefing:
    'You are the procurement officer at Northbridge City Council, secretary to the evaluation committee for a €400,000 maintenance services contract: above the EU threshold, so harmonised and open to a special appeal. Six bids are in. The published criteria give 60 points to a technical proposal judged by experts and 40 to price. The director wants the contract signed before the summer.',
  estMinutes: 12,
  steps: [
    {
      id: 'm.p2.conflict',
      kind: 'dilemma',
      scored: true,
      title: 'A member of the committee has a view',
      body: 'In the first meeting, one member is arguing hard for a bid that scored third on quality. His arguments are not unreasonable. He is also, you happen to know, a former colleague of that bidder’s project director.',
      choices: [
        {
          id: 'declare',
          label: 'Ask everyone to restate their conflicts of interest',
          outcome:
            'You put it to the whole committee as a procedural step. He declares the connection and recuses himself, angrily. A substitute is appointed and the scoring stands.',
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
    {
      id: 'm.p2.criteria',
      kind: 'dilemma',
      scored: true,
      title: 'The grid needs more detail',
      body: 'Before scoring the technical proposals, a member suggests the published criterion "methodology, 30 points" is too broad. He proposes splitting it today into four sub-criteria with weights the committee agrees now, "to be fair to everyone". Another member suggests asking the maintenance unit that wrote the requirement to score the proposals instead, since they know the buildings best.',
      choices: [
        {
          id: 'published',
          label: 'Score only against the published criteria and weights, with written reasons per bid',
          outcome:
            'It takes two long afternoons. Every score has a paragraph behind it, tied to the wording of the published criterion.',
          meters: { stress: 5 },
          key: {
            grade: 'best',
            points: { procurement: 3, transparency: 2 },
            rationale:
              'Bidders prepared their offers against the criteria and weightings published in the tender documents, which must state the relative weighting of each criterion. Applying exactly those, by the expert committee, with reasons recorded per bid, is what makes the scores defensible and lets the award be properly reasoned later.',
            refs: ['dir2014_24.art67', 'lcsp.146'],
          },
        },
        {
          id: 'subcriteria',
          label: 'Agree the sub-criteria and weights now and apply them',
          outcome:
            'The grid looks rigorous. A losing bidder later asks where the four sub-criteria were published, and nobody has an answer.',
          meters: { politicalCapital: 1 },
          key: {
            grade: 'weak',
            points: { procurement: 1 },
            rationale:
              'The instinct for structure is right, but weightings the bidders never saw, set after the bids are open, can change the outcome and breach equal treatment and transparency. Weightings belong in the tender documents; after opening, you can only explain how you applied the published ones.',
            refs: ['dir2014_24.art67', 'lcsp.146', 'dir2014_24.art18', 'lcsp.132'],
          },
        },
        {
          id: 'proposer',
          label: 'Ask the maintenance unit that wrote the requirement to score the proposals',
          outcome:
            'They know the buildings and score quickly. The committee adopts their numbers.',
          meters: { stress: -2 },
          key: {
            grade: 'weak',
            points: {},
            rationale:
              'Where judgement-based criteria outweigh the automatic ones, as here (60 to 40), the LCSP requires them to be assessed by a committee of at least three qualified experts not attached to the unit that proposed the contract, or by a specialised technical body. Handing the scoring to the proposing unit puts the award outside the law.',
            refs: ['dir2014_24.art67', 'lcsp.146'],
          },
        },
      ],
    },
    {
      id: 'm.p2.address',
      kind: 'dilemma',
      scored: true,
      title: 'Two bidders, one address',
      body: 'Checking the paperwork, you notice that two of the six bidders are registered at the same address. Their bids are different enough to look competitive and similar enough to have been written by the same person.',
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
          label: 'Exclude both and carry on with the other four',
          outcome:
            'Quick, and the scoring carries on. Nobody investigates the two you excluded, who bid again next year.',
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
            'Shared addresses prove nothing and the director wants a signature before summer. You write one line in the file recording that you noticed.',
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
      id: 'm.p2.low',
      kind: 'dilemma',
      scored: true,
      title: 'Thirty-one per cent below',
      body: 'With the scoring done, the top-ranked bid is 31% below the average price, past the abnormality threshold set in the tender documents. The director is delighted. The maintenance unit thinks no one can staff the contract at that price.',
      choices: [
        {
          id: 'hear',
          label: 'Ask the bidder to justify and break down its price, then get a technical report on the answer',
          outcome:
            'The bidder has ten days. Its reply shows a staffing plan that only works by not paying the sector collective agreement. The committee proposes rejection, with reasons.',
          meters: { stress: 4, politicalCapital: -2 },
          key: {
            grade: 'best',
            points: { procurement: 3, risk: 2 },
            rationale:
              'An offer presumed abnormal triggers a mandatory hearing: the bidder must be asked, with a sufficient deadline, to justify and break down its price, and the committee then proposes acceptance or rejection with reasons. Neither acceptance nor rejection is lawful without that step.',
            refs: ['dir2014_24.art69', 'lcsp.149'],
          },
        },
        {
          id: 'reject',
          label: 'Reject it as unrealistic and award to the second bid',
          outcome:
            'The second bid is safe and familiar. The rejected bidder files a special appeal within the week.',
          meters: { politicalCapital: 1 },
          key: {
            grade: 'weak',
            points: { risk: 1 },
            rationale:
              'The risk you saw is real, but an abnormally low offer cannot be rejected without first giving the bidder the chance to explain. Skipping the hearing is the most common reason these rejections are overturned on appeal.',
            refs: ['dir2014_24.art69', 'lcsp.149'],
          },
        },
        {
          id: 'accept',
          label: 'Accept it: a low price is good news for the council',
          outcome:
            'The contract starts in September. By November two sites have no cover and the contractor asks for a price revision.',
          meters: { reputation: 2 },
          key: {
            grade: 'weak',
            points: {},
            rationale:
              'An offer past the abnormality threshold cannot simply be accepted: the LCSP requires the justification procedure and a reasoned proposal before acceptance. Low prices that cannot be explained are where non-performance, and sometimes labour or environmental breaches, come from.',
            refs: ['dir2014_24.art69', 'lcsp.149'],
          },
        },
      ],
    },
    {
      id: 'm.p2.standstill',
      kind: 'dilemma',
      scored: true,
      title: 'Sign it on Monday',
      body: 'The award is decided. The director wants the contract signed on Monday so work can start before the summer. A losing bidder has already emailed asking how the scores were reached.',
      choices: [
        {
          id: 'wait',
          label: 'Notify a reasoned award with the score breakdown, publish it, and sign after fifteen working days',
          outcome:
            'The losing bidder reads the breakdown, recognises where it lost points, and does not appeal. Work starts three weeks later than the director wanted.',
          meters: { politicalCapital: -3, reputation: 2 },
          key: {
            grade: 'best',
            points: { transparency: 3, procurement: 2 },
            rationale:
              'The award must be reasoned and notified with the information a bidder needs to appeal properly, including the breakdown of scores, and published on the buyer profile. In a contract open to special appeal, signature must wait fifteen working days from notification: the standstill that makes an appeal meaningful.',
            refs: ['lcsp.151', 'lcsp.153'],
          },
        },
        {
          id: 'thin',
          label: 'Notify the award without the score breakdown, then wait the fifteen days',
          outcome:
            'Two bidders appeal, mainly because they cannot tell why they lost. The appeal body orders the notice reissued with reasons.',
          meters: { stress: 4 },
          key: {
            grade: 'weak',
            points: { procurement: 1 },
            rationale:
              'You respected the standstill, but a notice without the reasons and the breakdown of scores does not let bidders decide whether to appeal, so it invites the appeals it was meant to avoid.',
            refs: ['lcsp.151', 'lcsp.153'],
          },
        },
        {
          id: 'sign',
          label: 'Sign on Monday; the bidder can still appeal afterwards',
          outcome:
            'Work starts on time. The appeal arrives anyway, against a contract already signed.',
          meters: { politicalCapital: 3, integrity: -3 },
          key: {
            grade: 'critical',
            points: {},
            rationale:
              'Signing inside the standstill removes the bidders\' chance to appeal before the contract exists. Where that happens and an infringement also cost a bidder the award, the contract is null. It is the one shortcut in this procedure that can undo all the rest.',
            refs: ['lcsp.153', 'lcsp.39'],
          },
        },
      ],
    },
  ],
});
