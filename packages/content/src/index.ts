import type { AuthoredMission } from './authoring';
import { hello } from './missions/hello';

export { defineMission, type AuthoredMission } from './authoring';
export { competencies, type Competency } from './competencies';
export { references, type Reference } from './references';
export { validateMissions } from './validate';

export const missions: readonly AuthoredMission[] = [hello];
