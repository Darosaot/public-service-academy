/**
 * The legal instruments the game cites.
 *
 * Valmara is a fictional EU member state, but the rules its officials apply are real: the EU
 * procurement Directive and, as the national transposition, Spain's Ley 9/2017 (LCSP). Every
 * key that cites a Directive article must also cite how the LCSP transposes it, so a debrief
 * always shows the rule and the way a Spanish administration actually applies it.
 */

export type SourceId = 'dir2014_24' | 'lcsp';

export interface LegalSource {
  id: SourceId;
  /** 'eu' for Union law, an ISO country code for national law. */
  jurisdiction: 'eu' | 'es';
  short: string;
  title: string;
  url: string;
  language: 'en' | 'es';
  /** For consolidated national texts: the consolidation the anchors were taken from. */
  consolidatedAsOf?: string;
}

export const sources: Record<SourceId, LegalSource> = {
  dir2014_24: {
    id: 'dir2014_24',
    jurisdiction: 'eu',
    short: 'Directive 2014/24/EU',
    title: 'Directive 2014/24/EU of the European Parliament and of the Council of 26 February 2014 on public procurement',
    url: 'https://eur-lex.europa.eu/eli/dir/2014/24/oj/eng',
    language: 'en',
  },
  lcsp: {
    id: 'lcsp',
    jurisdiction: 'es',
    short: 'Ley 9/2017 (LCSP)',
    title: 'Ley 9/2017, de 8 de noviembre, de Contratos del Sector Público',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902',
    language: 'es',
    consolidatedAsOf: '2026-04-09',
  },
};
