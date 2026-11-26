/**
 * «El marco de diez» (mundo 2, nivel 2): un marco con fichas; se toca cuántas hay o, los mayores,
 * cuántas faltan para llenarlo. Los pequeños usan un marco de 5.
 */

import { numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

function question(band: AgeBand, rng: Rng, filled: number): Question {
  const cells = band === 'small' ? 5 : 10;
  const ask = band === 'big' ? 'missing' : 'count';
  const value = ask === 'missing' ? cells - filled : filled;
  const [min, max] = band === 'small' ? [1, 5] : band === 'medium' ? [1, 10] : [1, 9];
  const values = numberChoices(rng, value, band === 'big' ? 4 : 3, min, max);
  const toVisual = (v: number): Visual => (band === 'small' ? { type: 'dots', value: v } : { type: 'digit', value: v });
  const options = toOptions(values.map(toVisual));
  return {
    kind: 'ten-frame',
    prompt: { layout: 'ten-frame', items: [], scene: { kind: 'ten-frame', cells, filled, ask } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => values[o.id] === value).map((o) => o.id) },
    hint: 'count-up',
  };
}

export function tenFrameQuiz(band: AgeBand, rng: Rng): Question[] {
  const [min, max] = band === 'small' ? [1, 5] : band === 'medium' ? [3, 10] : [1, 9];
  const amounts = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, 3);
  return amounts.map((n) => question(band, rng, n));
}
