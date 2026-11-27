/**
 * El castillo de un mundo (`docs/MUNDO-2.md`, «El castillo»): una pieza que recibe una lista de retos y
 * siempre da la medalla. Los retos del recorrido van seguidos en un recorrido corto que se monta solo, y
 * las preguntas de la bandera se hacen al llegar a ella. Así el mismo castillo sirve para cualquier mundo.
 * TypeScript puro (sin Phaser).
 */

import type { QuizKind } from '../../learning/quiz';
import { challengeZone, FLAG_TILES_FROM_END, START_TILE, type AmbientId, type ChallengeData, type ChallengeKind, type LevelData } from '../levels/types';

/**
 * Un reto del castillo: uno del recorrido (`challenge`) o una pregunta de la bandera de una de las
 * pruebas de `quiz`, elegida al azar y distinta de las de los otros pasos mientras se pueda.
 */
export type CastleStep = { challenge: ChallengeKind } | { quiz: readonly QuizKind[] };

export interface CastleDef {
  /** Paisaje del recorrido del castillo. */
  ambient: AmbientId;
  /** Retos en orden: los del recorrido se juegan antes de la bandera y las preguntas, en ella. */
  steps: readonly CastleStep[];
  /**
   * Textura de la medalla (con `-l` detrás, la grande del final del castillo). Sin ella, la medalla de
   * siempre (`medal`).
   */
  medal?: string;
}

/** Textura de la medalla de un castillo, pequeña o grande. */
export function medalTexture(castle: CastleDef | undefined, large = false): string {
  const key = castle?.medal ?? 'medal';
  return large ? `${key}-l` : key;
}

/** Baldosas libres tras la salida y antes de la bandera (las de `validate.ts`). */
const START_CLEAR = 6;
const FLAG_CLEAR = 5;
/** Suelo llano entre dos retos seguidos, en baldosas. */
export const CASTLE_GAP = 4;
/** Recorrido sin retos: lo justo para correr hasta la bandera. */
const EMPTY_RUN = 8;

/** Mecánicas del recorrido del castillo, en orden. */
export function castleChallenges(castle: CastleDef): ChallengeKind[] {
  return castle.steps.flatMap((s) => ('challenge' in s ? [s.challenge] : []));
}

/** Pruebas entre las que se elige cada pregunta de la bandera del castillo, en orden. */
export function castleQuizPools(castle: CastleDef): (readonly QuizKind[])[] {
  return castle.steps.flatMap((s) => ('quiz' in s ? [s.quiz] : []));
}

/**
 * Recorrido del castillo: suelo llano con los retos uno tras otro, separados por `CASTLE_GAP` baldosas,
 * sin bloques, pinchos ni enemigos. Ningún reto hace la demostración: ya se vieron en los niveles.
 */
export function castleCourse(castle: CastleDef, id = 'castillo'): LevelData {
  let cursor = START_TILE + START_CLEAR;
  const challenges: ChallengeData[] = castleChallenges(castle).map((kind) => {
    // `challengeZone` es relativo a `x`: se coloca el reto para que su zona empiece en `cursor`.
    const offset = challengeZone({ kind, x: 0 }).from;
    const x = cursor - offset;
    cursor = challengeZone({ kind, x }).to + CASTLE_GAP;
    return { kind, x, show: 'tenframe', reverse: false, demo: false };
  });
  const end = challenges.length > 0 ? cursor - CASTLE_GAP + FLAG_CLEAR : START_TILE + EMPTY_RUN;
  return { id, ambient: castle.ambient, length: end + FLAG_TILES_FROM_END, steps: [], platforms: [], blocks: [], spikes: [], challenges };
}
