/**
 * Mecánica A del río, «Bloques que cuentan» (`docs/MUNDO-2.md`): un cartel con una cantidad y tres
 * bloques con cifras (o al revés). TypeScript puro y con semilla.
 */

import { numberChoices } from '../quiz/helpers';
import type { Rng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';

/** Cómo se muestra la cantidad: puntos (en dado hasta 9, luego en filas de 5) o marco de diez. */
export type QuantityShow = 'dots' | 'tenframe';

/** Cara de un cartel o de un bloque. `tenframe` con más de 10 son dos marcos. */
export type Face = { type: 'digit'; value: number } | { type: 'dots'; value: number } | { type: 'tenframe'; value: number };

export interface CountSpec {
  show: QuantityShow;
  reverse: boolean;
}

export interface CountChallenge {
  kind: 'count';
  value: number;
  sign: Face;
  /** Las tres caras de los bloques, de izquierda a derecha. */
  options: Face[];
  /** Índice del bloque correcto en `options`. */
  correct: number;
}

export const COUNT_OPTIONS = 3;

const RANGE: Record<AgeBand, [number, number]> = { small: [1, 5], medium: [1, 10], big: [1, 20] };

export function countRange(band: AgeBand): [number, number] {
  return RANGE[band];
}

/** Forma de la cantidad para la franja: los pequeños, siempre puntos; los mayores, marcos de diez. */
function quantity(band: AgeBand, show: QuantityShow, value: number): Face {
  if (band === 'small') return { type: 'dots', value };
  if (band === 'big') return { type: 'tenframe', value };
  return { type: show, value };
}

/** Un reto con la respuesta `value`. */
export function countChallenge(band: AgeBand, rng: Rng, spec: CountSpec, value: number): CountChallenge {
  const [min, max] = RANGE[band];
  const offsets = band === 'big' ? [1, -1, 10, -10, 2, -2] : [1, -1, 2, -2];
  const values = numberChoices(rng, value, COUNT_OPTIONS, min, max, offsets);
  // Los pequeños ven puntos en los dos lados: el cartel en dado y los bloques también.
  const digitFace = (v: number): Face => (band === 'small' ? { type: 'dots', value: v } : { type: 'digit', value: v });
  const sign = spec.reverse ? digitFace(value) : quantity(band, spec.show, value);
  const options = values.map((v) => (spec.reverse ? quantity(band, spec.show, v) : digitFace(v)));
  return { kind: 'count', value, sign, options, correct: values.indexOf(value) };
}

/** Los retos de un nivel, con respuestas distintas mientras quepan en el rango. */
export function countChallenges(band: AgeBand, rng: Rng, specs: readonly CountSpec[]): CountChallenge[] {
  const [min, max] = RANGE[band];
  const pool = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i));
  return specs.map((spec, i) => countChallenge(band, rng, spec, pool[i % pool.length]!));
}
