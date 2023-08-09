
/*
 * Module dependencies.
 */

import { KnowledgeBase } from 'src/types/knowledge-bases';
import seedrandom from 'seedrandom';

/*
 * Export tree related functions.
 */

export function getTreeById(id: string) {
  const rng = seedrandom(id);

  return Math.abs(rng.int32()) % 8 + 1;
}

export function getTree(knowledge: KnowledgeBase) {
  return getTreeById(knowledge.id);
}
