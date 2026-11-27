/**
 * «Formas escondidas» (mundo 3, nivel 11): ¿cuántos triángulos hay en el dibujo? Pequeños: triángulos
 * sueltos entre otras formas. Medianos: dibujos con 1 a 3 triángulos, alguno hecho de dos. Mayores:
 * dibujos donde los triángulos se solapan (el grande también cuenta).
 */

import { distinctQuestions, numberChoices, PIECE_COLORS } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type FigureId, type Question, type ShapeId, type Visual } from './types';

/** Triángulos de cada dibujo, contando los grandes hechos de pequeños. */
export const TRIANGLES: Record<FigureId, number> = { one: 1, 'cut-top': 2, diagonal: 2, 'split-1': 3, triforce: 5, 'split-2': 6, 'two-diagonals': 8 };
/** Trozos en que queda partido (lo que cuenta quien se olvida de los grandes). */
export const PIECES_IN: Record<FigureId, number> = { one: 1, 'cut-top': 1, diagonal: 2, 'split-1': 2, triforce: 4, 'split-2': 3, 'two-diagonals': 4 };

export const FIGURES_BY_BAND: Record<'medium' | 'big', FigureId[]> = {
  medium: ['one', 'cut-top', 'diagonal', 'split-1'],
  big: ['split-1', 'triforce', 'split-2', 'two-diagonals'],
};

function mixQuestion(rng: Rng): Question {
  const triangles = rng.int(1, 4);
  const others = rng.int(1, 5 - triangles + 1);
  const shapes = rng.shuffle([
    ...Array.from({ length: triangles }, () => 'triangle' as ShapeId),
    ...Array.from({ length: others }, () => rng.pick(['circle', 'square'] as ShapeId[])),
  ]).map((shape) => ({ shape, color: rng.pick(PIECE_COLORS) }));
  const options = toOptions(numberChoices(rng, triangles, 3, 1, 5).map((value): Visual => ({ type: 'dots', value })));
  return {
    kind: 'hidden-triangles',
    prompt: { layout: 'picture', items: [{ type: 'mix', shapes }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `dots:${triangles}`).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

function figureQuestion(rng: Rng, figure: FigureId): Question {
  const n = TRIANGLES[figure];
  // Entre las falsas, la de quien cuenta solo los trozos (si es otra).
  const values = new Set([n]);
  if (PIECES_IN[figure] !== n) values.add(PIECES_IN[figure]);
  for (const v of numberChoices(rng, n, 4, 1, 9)) if (values.size < 3) values.add(v);
  const options = toOptions(rng.shuffle([...values]).map((value): Visual => ({ type: 'digit', value })));
  return {
    kind: 'hidden-triangles',
    prompt: { layout: 'picture', items: [{ type: 'figure', figure }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `digit:${n}`).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function hiddenTrianglesQuiz(band: AgeBand, rng: Rng): Question[] {
  if (band === 'small') return distinctQuestions(() => mixQuestion(rng));
  const figures = rng.shuffle(FIGURES_BY_BAND[band]);
  return distinctQuestions((i) => figureQuestion(rng, figures[i % figures.length]!));
}
