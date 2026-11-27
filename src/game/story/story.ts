/**
 * Escenas de historia de un mundo (prólogo y final, `docs/MUNDO-1.md`): cuándo se ven. Cada escena se
 * ve una vez por perfil y queda marcada en `GameState.seen`. TypeScript puro (sin Phaser).
 */

import type { GameState, WorldShape } from '../state';

export type StoryScene = 'prologo' | 'final';

/** Clave de la marca de una escena vista, p. ej. `prologo:arcoiris`. */
export function storyKey(scene: StoryScene, world: string): string {
  return `${scene}:${world}`;
}

/** El perfil ya tiene algún nivel del mundo hecho o pendiente. */
function hasProgress(state: GameState, world: string): boolean {
  const progress = state.worlds.get(world);
  return progress !== undefined && (progress.stars.size > 0 || progress.pending.size > 0);
}

/**
 * Si el nivel `level` empieza con el prólogo del mundo: el mundo lo tiene, es su nivel 1 y, o se pide
 * expresamente (`forced`, al tocar la madriguera del mapa), o el perfil no lo ha visto y no tiene
 * progreso en el mundo (un perfil de antes del prólogo no lo ve de repente).
 */
export function shouldPlayPrologue(state: GameState, world: WorldShape & { prologue?: boolean }, level: number, forced = false): boolean {
  if (!world.prologue || level !== 1) return false;
  if (forced) return true;
  return !state.seen.has(storyKey('prologo', world.id)) && !hasProgress(state, world.id);
}

/** Apunta que el perfil ha visto la escena. */
export function markSeen(state: GameState, scene: StoryScene, world: string): void {
  state.seen.add(storyKey(scene, world));
}

/**
 * Si al abrir el mapa del mundo toca su final: el mundo lo tiene, todos sus niveles están hechos o
 * pendientes y el perfil aún no lo ha visto.
 */
export function shouldPlayFinale(state: GameState, world: WorldShape & { finale?: boolean }): boolean {
  if (!world.finale || state.seen.has(storyKey('final', world.id))) return false;
  const progress = state.worlds.get(world.id);
  if (!progress) return false;
  for (let level = 1; level <= world.levelCount; level++) {
    if (!progress.stars.has(level) && !progress.pending.has(level)) return false;
  }
  return true;
}
