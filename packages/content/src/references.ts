export interface Reference {
  id: string;
  label: string;
  url: string;
}

const DIR_2014_24 = 'https://eur-lex.europa.eu/eli/dir/2014/24/oj';

/**
 * Legal and guidance references cited by debriefs. Keys refer to these by id, and validation
 * fails on an id that is not listed here.
 */
export const references: Record<string, Reference> = {
  'dir2014_24.art18': {
    id: 'dir2014_24.art18',
    label: 'Directive 2014/24/EU, Art. 18 (principles of procurement)',
    url: DIR_2014_24,
  },
  'dir2014_24.art24': {
    id: 'dir2014_24.art24',
    label: 'Directive 2014/24/EU, Art. 24 (conflicts of interest)',
    url: DIR_2014_24,
  },
  'dir2014_24.art57_4_d': {
    id: 'dir2014_24.art57_4_d',
    label: 'Directive 2014/24/EU, Art. 57(4)(d) (agreements distorting competition)',
    url: DIR_2014_24,
  },
};
