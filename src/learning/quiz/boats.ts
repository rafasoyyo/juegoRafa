/**
 * «Los barcos del puerto» (mundo 2, nivel 11): los barcos llevan números y se tocan de menor a mayor para
 * que salgan en orden. 3 barcos con puntos (3-4 años), 4 con cifras hasta 10 (5-6) y 5 hasta 20 (7-8).
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

function question(band: AgeBand, rng: Rng): Question {
  const n = band === 'small' ? 3 : band === 'medium' ? 4 : 5;
  const max = band === 'small' ? 6 : band === 'medium' ? 10 : 20;
  const values = rng.shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, n);
  const toVisual = (v: number): Visual => (band === 'small' ? { type: 'dots', value: v } : { type: 'digit', value: v });
  const sorted = [...values].sort((a, b) => a - b);
  let shuffled = values;
  while (shuffled.every((v, i) => v === sorted[i])) shuffled = rng.shuffle(values);
  const options = toOptions(shuffled.map(toVisual), 'scene');
  return {
    kind: 'boats',
    prompt: { layout: 'order', items: [], scene: { kind: 'order', direction: 'up' } },
    options,
    answer: { form: 'multi', targets: sorted.map((v) => shuffled.indexOf(v)), ordered: true },
    hint: 'compare-two',
  };
}

export function boatsQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
