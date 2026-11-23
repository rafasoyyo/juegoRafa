/** «¿Cuántos hay?»: se cuentan objetos y se toca la cantidad. */

import { COUNTABLE, numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

const RANGE: Record<AgeBand, [number, number]> = { small: [1, 3], medium: [1, 10], big: [8, 20] };

function question(band: AgeBand, rng: Rng, n: number, object: (typeof COUNTABLE)[number]): Question {
  const [min, max] = RANGE[band];
  let values: number[];
  let toVisual: (v: number) => Visual;
  if (band === 'small') {
    // Puntos de dado de 1 a 4: la respuesta y dos más.
    values = numberChoices(rng, n, 3, 1, 4);
    toVisual = (value) => ({ type: 'dots', value });
  } else if (band === 'medium') {
    values = numberChoices(rng, n, 3, min, max);
    toVisual = (value) => ({ type: 'digit', value });
  } else {
    values = numberChoices(rng, n, 4, 1, 30, [1, -1, 10, -10, 2, -2]);
    toVisual = (value) => ({ type: 'digit', value });
  }
  const options = toOptions(values.map(toVisual));
  const layout = band === 'big' ? 'tenframes' : n <= 5 ? 'scatter' : 'rows';
  return {
    kind: 'count',
    prompt: { layout, items: [{ type: 'objects', object, count: n, scale: 1 }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => values[o.id] === n).map((o) => o.id) },
    hint: 'count-up',
  };
}

export function countQuiz(band: AgeBand, rng: Rng): Question[] {
  const [min, max] = RANGE[band];
  // Tres cantidades distintas y tres objetos distintos.
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const amounts = rng.shuffle(pool).slice(0, 3);
  const objects = rng.shuffle(COUNTABLE).slice(0, 3);
  return amounts.map((n, i) => question(band, rng, n, objects[i]!));
}
