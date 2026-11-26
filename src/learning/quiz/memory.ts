/**
 * «Parejas» (mundo 2, nivel 3): unas cartas se ven un momento y se dan la vuelta; se toca la que hace
 * pareja con la de la consigna (una cantidad con su número). Los pequeños emparejan dibujos con puntos.
 */

import { COUNTABLE } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

const SETUP: Record<AgeBand, { range: [number, number]; cards: number; showMs: number }> = {
  small: { range: [1, 5], cards: 3, showMs: 3200 },
  medium: { range: [1, 10], cards: 4, showMs: 3000 },
  big: { range: [3, 15], cards: 5, showMs: 3000 },
};

function question(band: AgeBand, rng: Rng, n: number): Question {
  const { range, cards, showMs } = SETUP[band];
  const pool = Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i).filter((v) => v !== n);
  const values = rng.shuffle([n, ...rng.shuffle(pool).slice(0, cards - 1)]);
  const toVisual = (value: number): Visual => (band === 'small' ? { type: 'dots', value } : { type: 'digit', value });
  const options = toOptions(values.map(toVisual), 'scene');
  return {
    kind: 'memory',
    prompt: { layout: 'memory', items: [{ type: 'objects', object: rng.pick(COUNTABLE), count: n, scale: 1 }], scene: { kind: 'memory', showMs } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => values[o.id] === n).map((o) => o.id) },
    hint: 'peek',
  };
}

export function memoryQuiz(band: AgeBand, rng: Rng): Question[] {
  const [min, max] = SETUP[band].range;
  const amounts = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, 3);
  return amounts.map((n) => question(band, rng, n));
}
