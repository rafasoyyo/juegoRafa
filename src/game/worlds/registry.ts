/**
 * Registro de mundos: los mundos del juego en el orden del selector, más los huecos de los que aún
 * no existen. Dar de alta un mundo nuevo es añadir su definición a `WORLDS` y, si ocupa un hueco,
 * quitarlo de `UPCOMING`. TypeScript puro (sin Phaser).
 */

import type { LevelData } from '../levels/types';
import { ARCOIRIS } from './arcoiris';
import type { SelectorButton, WorldDef, WorldId } from './types';

/** Mundos jugables, en el orden del selector. El primero es el que se abre por defecto. */
export const WORLDS: readonly WorldDef[] = [ARCOIRIS];

/** Mundo en el que estaba el progreso guardado antes de que hubiera varios mundos. */
export const LEGACY_WORLD: WorldId = ARCOIRIS.id;

/** Botones del selector de los mundos que aún no existen: tiemblan al tocarlos. */
export const UPCOMING: readonly SelectorButton[] = [
  { color: 0xf1ecfb, shadow: 0xd9cfe0, label: 'Aa' },
  { color: 0xe4f4e8, shadow: 0xbfe0c6, icon: 'icon-shapes', iconSize: 88 },
  { color: 0xe8edf3, shadow: 0xc9d3de, icon: 'icon-lock', iconSize: 42 },
];

/** Definición del mundo `id`; si no existe, el primero. */
export function worldDef(id: WorldId | undefined): WorldDef {
  return WORLDS.find((w) => w.id === id) ?? WORLDS[0]!;
}

/** Datos del nivel `level` del mundo (1..`levelCount`); fuera de rango da el más cercano. */
export function levelData(world: WorldDef, level: number): LevelData {
  const i = Math.min(Math.max(Math.round(level), 1), world.levels.length) - 1;
  return world.levels[i]!;
}

/** Nivel `level` dentro del rango del mundo (los datos de una escena pueden venir sin él). */
export function clampLevel(world: WorldDef, level: number | undefined): number {
  return Math.min(Math.max(Math.round(level ?? 1), 1), world.levelCount);
}

let shown: WorldId | undefined;

/** Mundo que muestra el mapa: el último que se abrió en esta sesión, o el primero. */
export function shownWorld(): WorldDef {
  return worldDef(shown);
}

/** Recuerda el mundo que se está jugando, para volver a su mapa. */
export function showWorld(id: WorldId): void {
  shown = id;
}
