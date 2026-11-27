/**
 * Mecánica B del río, «El puente de los números» (`docs/MUNDO-2.md`): un puente de tramos numerados al
 * que le falta uno. TypeScript puro y con semilla.
 */

import { numberChoices } from '../quiz/helpers';
import type { Rng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import type { Face } from './count-blocks';

export const BRIDGE_SECTIONS = 5;
/** El hueco deja al menos este número de tramos firmes delante (donde van los bloques). */
export const MIN_FIRM_BEFORE = 2;

export interface BridgeChallenge {
  kind: 'bridge';
  /** Número de cada tramo, de izquierda a derecha. */
  values: number[];
  /** Índice del tramo que falta. */
  gap: number;
  /** Si se ve el número de cada tramo (el del hueco nunca). */
  shown: boolean[];
  /** Cara de cada tramo. */
  faces: Face[];
  /** El número del hueco. */
  value: number;
  /** Las tres caras de los bloques. */
  options: Face[];
  correct: number;
}

function face(band: AgeBand, value: number): Face {
  return band === 'small' ? { type: 'dots', value } : { type: 'digit', value };
}

export function bridgeChallenge(band: AgeBand, rng: Rng): BridgeChallenge {
  const n = BRIDGE_SECTIONS;
  let step = 1;
  let start: number;
  let gap: number;
  let shown: (i: number) => boolean;
  if (band === 'small') {
    // El siguiente, del 1 al 5: solo se ven los tramos de antes del hueco.
    start = 1;
    gap = rng.int(MIN_FIRM_BEFORE, n - 1);
    shown = (i) => i < gap;
  } else if (band === 'medium') {
    start = rng.int(1, 10 - (n - 1));
    if (rng.chance(0.5)) {
      // El siguiente: se ven los de antes.
      gap = rng.int(MIN_FIRM_BEFORE, n - 1);
      shown = (i) => i < gap;
    } else {
      // El anterior: se ven los de después.
      gap = rng.int(MIN_FIRM_BEFORE, n - 2);
      shown = (i) => i > gap;
    }
  } else {
    // De 2 en 2 entre 0 y 20, todo a la vista y el hueco en cualquier tramo con dos firmes delante.
    step = 2;
    start = rng.int(0, 20 - step * (n - 1));
    gap = rng.int(MIN_FIRM_BEFORE, n - 1);
    shown = () => true;
  }
  const values = Array.from({ length: n }, (_, i) => start + i * step);
  const value = values[gap]!;
  const [min, max] = band === 'small' ? [1, 5] : band === 'medium' ? [1, 10] : [0, 20];
  const offsets = step === 2 ? [2, -2, 1, -1] : [1, -1, 2, -2];
  const choices = numberChoices(rng, value, 3, min, max, offsets);
  return {
    kind: 'bridge',
    values,
    gap,
    shown: values.map((_, i) => i !== gap && shown(i)),
    faces: values.map((v) => face(band, v)),
    value,
    options: choices.map((v) => face(band, v)),
    correct: choices.indexOf(value),
  };
}
