/**
 * Mecánica C del río, «La barca de diez» (`docs/MUNDO-2.md`): una barca que solo zarpa llena, con los
 * asientos en forma de marco. El niño elige cuántos patitos faltan. TypeScript puro y con semilla.
 */

import { numberChoices } from '../quiz/helpers';
import type { Rng } from '../quiz/rng';
import type { AgeBand } from '../quiz/types';
import type { Face } from './count-blocks';

export type BoatCapacity = 5 | 10 | 20;

export interface BoatChallenge {
  kind: 'boat';
  /** Asientos de la barca: 5, 10 o 20 (dos marcos). */
  capacity: BoatCapacity;
  /** Patitos ya sentados. */
  seated: number;
  /** Los que faltan para llenarla: la respuesta. */
  value: number;
  /** Las tres caras de los bloques. */
  options: Face[];
  correct: number;
}

/** Barca de 5 para los pequeños, de 10 para los medianos y doble para los mayores. */
export function boatCapacity(band: AgeBand): BoatCapacity {
  return band === 'small' ? 5 : band === 'medium' ? 10 : 20;
}

function face(capacity: BoatCapacity, value: number): Face {
  // Puntos de dado hasta 9; con la barca doble, marcos de diez como los asientos.
  return capacity === 20 ? { type: 'tenframe', value } : { type: 'dots', value };
}

export function boatChallenge(band: AgeBand, rng: Rng): BoatChallenge {
  const capacity = boatCapacity(band);
  // Siempre hay alguien sentado y algún asiento libre.
  const seated = rng.int(1, capacity - 1);
  const value = capacity - seated;
  const choices = numberChoices(rng, value, 3, 1, capacity - 1);
  return {
    kind: 'boat',
    capacity,
    seated,
    value,
    options: choices.map((v) => face(capacity, v)),
    correct: choices.indexOf(value),
  };
}
