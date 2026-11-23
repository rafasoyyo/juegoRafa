/** «¿Dónde hay más?»: se toca el grupo con más (o con menos) objetos. Nunca hay empate. */

import { COUNTABLE, distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question } from './types';

const SCALES = [0.6, 0.8, 1] as const;

function counts(band: AgeBand, rng: Rng): number[] {
  if (band === 'small') {
    for (;;) {
      const a = rng.int(1, 6);
      const b = rng.int(1, 6);
      if (Math.abs(a - b) >= 3) return [a, b];
    }
  }
  if (band === 'medium') {
    for (;;) {
      const a = rng.int(1, 10);
      const b = rng.int(1, 10);
      if (a !== b) return [a, b];
    }
  }
  // Mayores: tres grupos distintos de hasta 15.
  return rng.shuffle(Array.from({ length: 15 }, (_, i) => i + 1)).slice(0, 3);
}

function question(band: AgeBand, rng: Rng): Question {
  const object = rng.pick(COUNTABLE);
  const values = counts(band, rng);
  const more = band === 'small' ? true : rng.chance(0.5);
  const target = more ? Math.max(...values) : Math.min(...values);

  let scales = values.map(() => 1);
  if (band === 'big') {
    // Tamaños distintos; a menudo el grupo con menos tiene los objetos más grandes, para que ocupar más
    // sitio no delate la respuesta.
    scales = rng.shuffle(SCALES);
    if (rng.chance(0.5)) {
      const order = [...values].sort((a, b) => a - b);
      scales = values.map((v) => SCALES[2 - order.indexOf(v)]!);
    }
  }
  const options = toOptions(values.map((count, i) => ({ type: 'objects' as const, object, count, scale: scales[i]! })));
  return {
    kind: 'compare',
    prompt: { layout: 'basket', items: [{ type: 'basket', full: more }] },
    options,
    answer: { form: 'choice', correct: options.filter((_, i) => values[i] === target).map((o) => o.id) },
    hint: 'pair-up',
  };
}

export function compareQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
