
/*
 * Module dependencies.
 */

import { KnowledgeBase } from 'src/types/knowledge-bases';
import seedrandom from 'seedrandom';

/*
 * Export tree related functions.
 */

export function getTreeById(id: string, max: number) {
  const rng = seedrandom(id);

  return Math.abs(rng.int32()) % max + 1;
}

export function getTree(knowledge: KnowledgeBase, max: number) {
  return getTreeById(knowledge.id, max);
}
