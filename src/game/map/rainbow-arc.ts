/**
 * Arco de gajos del mapa del arcoíris (`docs/MUNDO-1.md`, «3. El mapa del arcoíris»): un gajo por
 * nivel, de izquierda a derecha, que se pinta cuando su nivel está hecho o pendiente. TypeScript puro
 * (sin Phaser): `MapScene` lo dibuja y anima.
 */

import type { GameState, WorldShape } from '../state';

/** Separación entre gajos vecinos, en radianes. */
export const BAND_GAP = 0.012;

/**
 * Niveles cuyo gajo está pintado, en orden: los hechos o pendientes. Uno terminado con 0 estrellas no
 * queda hecho ni pendiente, así que no pinta su gajo.
 */
export function paintedBands(state: GameState, world: WorldShape): number[] {
  const progress = state.worlds.get(world.id);
  if (!progress) return [];
  const out: number[] = [];
  for (let level = 1; level <= world.levelCount; level++) {
    if (progress.stars.has(level) || progress.pending.has(level)) out.push(level);
  }
  return out;
}

/**
 * Ángulos (en radianes, con la `y` hacia abajo como en Phaser) de inicio y fin del gajo del nivel
 * `level` sobre el semicírculo de arriba, que va de π (izquierda) a 2π (derecha) pasando por 3π/2
 * (arriba). Deja `BAND_GAP` entre gajos vecinos.
 */
export function bandAngles(level: number, count: number): { start: number; end: number } {
  const step = Math.PI / count;
  const start = Math.PI + (level - 1) * step;
  return { start: start + BAND_GAP / 2, end: start + step - BAND_GAP / 2 };
}

/**
 * Qué gajos se han visto ya pintados en esta sesión, por perfil y mundo. La primera vez que se
 * pregunta por una clave, todos los pintados cuentan como vistos (un perfil abierto con progreso no
 * los anima); después, `take` devuelve solo los nuevos, una sola vez.
 */
export class RainbowMemory {
  private seen = new Map<string, Set<number>>();

  /** Gajos pintados que aún no se habían visto, en orden; quedan apuntados como vistos. */
  take(key: string, painted: readonly number[]): number[] {
    const seen = this.seen.get(key);
    if (!seen) {
      this.seen.set(key, new Set(painted));
      return [];
    }
    const fresh = painted.filter((level) => !seen.has(level));
    for (const level of fresh) seen.add(level);
    return fresh;
  }

  /** Olvida todo (pruebas). */
  clear(): void {
    this.seen.clear();
  }
}

/** Memoria única de la aplicación, compartida por todas las aperturas del mapa. */
export const rainbowMemory = new RainbowMemory();
