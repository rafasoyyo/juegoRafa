/**
 * «Saltos de rana» (mundo 2, nivel 10): la rana sale de un número y da varios saltos iguales por la recta;
 * se toca dónde acaba. De 1 en 1 hasta 5 (3-4 años), de 1 o de 2 hasta 10 (5-6) y de 2, 3 o 5 hasta 20 (7-8).
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

function question(band: AgeBand, rng: Rng): Question {
  const to = band === 'small' ? 5 : band === 'medium' ? 10 : 20;
  const from = band === 'small' ? 1 : 0;
  const size = band === 'small' ? 1 : band === 'medium' ? rng.pick([1, 2]) : rng.pick([2, 3, 5]);
  const count = rng.int(band === 'small' ? 1 : 2, Math.min(4, Math.floor((to - from) / size)));
  const start = band === 'big' ? rng.int(0, to - size * count) : from;
  const target = start + size * count;
  const labels = band === 'small' ? [1] : band === 'medium' ? [0, 5, 10] : [0, 10, 20];
  // Sitios separados al menos dos marcas: el bueno, uno antes y otro después si caben.
  const near = rng.shuffle([target - 2, target + 2, target - 3, target + 3, target - 4, target + 4, target - 6, target + 6]).filter((v) => v > start && v <= to && !labels.includes(v));
  // En la recta corta de los pequeños caben todas las marcas después de la salida.
  const spots = band === 'small' ? Array.from({ length: to - start }, (_, i) => start + 1 + i) : [target];
  // En la recta del 0 al 20 las marcas están más juntas: tres de separación.
  const gap = band === 'big' ? 3 : 2;
  for (const v of band === 'small' ? [] : near) {
    if (spots.length >= 3) break;
    if (spots.every((o) => Math.abs(o - v) >= gap)) spots.push(v);
  }
  spots.sort((a, b) => a - b);
  const options = toOptions(
    spots.map((v): Visual => ({ type: 'digit', value: v })),
    'scene',
  );
  return {
    kind: 'frog-jumps',
    prompt: { layout: 'number-line', items: [], scene: { kind: 'number-line', from, to, step: 1, labels, target, jumps: { start, size, count } } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.visual.type === 'digit' && o.visual.value === target).map((o) => o.id) },
    hint: 'hop',
  };
}

export function frogJumpsQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
