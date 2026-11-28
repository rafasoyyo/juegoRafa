/**
 * «Calcetines» (mundo 2, nivel 9): emparejar. Los pequeños buscan la pareja de un calcetín; los demás
 * miran una fila de calcetines y dicen si todos tienen pareja o sobra uno (pares y nones, hasta 10 o 20).
 */

import { distinctQuestions } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

/** Colores de calcetín disponibles (la vista los pinta). */
export const SOCK_COLORS = 5;

function match(rng: Rng): Question {
  const model = rng.int(0, SOCK_COLORS - 1);
  const pattern = rng.int(0, 2);
  const others = rng.shuffle(Array.from({ length: SOCK_COLORS }, (_, i) => i).filter((c) => c !== model)).slice(0, 2);
  // Uno con el mismo color y otro dibujo, para que haya que mirar bien.
  const visuals: Visual[] = rng.shuffle([
    { type: 'sock', color: model, pattern },
    { type: 'sock', color: others[0]!, pattern },
    { type: 'sock', color: model, pattern: (pattern + 1) % 3 },
  ]);
  const options = toOptions(visuals);
  return {
    kind: 'socks',
    prompt: { layout: 'socks', items: [{ type: 'sock', color: model, pattern }], scene: { kind: 'socks', mode: 'match', model } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => o.visual.type === 'sock' && o.visual.color === model && o.visual.pattern === pattern).map((o) => o.id) },
    hint: 'dim-wrong',
  };
}

function parity(band: AgeBand, rng: Rng): Question {
  const max = band === 'medium' ? 10 : 20;
  const n = rng.int(3, max);
  // Parejas de colores repetidos y, si es impar, uno suelto; todo en desorden.
  const pairs = Math.floor(n / 2);
  const socks: number[] = [];
  for (let i = 0; i < pairs; i++) {
    const c = i % SOCK_COLORS;
    socks.push(c, c);
  }
  if (n % 2 === 1) socks.push(rng.int(0, SOCK_COLORS - 1));
  const options = toOptions([
    { type: 'pairs', odd: false },
    { type: 'pairs', odd: true },
  ]);
  return {
    kind: 'socks',
    prompt: { layout: 'socks', items: [], scene: { kind: 'socks', mode: 'parity', socks: rng.shuffle(socks) } },
    options,
    answer: { form: 'choice', correct: [n % 2 === 1 ? 1 : 0] },
    hint: 'pair-up',
  };
}

export function socksQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => (band === 'small' ? match(rng) : parity(band, rng)));
}
