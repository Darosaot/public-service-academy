/**
 * Article-level references, with deep links and the Directive -> LCSP concordance.
 *
 * LCSP anchors are the BOE's block ids (Article 64 is `#a6-6`, not `#a64`). They were read
 * from the consolidated text of 09/04/2026 and each heading below is copied from it verbatim;
 * if the BOE re-blocks the text after a future amendment, re-derive them from the page. The
 * Directive links use EUR-Lex's `#art_N` article anchors on the ELI page.
 *
 * Summaries are plain-language study aids written for the game, not legal text. The link is
 * always the authority.
 */

import { sources, type SourceId } from './sources';

export interface LegalArticle {
  id: string;
  source: SourceId;
  /** Article number as printed, e.g. '57'. */
  article: string;
  /** Paragraph/point within the article, e.g. '4(d)'. */
  paragraph?: string;
  /** Official heading, in the source's language. */
  heading: string;
  /** English gloss of a Spanish heading. */
  headingEn?: string;
  /** Plain-language study note, in English. */
  summary: string;
  /** BOE block anchor, for LCSP articles. */
  anchor?: string;
  /** For Directive articles: the LCSP articles that transpose it. */
  transposedBy?: string[];
}

const eu = (
  article: string,
  heading: string,
  summary: string,
  transposedBy: string[],
  paragraph?: string,
): LegalArticle => ({
  id: `dir2014_24.art${article}${paragraph ? '_' + paragraph.replace(/[()]/g, '_').replace(/_+/g, '_').replace(/_$/, '') : ''}`,
  source: 'dir2014_24',
  article,
  paragraph,
  heading,
  summary,
  transposedBy,
});

const es = (
  article: string,
  anchor: string,
  heading: string,
  headingEn: string,
  summary: string,
): LegalArticle => ({
  id: `lcsp.${article}`,
  source: 'lcsp',
  article,
  anchor,
  heading,
  headingEn,
  summary,
});

