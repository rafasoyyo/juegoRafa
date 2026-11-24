/**
 * Reglas del pinchazo y de la fruta del nivel, sin Phaser: qué bloque esconde la fresa, cómo se
 * pierde una galleta y en qué fase está el modo invencible. Tiempos en milisegundos.
 */

import { JUMP_SPEED } from '../level-course';
import { RUN_SPEED } from '../levels/types';

/** Fresa: impulso al salir del bloque (px/s) y tamaño con que se dibuja (px). */
export const FRUIT_VX = 0.35 * RUN_SPEED;
export const FRUIT_VY = 0.6 * JUMP_SPEED;
export const FRUIT_SIZE = 56;

/** Duración del modo invencible desde que Rufo come la fresa. */
export const POWER_MS = 8000;
/** Últimos milisegundos del modo invencible, en los que el brillo avisa de que se acaba. */
export const POWER_WARN_MS = 2000;

export type PowerPhase = 'off' | 'on' | 'ending';

/** Índice del bloque «?» que esconde la fresa, o -1 si el nivel no tiene bloques. */
export function pickFruitBlock(blockCount: number, rng: () => number = Math.random): number {
  const n = Math.floor(blockCount);
  if (n <= 0) return -1;
  return Math.min(n - 1, Math.max(0, Math.floor(rng() * n)));
}

/** Un pinchazo resta una galleta del contador del nivel, sin bajar nunca de 0. */
export function loseCookie(cookies: number): { cookies: number; lost: boolean } {
  if (cookies <= 0) return { cookies: 0, lost: false };
  return { cookies: cookies - 1, lost: true };
}

/** Fase del modo invencible en `now` si empezó en `startedAt` (`-Infinity` = nunca). */
export function powerPhase(now: number, startedAt: number): PowerPhase {
  const elapsed = now - startedAt;
  if (!(elapsed >= 0) || elapsed >= POWER_MS) return 'off';
  return elapsed >= POWER_MS - POWER_WARN_MS ? 'ending' : 'on';
}
