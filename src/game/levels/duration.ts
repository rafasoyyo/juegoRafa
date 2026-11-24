/**
 * Duración estimada de un nivel a partir de sus datos. TypeScript puro (sin Phaser).
 *
 * Los coeficientes son una estimación del ritmo de un niño que juega con calma; se calibran
 * cronometrando niveles reales en el móvil.
 */

import { flagTile } from './parse';
import { RUN_SPEED, START_TILE, TILE, type LevelData } from './types';

/** Segundos extra por cada elemento al jugar con calma: pararse, colocarse, saltar, subir y bajar. */
export const CALM_SECONDS = { block: 2.5, platform: 1.5, step: 1, spikes: 1 } as const;

export interface Duration {
  /** Corriendo a tope sin pararse (en carrera la velocidad horizontal no cambia al saltar). */
  fastS: number;
  /** Con calma y golpeando todos los bloques. */
  calmS: number;
}

export function estimateDuration(level: LevelData): Duration {
  const fastS = ((flagTile(level) - START_TILE) * TILE) / RUN_SPEED;
  const calmS =
    fastS +
    CALM_SECONDS.block * level.blocks.length +
    CALM_SECONDS.platform * level.platforms.length +
    CALM_SECONDS.step * level.steps.length +
    CALM_SECONDS.spikes * level.spikes.length;
  return { fastS, calmS };
}

export interface DurationLimits {
  /** Mínimo a tope, en s. */
  minFastS: number;
  /** Mínimo y máximo con calma, en s. */
  minCalmS: number;
  maxCalmS: number;
}

/** Límites de duración del nivel `level` (1..12): los niveles 7 a 12 son más largos. */
export function durationLimits(level: number): DurationLimits {
  return level <= 6 ? { minFastS: 30, minCalmS: 60, maxCalmS: 120 } : { minFastS: 35, minCalmS: 90, maxCalmS: 150 };
}
