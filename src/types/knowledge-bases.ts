
/*
 * Module dependencies.
 */

import { Organization } from './organizations';

/*
 * Organization type.
 */

export type KnowledgeBase = {
  id: string,
  name: string,
  isPersonal: boolean,
  organization: Organization,
  resourcesCount: number
};

export type KnowledgeBasePatch = Omit<Partial<KnowledgeBase>, 'id' | 'isPersonal' | 'resourcesCount' | 'organization'>;

export type KnowledgeBaseCreation = Omit<KnowledgeBase, 'id' | 'isPersonal' | 'resourcesCount' | 'organization'>
