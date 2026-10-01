/**
 * The procurement process, stage by stage, with the rules that govern each stage.
 *
 * This is the spine of the knowledge section: a consultant can see where in a real procedure a
 * mission's decision sits, and open the Directive article and its LCSP transposition from the
 * same place. Validation checks that every article a key cites appears in some stage, so the
 * map never falls behind the missions.
 */

export interface ProcessStage {
  id: string;
  title: string;
  /** What the official is doing at this stage, and what typically goes wrong. */
  summary: string;
  /** Article ids (see articles.ts), Directive first then LCSP. */
  articles: string[];
}

export const procurementProcess: ProcessStage[] = [
  {
    id: 'need',
    title: '1. Need and the file',
    summary:
      'Establish and document why the contract is needed and how it will be bought. Weak justification here is what an auditor reads first.',
    articles: ['lcsp.28', 'lcsp.116'],
  },
  {
    id: 'principles',
    title: 'Throughout: principles and conflicts of interest',
    summary:
      'Equal treatment, transparency, proportionality, and no artificial narrowing of competition. Anyone involved who may have an interest must declare it, and anyone who knows of one must report it.',
    articles: ['dir2014_24.art18', 'dir2014_24.art24', 'lcsp.1', 'lcsp.64', 'lcsp.132'],
  },
  {
    id: 'specs',
    title: '2. Technical specifications',
    summary:
      'Describe the need, not a product. A requirement only one supplier can meet, or a brand without "or equivalent", is the classic way a tender is rigged in good faith.',
    articles: ['dir2014_24.art42', 'lcsp.126'],
  },
  {
    id: 'criteria',
    title: '3. Selection and award criteria',
    summary:
      'Solvency proportionate to the contract (the LCSP caps required turnover at 1.5 times the value) and award criteria linked to the subject matter, published in advance.',
    articles: [
      'dir2014_24.art58',
      'dir2014_24.art67',
      'lcsp.74',
      'lcsp.87',
      'lcsp.90',
      'lcsp.145',
    ],
  },
  {
    id: 'publication',
    title: '4. Publication and bids',
    summary:
      'The buyer profile carries the documents and, later, the committee and award reports. What is not published cannot be checked.',
    articles: ['lcsp.63'],
  },
  {
    id: 'evaluation',
    title: '5. Evaluation',
    summary:
      'Apply the published criteria as written, by a properly constituted committee. Hear any abnormally low bidder before rejecting them.',
    articles: ['dir2014_24.art69', 'lcsp.146', 'lcsp.149'],
  },
  {
    id: 'award',
    title: '6. Ranking, collusion checks and award',
    summary:
      'Before awarding, act on red flags. In Spain, well-founded signs of collusion in a harmonised contract go to the CNMC before award, which suspends the tender.',
    articles: ['dir2014_24.art57_4_d', 'lcsp.150', 'lcsp.151'],
  },
  {
    id: 'standstill',
    title: '7. Standstill and signature',
    summary:
      'Where a special appeal is possible, wait fifteen working days after notifying the award before signing. Signing early is how an award becomes an annulment.',
    articles: ['lcsp.153'],
  },
  {
    id: 'execution',
    title: '8. Execution and modifications',
    summary:
      'Manage the contract as signed. A change that alters its economic balance or scope substantially needs a new procedure, not an amendment.',
    articles: ['dir2014_24.art72', 'lcsp.203', 'lcsp.204', 'lcsp.205'],
  },
  {
    id: 'payment',
    title: '9. Payment',
    summary: 'Pay within thirty days of approving the invoice or certification, or pay interest.',
    articles: ['lcsp.198'],
  },
  {
    id: 'exceptions',
    title: 'Exceptions: urgency and emergency',
    summary:
      'Negotiation without publication and emergency handling are narrow exceptions. The emergency must be real, the response limited to it, and the file must prove both.',
    articles: ['dir2014_24.art32', 'lcsp.168', 'lcsp.120'],
  },
];
