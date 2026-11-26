/**
 * «El vecino» (mundo 2, nivel 4): una fila de números con un hueco; se toca el que va en él. Los pequeños
 * buscan el siguiente (con puntos), los medianos el anterior o el siguiente y los mayores, además, el de
 * en medio.
 */

import { distinctQuestions, numberChoices } from './helpers';
import type { Rng } from './rng';
import { toOptions, type AgeBand, type Question, type Visual } from './types';

type Mode = 'next' | 'previous' | 'between';

function question(band: AgeBand, rng: Rng): Question {
  const max = band === 'small' ? 5 : band === 'medium' ? 10 : 20;
  const mode: Mode = band === 'small' ? 'next' : band === 'medium' ? rng.pick(['next', 'previous'] as const) : rng.pick(['next', 'previous', 'between'] as const);
  // Valor del hueco: siempre con su vecino (o vecinos) dentro del rango.
  const value = mode === 'next' ? rng.int(2, max) : mode === 'previous' ? rng.int(1, max - 1) : rng.int(2, max - 1);
  const toVisual = (v: number): Visual => (band === 'small' ? { type: 'dots', value: v } : { type: 'digit', value: v });
  const row: (number | null)[] = mode === 'next' ? [value - 1, null] : mode === 'previous' ? [null, value + 1] : [value - 1, null, value + 1];
  const holeIndex = row.indexOf(null);
  const values = numberChoices(rng, value, band === 'big' ? 4 : 3, 1, max);
  const options = toOptions(values.map(toVisual));
  return {
    kind: 'neighbor',
    // El hueco lleva un marcador cualquiera: la fila lo dibuja como «?».
    prompt: { layout: 'row', items: row.map((v) => toVisual(v ?? value)), holeIndex },
    options,
    answer: { form: 'choice', correct: options.filter((o) => values[o.id] === value).map((o) => o.id) },
    hint: 'rhythm',
  };
}

export function neighborQuiz(band: AgeBand, rng: Rng): Question[] {
  return distinctQuestions(() => question(band, rng));
}
