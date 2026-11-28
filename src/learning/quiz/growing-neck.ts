/**
 * «El cuello que crece» (mundo 3, nivel 9): dinosaurios en fila con el cuello cada vez más largo; se elige
 * el que falta. Pequeños y medianos: de uno en uno, desde 1 o 2, y falta el último (los pequeños ven
 * cuellos más cortos). Mayores: de uno en uno o de dos en dos, y el hueco puede estar en medio.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

/** El cuello más largo que se dibuja. */
export const MAX_NECK = 8;

const neck = (length: number): Visual => ({ type: 'neck', length });

function question(band: AgeBand, rng: Rng): Question {
  const step = band === 'big' ? rng.pick([1, 2]) : 1;
  const count = band === 'small' ? rng.pick([3, 4]) : step === 2 ? 4 : rng.pick([4, 5]);
  const start = rng.int(1, Math.min(2, MAX_NECK - (count - 1) * step));
  const row = Array.from({ length: count }, (_, i) => neck(start + i * step));
  const holeIndex = band === 'big' ? rng.int(1, count - 1) : count - 1;
  const value = start + holeIndex * step;
  const near = [value - step, value + step, value + 2 * step, value - 1, value + 1, value + 2].filter((v, i, a) => v >= 1 && v <= MAX_NECK && v !== value && a.indexOf(v) === i);
  const options = toOptions(rng.shuffle([value, ...rng.shuffle(near.slice(0, 4)).slice(0, 2)]).map(neck));
  return {
    kind: 'growing-neck',
    prompt: { layout: 'row', items: row, holeIndex },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.key === `neck:${value}`).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function growingNeckQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
