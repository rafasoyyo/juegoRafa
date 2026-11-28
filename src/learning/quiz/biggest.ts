/**
 * «El número más grande» (mundo 2, nivel 6): comparar cifras sin montones. La cesta llena pide el mayor
 * y la casi vacía, el menor. Los pequeños comparan dos dados.
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

function values(band: AgeBand, rng: Rng): number[] {
  if (band === 'small') {
    for (;;) {
      const a = rng.int(1, 6);
      const b = rng.int(1, 6);
      if (Math.abs(a - b) >= 2) return [a, b];
    }
  }
  const max = band === 'medium' ? 10 : 20;
  return rng.shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, 3);
}

function question(band: AgeBand, rng: Rng): Question {
  const vs = values(band, rng);
  const more = band === 'small' ? true : rng.chance(0.5);
  const target = more ? Math.max(...vs) : Math.min(...vs);
  const toVisual = (v: number): Visual => (band === 'small' ? { type: 'dots', value: v } : { type: 'digit', value: v });
  const options = toOptions(vs.map(toVisual));
  return {
    kind: 'biggest',
    prompt: { layout: 'basket', items: [{ type: 'basket', full: more }] },
    options,
    answer: { form: 'choice', correct: options.filter((o) => vs[o.id] === target).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

export function biggestQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
