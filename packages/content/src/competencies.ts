import type { CompetencyId } from '@academy/engine';

export interface Competency {
  id: CompetencyId;
  name: string;
  description: string;
}

/** The MVP framework (docs/plan.md, section 2.3). */
export const competencies: Record<CompetencyId, Competency> = {
  procurement: {
    id: 'procurement',
    name: 'Procurement rules',
    description: 'Choosing and running the right procedure, and applying its rules correctly.',
  },
  finance: {
    id: 'finance',
    name: 'Financial rules and EU funds',
    description: 'Budget execution, eligibility of costs, honest reporting of EU-funded work.',
  },
  integrity: {
    id: 'integrity',
    name: 'Integrity and conflicts of interest',
    description: 'Recognising and managing conflicts, gifts and pressure to bend a decision.',
  },
  risk: {
    id: 'risk',
    name: 'Risk and control awareness',
    description: 'Spotting red flags and fraud indicators, and leaving an audit trail.',
  },
  transparency: {
    id: 'transparency',
    name: 'Transparency and accountability',
    description: 'Recording, reasoning and publishing decisions so they can be checked.',
  },
  judgement: {
    id: 'judgement',
    name: 'Judgement under pressure',
    description: 'Handling stakeholders, priorities and deadlines without losing the rules.',
  },
};
