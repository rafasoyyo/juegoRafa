/**
 * Preguntas de la bandera del castillo: una por paso, de una prueba elegida al azar entre las del paso y
 * distinta de las ya elegidas mientras queden otras. Cada pregunta conserva su tipo, así que se dibuja
 * como en su nivel (igual que el repaso del río).
 */

import type { Rng } from './rng';
import type { AgeBand, Question, QuizContext, QuizKind } from './types';

export type MakeQuiz = (kind: QuizKind, band: AgeBand, rng: Rng, ctx: QuizContext) => Question[];

/** Tipos elegidos para cada paso (`pools[i]` son los posibles del paso `i`). */
export function castleQuizKinds(pools: readonly (readonly QuizKind[])[], rng: Rng): QuizKind[] {
  const chosen: QuizKind[] = [];
  for (const pool of pools) {
    if (pool.length === 0) continue;
    const fresh = pool.filter((k) => !chosen.includes(k));
    const pick = rng.shuffle(fresh.length > 0 ? fresh : pool)[0]!;
    chosen.push(pick);
  }
  return chosen;
}

export function castleQuiz(pools: readonly (readonly QuizKind[])[], band: AgeBand, rng: Rng, ctx: QuizContext, make: MakeQuiz): Question[] {
  return castleQuizKinds(pools, rng).flatMap((kind) => make(kind, band, rng, ctx).slice(0, 1));
}