export const articleList: LegalArticle[] = [
  /* ------------------------------------------------ Directive 2014/24/EU */
  eu('18', 'Principles of procurement',
    'Treat economic operators equally and without discrimination, act transparently and proportionately, and never design a procurement to narrow competition artificially.',
    ['lcsp.1', 'lcsp.132']),
  eu('24', 'Conflicts of interest',
    'Member States must ensure contracting authorities prevent, identify and remedy conflicts of interest of staff involved in, or able to influence, a procedure.',
    ['lcsp.64']),
  eu('32', 'Use of the negotiated procedure without prior publication',
    'A closed list of exceptions, including extreme urgency from unforeseeable events not attributable to the authority. Read strictly.',
    ['lcsp.168', 'lcsp.120']),
  eu('42', 'Technical specifications',
    'Specifications must give equal access and not create unjustified obstacles; a reference to a brand or source is exceptional and must carry "or equivalent".',
    ['lcsp.126']),
  eu('57', 'Exclusion grounds',
    'An authority may exclude an operator where it has sufficiently plausible indications that the operator entered into agreements aimed at distorting competition.',
    ['lcsp.150', 'lcsp.132'], '4(d)'),
  eu('58', 'Selection criteria',
    'Selection criteria must be related and proportionate to the subject matter; required minimum turnover is normally capped at twice the estimated contract value.',
    ['lcsp.74', 'lcsp.87', 'lcsp.90']),
  eu('67', 'Contract award criteria',
    'Award on the most economically advantageous tender, with criteria linked to the subject matter, published in advance, and ensuring effective competition.',
    ['lcsp.145', 'lcsp.146']),
  eu('69', 'Abnormally low tenders',
    'Before rejecting an abnormally low tender the authority must ask the tenderer to explain the price or costs.',
    ['lcsp.149']),
  eu('72', 'Modification of contracts during their term',
    'Contracts may be modified without a new procedure only in the listed cases; a substantial modification needs a new procurement.',
    ['lcsp.203', 'lcsp.204', 'lcsp.205']),

  /* ------------------------------------------------------- Ley 9/2017 */
  es('1', 'a1', 'Objeto y finalidad.', 'Purpose and aim',
    'Sets the principles of free access, publicity and transparency, non-discrimination and equal treatment, and efficient use of public funds.'),
  es('28', 'a2-10', 'Necesidad e idoneidad del contrato y eficiencia en la contratación.', 'Need for and suitability of the contract',
    'Only contracts necessary for the body\'s purposes may be concluded, and the need must be documented in the file before starting.'),
  es('63', 'a6-5', 'Perfil de contratante.', 'Buyer profile',
    'What must be published on the buyer profile, including the file, specifications, committee members and award reports.'),
  es('64', 'a6-6', 'Lucha contra la corrupción y prevención de los conflictos de intereses.', 'Fighting corruption and preventing conflicts of interest',
    'Authorities must prevent, detect and resolve conflicts of interest; anyone aware of a possible conflict must report it immediately to the contracting authority.'),
  es('74', 'a7-6', 'Exigencia de solvencia.', 'Solvency requirements',
    'Operators must prove minimum economic and technical solvency, set in the specifications and linked and proportionate to the contract.'),
  es('87', 'a8-9', 'Acreditación de la solvencia económica y financiera.', 'Proving economic and financial standing',
    'How economic solvency is proved. Required minimum turnover may not exceed one and a half times the estimated contract value save in justified cases: stricter than the Directive\'s twice.'),
  es('90', 'a9-2', 'Solvencia técnica o profesional en los contratos de servicios.', 'Technical solvency in service contracts',
    'The means by which technical or professional ability is proved for services.'),
  es('116', 'a1-28', 'Expediente de contratación: iniciación y contenido.', 'The procurement file: initiation and content',
    'The file must justify the procedure, the solvency and award criteria, the value and the need, and why the contract is not split into lots.'),
  es('120', 'a1-32', 'Tramitación de emergencia.', 'Emergency handling',
    'For catastrophes or serious danger, the authority may order the work directly without a file; execution must start within one month, or the ordinary procedure applies. Anything beyond the emergency follows the ordinary rules.'),
  es('126', 'a1-38', 'Reglas para el establecimiento de prescripciones técnicas.', 'Rules for technical specifications',
    'Specifications must allow equal access and not create unjustified obstacles; brand references only exceptionally and with "o equivalente".'),
  es('132', 'a1-44', 'Principios de igualdad, transparencia y libre competencia.', 'Equality, transparency and free competition',
    'Equal treatment and transparency; no artificial restriction of competition; authorities must notify the competition authority of any sign of collusion between bidders.'),
  es('145', 'a1-57', 'Requisitos y clases de criterios de adjudicación del contrato.', 'Award criteria: requirements and types',
    'Award on best value for money, with criteria linked to the subject matter and formulated objectively.'),
  es('146', 'a1-58', 'Aplicación de los criterios de adjudicación.', 'Applying the award criteria',
    'How criteria are weighted and applied. Where judgement-based criteria outweigh automatic ones, a committee of at least three qualified experts, not attached to the proposing unit, must assess them.'),
  es('149', 'a1-61', 'Ofertas anormalmente bajas.', 'Abnormally low tenders',
    'Identifying abnormally low offers and the hearing the bidder must get before any rejection.'),
  es('150', 'a1-62', 'Clasificación de las ofertas y adjudicación del contrato.', 'Ranking offers and award',
    'In harmonised contracts, well-founded signs of collusion must be referred to the CNMC (or regional authority) before award; the referral immediately suspends the tender, without notifying the bidders.'),
  es('151', 'a1-63', 'Resolución y notificación de la adjudicación.', 'Award decision and notification',
    'The award must be reasoned, notified to candidates and bidders and published on the buyer profile.'),
  es('153', 'a1-65', 'Formalización de los contratos.', 'Signing the contract',
    'Formal signature of the contract. Where a special appeal (art. 44) is possible, signature must wait fifteen working days after the award is notified: the standstill period.'),
  es('168', 'a1-80', 'Supuestos de aplicación del procedimiento negociado sin publicidad.', 'When negotiation without publication is allowed',
    'The closed list of cases for the negotiated procedure without publicity, including imperative urgency.'),
  es('198', 'a1-110', 'Pago del precio.', 'Payment of the price',
    'The administration must pay within thirty days of approving the certification or the proof of conforming delivery, or owes late-payment interest and recovery costs.'),
  es('203', 'a2-15', 'Potestad de modificación del contrato.', 'Power to modify the contract',
    'Contracts may be modified only on public-interest grounds and in the cases the law allows.'),
  es('204', 'a2-16', 'Modificaciones previstas en el pliego de cláusulas administrativas particulares.', 'Modifications foreseen in the specifications',
    'Modifications provided for clearly in the tender documents, within limits.'),
  es('205', 'a2-17', 'Modificaciones no previstas en el pliego de cláusulas administrativas particulares: prestaciones adicionales, circunstancias imprevisibles y modificaciones no sustanciales.', 'Unforeseen modifications',
    'Additional works, unforeseeable circumstances and non-substantial changes: the only cases where an unforeseen modification is allowed.'),
];

export const articles: Record<string, LegalArticle> = Object.fromEntries(
  articleList.map((a) => [a.id, a]),
);

export function articleUrl(a: LegalArticle): string {
  const base = sources[a.source].url;
  return a.source === 'lcsp' ? `${base}#${a.anchor}` : `${base}#art_${a.article}`;
}

export function articleLabel(a: LegalArticle): string {
  const src = a.source === 'lcsp' ? 'LCSP' : 'Dir. 2014/24/EU';
  // '4(d)' prints as 57(4)(d), the way the Official Journal cites it.
  const num = a.paragraph ? `${a.article}(${a.paragraph.replace('(', ')(')}` : a.article;
  return `${src}, art. ${num}`;
}
