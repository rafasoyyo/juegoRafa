/**
 * «¿Cuántos dedos?» (mundo 2, nivel 1): manos con dedos levantados; se toca cuántos hay. Ver sin contar:
 * una mano entera es 5.
 */

import { numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

/** Dedos de cada mano para `n`: los pequeños, una mano; los medianos, la primera llena; los mayores, repartidos. */
export function handsFor(band: AgeBand, n: number, rng: Rng): number[] {
  if (band === 'small') return [n];
  if (band === 'medium') return n <= 5 ? [n] : [5, n - 5];
  const a = rng.int(Math.max(0, n - 5), Math.min(5, n));
  return [a, n - a];
}

function question(band: AgeBand, rng: Rng, n: number): Question {
  const max = band === 'small' ? 5 : 10;
  const values = numberChoices(rng, n, band === 'big' ? 4 : 3, 1, max);
  const toVisual = (value: number): Visual => (band === 'small' ? { type: 'dots', value } : { type: 'digit', value });
  const options = toOptions(values.map(toVisual));
  return {
    kind: 'fingers',
    prompt: { layout: 'fingers', items: [], scene: { kind: 'fingers', hands: handsFor(band, n, rng) } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => values[o.id] === n).map((o) => o.id) },
    hint: 'count-up',
  };
}

export function fingersQuiz(band: AgeBand, rng: Rng): Question[] {
  const [min, max] = band === 'small' ? [1, 5] : band === 'medium' ? [3, 10] : [4, 10];
  const amounts = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, 3);
  return amounts.map((n) => question(band, rng, n));
}
