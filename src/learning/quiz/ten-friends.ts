/**
 * «Los amigos del 10» (mundo 2, nivel 7): el marco lleno es la meta; ¿cuántas fichas faltan para llegar?
 * Completar el 5 (3-4 años), el 10 (5-6) o el 20 (7-8).
 */

import { numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

export function friendsTotal(band: AgeBand): 5 | 10 | 20 {
  return band === 'small' ? 5 : band === 'medium' ? 10 : 20;
}

function question(band: AgeBand, rng: Rng, filled: number): Question {
  const cells = friendsTotal(band);
  const value = cells - filled;
  const values = numberChoices(rng, value, band === 'big' ? 4 : 3, 1, cells - 1);
  const toVisual = (v: number): Visual => (band === 'small' ? { type: 'dots', value: v } : { type: 'digit', value: v });
  const options = toOptions(values.map(toVisual));
  return {
    kind: 'ten-friends',
    prompt: { layout: 'ten-frame', items: [], scene: { kind: 'ten-frame', cells, filled, ask: 'missing', whole: true } },
    options,
    answer: { form: 'choice', correct: options.filter((o) => values[o.id] === value).map((o) => o.id) },
    hint: 'count-up',
  };
}

export function tenFriendsQuiz(band: AgeBand, rng: Rng): Question[] {
  const total = friendsTotal(band);
  const amounts = rng.shuffle(Array.from({ length: total - 1 }, (_, i) => i + 1)).slice(0, 3);
  return amounts.map((n) => question(band, rng, n));
}
