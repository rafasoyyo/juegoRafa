/**
 * «De pequeño a grande»: se tocan varios elementos en orden y cada uno salta a su sitio en la fila.
 * La escalera de la consigna indica si se ordena subiendo o bajando.
 */

import { distinctQuestions, COUNTABLE } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

/** Tamaños relativos: consecutivos con razón ≥ 1,4 (pequeños) o ≥ 1,2 (medianos). */
export const SCALES_SMALL = [0.3, 0.45, 0.65, 0.95] as const;
export const SCALES_MEDIUM = [0.3, 0.4, 0.52, 0.7, 0.95] as const;

function question(band: AgeBand, rng: Rng): Question {
  const direction: 'up' | 'down' = band === 'small' ? 'up' : rng.pick(['up', 'down'] as const);
  let sorted: Visual[];
  if (band === 'big') {
    const values = rng.shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 5).sort((a, b) => a - b);
    sorted = values.map((value) => ({ type: 'digit' as const, value }));
  } else {
    const object = rng.pick(COUNTABLE);
    const pool = band === 'small' ? SCALES_SMALL : SCALES_MEDIUM;
    const n = band === 'small' ? 3 : 4;
    // Se quitan elementos de la lista hasta quedarse con n, siempre en orden creciente.
    const keep = [...pool];
    while (keep.length > n) keep.splice(rng.int(0, keep.length - 1), 1);
    sorted = keep.map((scale) => ({ type: 'sized' as const, object, scale }));
  }
  const solution = direction === 'up' ? sorted : [...sorted].reverse();
  // Sueltos en desorden: nunca ya en el orden de la solución.
  let shuffled = rng.shuffle(solution);
  while (shuffled.every((v, i) => v === solution[i])) shuffled = rng.shuffle(solution);
  const options = toOptions(shuffled, 'scene');
  const targets = solution.map((v) => options.find((o) => o.visual === v)!.id);
  return {
    kind: 'order',
    prompt: { layout: 'order', items: [], scene: { kind: 'order', direction } },
    options,
    answer: { form: 'multi', targets, ordered: true },
    hint: 'compare-two',
  };
}

export function orderQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
