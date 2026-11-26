/**
 * Convierte el progreso de `GameState` a un objeto JSON y de vuelta, validando lo leído.
 *
 * Cada mundo guarda su progreso bajo su id. El progreso guardado antes de que hubiera varios mundos
 * (estrellas y pendientes sueltos) pasa al mundo en el que se jugó, `LEGACY_WORLD`.
 */

import { HATS, createGameState, worldProgress, type GameState, type HatId, type WorldShape } from '../state';
import { LEGACY_WORLD, WORLDS } from '../worlds/registry';

export interface SavedWorldProgress {
  /** Pares [nivel, estrellas]. */
  stars: [number, number][];
  /** Niveles pendientes (jugados sin superar la prueba). */
  pending: number[];
  /** Medalla del castillo; falta si no se ha ganado (o en lo guardado antes del castillo). */
  medal?: boolean;
}

export interface SavedProgress {
  /** Progreso de cada mundo, por su id. Falta en el progreso guardado antes de los mundos. */
  worlds?: Record<string, SavedWorldProgress>;
  /** Formato antiguo, de antes de los mundos: pares [nivel, estrellas] del primer mundo. */
  stars?: [number, number][];
  /** Formato antiguo: niveles pendientes del primer mundo. Falta en el guardado antes de las pruebas. */
  pending?: number[];
  cookies: number;
  ownedHats: string[];
  hat: string;
}

export function encodeProgress(state: GameState): SavedProgress {
  const worlds: Record<string, SavedWorldProgress> = {};
  for (const [id, progress] of state.worlds) {
    worlds[id] = { stars: [...progress.stars], pending: [...progress.pending], ...(progress.medal ? { medal: true } : {}) };
  }
  return { worlds, cookies: state.cookies, ownedHats: [...state.ownedHats], hat: state.hat };
}

const isHat = (v: unknown): v is HatId => typeof v === 'string' && (HATS as readonly string[]).includes(v);

const isLevel = (v: unknown, world: WorldShape): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= world.levelCount;

/** Lee estrellas, pendientes y medalla de un mundo; lo que no sea válido se ignora. */
function decodeWorld(state: GameState, world: WorldShape, stars: unknown, pending: unknown, medal?: unknown): void {
  const progress = worldProgress(state, world.id);
  if (Array.isArray(stars)) {
    for (const pair of stars) {
      if (!Array.isArray(pair)) continue;
      const [level, value] = pair as unknown[];
      if (!isLevel(level, world) || typeof value !== 'number' || !Number.isFinite(value)) continue;
      progress.stars.set(level, Math.max(1, Math.min(3, Math.round(value))));
    }
  }
  if (Array.isArray(pending)) {
    for (const level of pending) if (isLevel(level, world) && !progress.stars.has(level)) progress.pending.add(level);
  }
  progress.medal = medal === true;
  if (progress.stars.size === 0 && progress.pending.size === 0 && !progress.medal) state.worlds.delete(world.id);
}

/**
 * Mundos que no están en el registro (p. ej. uno que solo existe en otra rama de desarrollo): se
 * conserva su progreso, con este tope de niveles, para no perderlo al guardar.
 */
const UNKNOWN_WORLD_MAX_LEVEL = 99;

/**
 * Estado a partir de lo guardado, con los mundos `worlds` (los registrados). Lo que no sea válido se
 * ignora; con basura total sale un estado nuevo.
 */
export function decodeProgress(raw: unknown, worlds: readonly WorldShape[] = WORLDS): GameState {
  const state = createGameState();
  if (typeof raw !== 'object' || raw === null) return state;
  const r = raw as Record<string, unknown>;

  if (typeof r.worlds === 'object' && r.worlds !== null && !Array.isArray(r.worlds)) {
    const saved = r.worlds as Record<string, unknown>;
    for (const [id, w] of Object.entries(saved)) {
      if (typeof w !== 'object' || w === null) continue;
      const world = worlds.find((known) => known.id === id) ?? { id, levelCount: UNKNOWN_WORLD_MAX_LEVEL };
      const { stars, pending, medal } = w as Record<string, unknown>;
      decodeWorld(state, world, stars, pending, medal);
    }
  } else {
    const legacy = worlds.find((w) => w.id === LEGACY_WORLD);
    if (legacy) decodeWorld(state, legacy, r.stars, r.pending);
  }
  if (typeof r.cookies === 'number' && Number.isFinite(r.cookies)) state.cookies = Math.max(0, Math.floor(r.cookies));
  if (Array.isArray(r.ownedHats)) for (const h of r.ownedHats) if (isHat(h)) state.ownedHats.add(h);
  if (isHat(r.hat) && state.ownedHats.has(r.hat)) state.hat = r.hat;
  return state;
}
